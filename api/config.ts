/**
 * Configuración centralizada de variables de entorno para serverless functions
 * 
 * IMPORTANTE:
 * - En serverless functions de Vercel se usa process.env, NO import.meta.env
 * - Las variables VITE_* son solo para el frontend
 * - VERCEL_URL es proporcionado automáticamente por Vercel
 * - Configura las variables de entorno en el dashboard de Vercel
 */

/**
 * Configuración de la aplicación
 */
export const serverEnv = {
    // JWT Secret para autenticación
    jwtSecret: process.env.JWT_SECRET || 'default-secret-key-change-in-production',

    // Email Configuration (Resend)
    resendApiKey: process.env.RESEND_API_KEY,
    senderEmail: process.env.SENDER_EMAIL || 'onboarding@resend.dev',
    senderName: process.env.SENDER_NAME || 'Formulario de Requerimientos de Software',
    adminEmail: process.env.ADMIN_EMAIL,

    // App Configuration
    appUrl: process.env.APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null),
    vercelUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,

    // Environment
    nodeEnv: process.env.NODE_ENV || 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
} as const;

/**
 * Obtiene los orígenes permitidos para validación CORS
 */
export function getAllowedOrigins(): string[] {
    const origins: (string | null)[] = [
        serverEnv.appUrl,          // URL personalizada (APP_URL)
        serverEnv.vercelUrl,       // URL de Vercel (automática)
    ];

    // Filtrar nulls y retornar array limpio
    return origins.filter((origin): origin is string => origin !== null);
}

/**
 * Valida que las variables de entorno requeridas estén configuradas
 */
export function validateServerEnv(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!serverEnv.resendApiKey) {
        errors.push('RESEND_API_KEY no está configurada');
    }

    if (serverEnv.jwtSecret === 'default-secret-key-change-in-production') {
        errors.push('JWT_SECRET debe ser configurado en producción');
    }

    const allowedOrigins = getAllowedOrigins();
    if (allowedOrigins.length === 0 && !serverEnv.isDevelopment) {
        errors.push('No hay orígenes permitidos configurados (VERCEL_URL o APP_URL)');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}
