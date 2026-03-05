import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { buildAdminEmailHtml, buildClientEmailHtml } from './emailTemplates.js';
import { verifyToken } from './validate-access.js';
import { serverEnv, getAllowedOrigins } from './config.js';

// Inicializar Resend
const resend = new Resend(serverEnv.resendApiKey);

// ─────────────────────────────────────────────────────
// RATE LIMITING (en memoria - básico)
// ─────────────────────────────────────────────────────

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_MAX = 5; // máximo de envíos
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutos

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    // Nueva ventana o expirada
    rateLimitMap.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false; // Límite excedido
  }

  // Incrementar contador
  entry.count += 1;
  return true;
}

// Limpiar entradas expiradas cada 15 minutos
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(ip);
    }
  }
}, 15 * 60 * 1000);

// ─────────────────────────────────────────────────────
// VALIDACIONES
// ─────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10 MB en bytes (base64 ~33% más grande)

// ─────────────────────────────────────────────────────
// VALIDACIÓN DE ORIGEN (CORS)
// ─────────────────────────────────────────────────────

function isAllowedOrigin(req: VercelRequest): boolean {
  const origin = req.headers.origin || req.headers.referer;

  // En desarrollo, permitir localhost
  if (serverEnv.isDevelopment) {
    console.log(`✅ Modo desarrollo - origen permitido: ${origin || 'sin origen'}`);
    return true;
  }

  // Obtener orígenes permitidos desde la configuración centralizada
  const allowedOrigins = getAllowedOrigins();

  // Log de configuración para debugging
  console.log('🔍 Validación de origen:');
  console.log(`   Origen recibido: ${origin || 'SIN ORIGEN'}`);
  console.log(`   Orígenes permitidos: ${allowedOrigins.length > 0 ? allowedOrigins.join(', ') : 'NINGUNO CONFIGURADO'}`);

  // Si no hay origen (llamada directa desde servidor/Postman), rechazar
  if (!origin) {
    console.log('⚠️ RECHAZADO: Solicitud sin header origin/referer');
    return false;
  }

  // Verificar si el origen está en la lista permitida
  const isAllowed = allowedOrigins.some(allowed => origin.startsWith(allowed));

  if (!isAllowed) {
    console.log(`🚫 RECHAZADO: Origen "${origin}" no está en la lista permitida`);
  } else {
    console.log(`✅ PERMITIDO: Origen "${origin}" está autorizado`);
  }

  return isAllowed;
}

function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

function estimateBase64Size(base64: string): number {
  // Eliminar prefijo data:application/pdf;base64, si existe
  const cleanBase64 = base64.replace(/^data:.*?;base64,/, '');
  // Calcular tamaño aproximado en bytes
  return (cleanBase64.length * 3) / 4;
}

