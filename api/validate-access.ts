import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHmac } from 'crypto';
import { validateCode, recordCodeUsage, getCodeUsageInfo } from './access-codes.js';
import { serverEnv, getAllowedOrigins } from './config.js';

// ─────────────────────────────────────────────────────
// Generar y validar tokens JWT simples
// ─────────────────────────────────────────────────────

const SECRET_KEY = serverEnv.jwtSecret;

interface TokenPayload {
    exp: number; // Timestamp de expiración
    iat: number; // Timestamp de creación
}

function base64UrlEncode(str: string): string {
    return Buffer.from(str)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function generateToken(expiresInHours: number = 24): string {
    const now = Math.floor(Date.now() / 1000);
    const payload: TokenPayload = {
        iat: now,
        exp: now + (expiresInHours * 60 * 60),
    };

    const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payloadEncoded = base64UrlEncode(JSON.stringify(payload));

    const signature = createHmac('sha256', SECRET_KEY)
        .update(`${header}.${payloadEncoded}`)
        .digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

    return `${header}.${payloadEncoded}.${signature}`;
}

export function verifyToken(token: string): boolean {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return false;

        const [header, payloadEncoded, signature] = parts;

        // Verificar firma
        const expectedSignature = createHmac('sha256', SECRET_KEY)
            .update(`${header}.${payloadEncoded}`)
            .digest('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');

        if (signature !== expectedSignature) return false;

        // Verificar expiración
        const payload = JSON.parse(Buffer.from(payloadEncoded, 'base64').toString()) as TokenPayload;
        const now = Math.floor(Date.now() / 1000);

        return payload.exp > now;
    } catch {
        return false;
    }
}

// ─────────────────────────────────────────────────────
// Validación de origen (CORS)
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

// ─────────────────────────────────────────────────────
// Handler de validación de código de acceso
// ─────────────────────────────────────────────────────

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    // Solo permitir POST
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Método no permitido',
        });
    }

    // VALIDACIÓN DE ORIGEN TEMPORALMENTE DESHABILITADA
    // TODO: Habilitar cuando APP_URL esté configurada en Vercel
    // if (!isAllowedOrigin(req)) {
    //     return res.status(403).json({
    //         success: false,
    //         message: 'Acceso denegado: origen no autorizado',
    //     });
    // }

    try {
        const { code } = req.body;

        if (!code || typeof code !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Código de acceso requerido',
            });
        }

        // Validar el código usando el sistema de access-codes
        const validation = validateCode(code);

        if (!validation.valid) {
            console.log(`❌ Código inválido: ${code.substring(0, 3)}***`);
            return res.status(401).json({
                success: false,
                message: validation.message || 'Código de acceso inválido',
            });
        }

        // Registrar el uso del código
        recordCodeUsage(code);

        // Obtener información de uso para logs y respuesta
        const usageInfo = getCodeUsageInfo(code);
        if (usageInfo) {
            console.log(`✅ Acceso concedido. Código: ${code} - Usos: ${usageInfo.uses}/${usageInfo.maxUses} (Quedan: ${usageInfo.remaining})`);
        }

        // Generar token JWT válido por 24 horas
        const token = generateToken(24);

        return res.status(200).json({
            success: true,
            token,
            expiresIn: 24 * 60 * 60, // 24 horas en segundos
            remainingUses: usageInfo?.remaining || 0, // Incluir usos restantes
        });

    } catch (error) {
        console.error('❌ Error en /api/validate-access:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al validar código',
        });
    }
}
