/**
 * Servicio de validación de código de acceso
 */

const ACCESS_TOKEN_KEY = 'form_access_token';
const ACCESS_TOKEN_EXPIRY_KEY = 'form_access_expiry';
const ACCESS_REMAINING_USES_KEY = 'form_access_remaining_uses';

export interface AccessValidationResult {
    success: boolean;
    message?: string;
    token?: string;
    expiresIn?: number;
    remainingUses?: number;
}

/**
 * Valida el código de acceso contra el backend
 */
export async function validateAccessCode(code: string): Promise<AccessValidationResult> {
    try {
        const response = await fetch('/api/validate-access', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        });

        // Verificar si la respuesta tiene contenido
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.error('Respuesta no es JSON:', await response.text());
            return {
                success: false,
                message: 'Error de configuración del servidor. Asegúrate de ejecutar "vercel dev" en puerto 3000.',
            };
        }

        const data = await response.json();

        if (response.ok && data.success) {
            // Guardar token y fecha de expiración en sessionStorage
            sessionStorage.setItem(ACCESS_TOKEN_KEY, data.token);
            const expiryTime = Date.now() + (data.expiresIn * 1000);
            sessionStorage.setItem(ACCESS_TOKEN_EXPIRY_KEY, expiryTime.toString());

            // Guardar usos restantes si están disponibles
            if (typeof data.remainingUses === 'number') {
                sessionStorage.setItem(ACCESS_REMAINING_USES_KEY, data.remainingUses.toString());
            }

            return {
                success: true,
                token: data.token,
                expiresIn: data.expiresIn,
                remainingUses: data.remainingUses,
            };
        }

        return {
            success: false,
            message: data.message || 'Código de acceso inválido',
        };
    } catch (error) {
        console.error('Error validando código de acceso:', error);
        return {
            success: false,
            message: 'Error de conexión. Por favor intenta de nuevo.',
        };
    }
}

/**
 * Obtiene el token de acceso actual
 */
export function getAccessToken(): string | null {
    const token = sessionStorage.getItem(ACCESS_TOKEN_KEY);
    const expiry = sessionStorage.getItem(ACCESS_TOKEN_EXPIRY_KEY);

    if (!token || !expiry) {
        return null;
    }

    // Verificar si el token ha expirado
    if (Date.now() > parseInt(expiry)) {
        clearAccessToken();
        return null;
    }

    return token;
}

/**
 * Verifica si hay un token válido
 */
export function hasValidAccess(): boolean {
    return getAccessToken() !== null;
}

/**
 * Obtiene los usos restantes del código de acceso
 */
export function getRemainingUses(): number | null {
    const remaining = sessionStorage.getItem(ACCESS_REMAINING_USES_KEY);
    return remaining !== null ? parseInt(remaining) : null;
}

/**
 * Limpia el token de acceso y datos relacionados
 */
export function clearAccessToken(): void {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_EXPIRY_KEY);
    sessionStorage.removeItem(ACCESS_REMAINING_USES_KEY);
}
