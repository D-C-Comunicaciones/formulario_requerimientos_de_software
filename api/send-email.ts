import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import ClientEmail from '../src/app/components/emails/ClientEmail';
import AdminEmail from '../src/app/components/emails/AdminEmail';

// Inicializar Resend
const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Extraer datos del body
    const { clientEmail, clientName, pdfBase64 } = req.body;

    // ─── VALIDAR DATOS REQUERIDOS ───
    if (!clientEmail || !clientName || !pdfBase64) {
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
      return res.status(400).json({
        success: false,
        message: 'Tipos de datos inválidos',
      });
    }

    // ─── VALIDAR EMAIL ───
    if (!validateEmail(clientEmail)) {
      return res.status(400).json({
        success: false,
        message: 'El formato del email es inválido',
      });
    }

    // ─── VALIDAR TAMAÑO DEL PDF ───
    const pdfSize = estimateBase64Size(pdfBase64);
    if (pdfSize > MAX_PDF_SIZE) {
      return res.status(400).json({
        success: false,
        message: `El PDF es demasiado grande. Máximo permitido: ${MAX_PDF_SIZE / 1024 / 1024}MB`,
      });
    }

    // ─── VALIDAR LONGITUD DE NOMBRE ───
    if (clientName.length > 200) {
      return res.status(400).json({
        success: false,
        message: 'El nombre es demasiado largo',
      });
    }

    // ─── VALIDAR VARIABLES DE ENTORNO ───
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY no está configurada');
      return res.status(500).json({
        success: false,
        message: 'Error de configuración del servidor',
      });
    }

    const senderEmail = process.env.SENDER_EMAIL || 'onboarding@resend.dev';
    const senderName = process.env.SENDER_NAME || 'Formulario de Requerimientos';
    const adminEmail = process.env.ADMIN_EMAIL;

    // ─── PREPARAR FECHA ───
    const now = new Date();
    const submittedAt = now.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // ─── LIMPIAR BASE64 ───
    const cleanBase64 = pdfBase64.replace(/^data:.*?;base64,/, '');

    // ─── RENDERIZAR EMAILS ───
    const clientEmailHtml = await render(
      ClientEmail({ clientName })
    );

    const adminEmailHtml = await render(
      AdminEmail({
        clientName,
        clientEmail,
        submittedAt,
      })
    );

    // ─── ENVIAR EMAIL AL CLIENTE ───
    const clientEmailResult = await resend.emails.send({
      from: `${senderName} <${senderEmail}>`,
      to: clientEmail,
      subject: '✅ Formulario de Requerimientos Recibido',
      html: clientEmailHtml,
      attachments: [
        {
          filename: 'requerimientos.pdf',
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
        subject: `📋 Nuevo formulario de ${clientName}`,
        html: adminEmailHtml,
        attachments: [
          {
            filename: 'requerimientos.pdf',
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