// ─────────────────────────────────────────────────────
// HANDLER PRINCIPAL
// ─────────────────────────────────────────────────────

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Método no permitido. Usa POST.',
    });
  }

  // Validar origen de la petición
  if (!isAllowedOrigin(req)) {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado: origen no autorizado',
    });
  }

  try {
    // Obtener IP del cliente
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      (req.headers['x-real-ip'] as string) ||
      'unknown';

    // Verificar rate limit
    if (!checkRateLimit(ip)) {
      return res.status(429).json({
        success: false,
        message: 'Demasiados intentos. Por favor intenta de nuevo en 10 minutos.',
      });
    }

    // ─── VERIFICAR TOKEN DE ACCESO ───
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido',
      });
    }

    const token = authHeader.slice(7); // Remover 'Bearer '
    if (!verifyToken(token)) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso inválido o expirado',
      });
    }

    // Verificar que el body existe
    if (!req.body || typeof req.body !== 'object') {
      console.error('❌ Body no válido:', req.body);
      return res.status(400).json({
        success: false,
        message: 'Datos de solicitud inválidos',
      });
    }

    // Extraer datos del body
    const { clientEmail, clientName, pdfBase64, company } = req.body;

    // Log para debug (sin datos sensibles)
    console.log('📧 Datos recibidos:', {
      hasEmail: !!clientEmail,
      emailLength: clientEmail?.length || 0,
      hasName: !!clientName,
      hasPDF: !!pdfBase64,
      pdfLength: pdfBase64?.length || 0,
    });

    // ─── VALIDAR DATOS REQUERIDOS ───
    if (!clientEmail || !clientName || !pdfBase64) {
      console.error('❌ Datos faltantes:', {
        hasEmail: !!clientEmail,
        hasName: !!clientName,
        hasPDF: !!pdfBase64,
      });
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos: clientEmail, clientName, pdfBase64',
      });
    }

    // ─── VALIDAR TIPOS ───
    if (
      typeof clientEmail !== 'string' ||
      typeof clientName !== 'string' ||
      typeof pdfBase64 !== 'string'
    ) {
      console.error('❌ Tipos inválidos:', {
        emailType: typeof clientEmail,
        nameType: typeof clientName,
        pdfType: typeof pdfBase64,
      });
      return res.status(400).json({
        success: false,
        message: 'Tipos de datos inválidos',
      });
    }

    // ─── SANITIZAR STRINGS ───
    const trimmedEmail = clientEmail.trim();
    const trimmedName = clientName.trim();
    const trimmedCompany = (company && typeof company === 'string') ? company.trim() : '';

    // Validar que no estén vacíos después de trim
    if (!trimmedEmail || !trimmedName) {
      console.error('❌ Datos vacíos después de trim');
      return res.status(400).json({
        success: false,
        message: 'Los datos no pueden estar vacíos',
      });
    }

    // ─── VALIDAR EMAIL ───
    if (!validateEmail(trimmedEmail)) {
      console.error('❌ Email inválido recibido:', trimmedEmail);
      return res.status(400).json({
        success: false,
        message: 'El formato del email es inválido',
      });
    }

    // ─── SANITIZAR EMAIL ───
    const sanitizedEmail = trimmedEmail.toLowerCase();

    // ─── VALIDAR TAMAÑO DEL PDF ───
    const pdfSize = estimateBase64Size(pdfBase64);
    if (pdfSize > MAX_PDF_SIZE) {
      return res.status(400).json({
        success: false,
        message: `El PDF es demasiado grande. Máximo permitido: ${MAX_PDF_SIZE / 1024 / 1024}MB`,
      });
    }

    // ─── VALIDAR LONGITUD DE NOMBRE ───
    if (trimmedName.length > 200) {
      return res.status(400).json({
        success: false,
        message: 'El nombre es demasiado largo',
      });
    }

    // ─── VALIDAR VARIABLES DE ENTORNO ───
    if (!serverEnv.resendApiKey) {
      console.error('❌ RESEND_API_KEY no está configurada');
      return res.status(500).json({
        success: false,
        message: 'Error de configuración del servidor',
      });
    }

    const senderEmail = serverEnv.senderEmail;
    const senderName = serverEnv.senderName;
    const adminEmail = serverEnv.adminEmail;

    // ─── PREPARAR FECHA EN HORARIO DE COLOMBIA ───
    const now = new Date();
    const submittedAt = now.toLocaleString('es-CO', {
      timeZone: 'America/Bogota',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Formato de fecha para nombres de archivo (YYYY-MM-DD)
    const fileDate = now.toLocaleString('es-CO', {
      timeZone: 'America/Bogota',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).split('/').reverse().join('-');

    // Nombre de empresa sanitizado para archivo (sin caracteres especiales)
    const safeCompanyName = (trimmedCompany || 'Sin_Empresa')
      .replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50);

    // ─── LIMPIAR BASE64 ───
    const cleanBase64 = pdfBase64.replace(/^data:.*?;base64,/, '');

    // ─── RENDERIZAR EMAILS ───
    const clientEmailHtml = buildClientEmailHtml(trimmedName);

    const adminEmailHtml = buildAdminEmailHtml(
      trimmedName,
      sanitizedEmail,
      submittedAt,
    );

    // Log antes de enviar (sin datos sensibles completos)
    console.log('📤 Preparando envío:', {
      to: `${sanitizedEmail.substring(0, 3)}***@***`,
      name: trimmedName.substring(0, 10),
      pdfSize: `${(cleanBase64.length / 1024).toFixed(2)} KB`,
      from: `${senderName} <${senderEmail}>`,
    });

    // ─── ENVIAR EMAIL AL CLIENTE ───
    const clientEmailResult = await resend.emails.send({
      from: `${senderName} <${senderEmail}>`,
      to: sanitizedEmail,
      subject: '✅ Formulario de Requerimientos Recibido',
      html: clientEmailHtml,
      attachments: [
        {
          filename: `requerimientos_${safeCompanyName}_${fileDate}.pdf`,
          content: cleanBase64,
        },
      ],
    });

    if (clientEmailResult.error) {
      console.error('❌ Error al enviar correo al cliente:', clientEmailResult.error);
      throw new Error('Error al enviar el correo al cliente');
    }

    // ─── ENVIAR EMAIL AL ADMINISTRADOR (opcional) ───
    if (adminEmail) {
      const adminEmailResult = await resend.emails.send({
        from: `${senderName} <${senderEmail}>`,
        to: adminEmail,
        subject: `📋 Formulario de Requerimientos de Software - ${trimmedName} - ${trimmedCompany}`,
        html: adminEmailHtml,
        attachments: [
          {
            filename: `requerimientos_${safeCompanyName}_${fileDate}.pdf`,
            content: cleanBase64,
          },
        ],
      });

      if (adminEmailResult.error) {
        console.error('❌ Error al enviar correo al admin:', adminEmailResult.error);
        // No fallar si solo el email del admin falla
      }
    }

    // ─── RESPUESTA EXITOSA ───
    return res.status(200).json({
      success: true,
      message: 'Correos enviados exitosamente',
      sentAt: submittedAt,
    });

  } catch (error) {
    console.error('❌ Error en /api/send-email:', error);

    // No exponer detalles internos del error
    return res.status(500).json({
      success: false,
      message: 'Error al procesar la solicitud. Por favor intenta de nuevo.',
    });
  }
}
