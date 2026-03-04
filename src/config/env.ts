/**
 * Configuración centralizada de variables de entorno
 * Arquitectura Serverless con Resend
 * 
 * IMPORTANTE:
 * - Variables VITE_* son públicas (expuestas al frontend)
 * - Variables sin VITE_* son privadas (solo serverless functions)
 * - NO hardcodear URLs ni credenciales
 * - Solo cambiar .env al desplegar, NO este archivo
 */

export const env = {
    // App Configuration
    appUrl: import.meta.env.VITE_APP_URL || window.location.origin,
    appName: import.meta.env.VITE_APP_NAME || 'Formulario de Requerimientos de Software',
    appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',

    // Environment
    nodeEnv: import.meta.env.VITE_NODE_ENV || import.meta.env.MODE || 'development',
    isDevelopment: import.meta.env.MODE === 'development',
    isProduction: import.meta.env.MODE === 'production',

    // API Endpoint (serverless function)
    apiEndpoint: import.meta.env.VITE_API_ENDPOINT || '/api/send-email',
} as const

/**
 * Construye la URL del endpoint API.
 * - En desarrollo usa ruta relativa para evitar CORS entre :5173 y :3000 (vía proxy de Vite)
 * - En producción permite base URL explícita si existe VITE_APP_URL
 */
export function getApiUrl(endpoint: string): string {
    if (/^https?:\/\//i.test(endpoint)) return endpoint

    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`

    if (env.isDevelopment) {
        return normalizedEndpoint
    }

    const base = (env.appUrl || window.location.origin).replace(/\/+$/, '')
    return `${base}${normalizedEndpoint}`
}

/**
 * Validar variables de entorno requeridas
 * Para desarrollo, las validaciones son warnings
 * Para producción, son más estrictas
 */
export function validateEnv() {
    const warnings: string[] = []
    
    if (!env.appUrl || env.appUrl === window.location.origin) {
        warnings.push('VITE_APP_URL no configurada, usando URL actual')
    }
    
    if (warnings.length > 0 && env.isDevelopment) {
        console.warn(
            '⚠️  Advertencias de configuración:\n' +
            warnings.map(w => `  • ${w}`).join('\n') +
            '\n\nEstas configuraciones están usando valores por defecto.' +
            '\nPara producción, configura las variables de entorno apropiadamente.'
        )
    }
}

// Validar al importar el módulo
if (typeof window !== 'undefined') {
    validateEnv()
}

// Exportar también como 'envs' para compatibilidad
export const envs = env
