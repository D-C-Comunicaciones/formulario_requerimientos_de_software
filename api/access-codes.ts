/**
 * Sistema de Códigos de Acceso con Auto-destrucción
 * 
 * IMPORTANTE:
 * - Los códigos se auto-destruyen después de N usos
 * - El conteo es en memoria (se reinicia con cada deploy)
 * - Para persistencia real en producción, usar Vercel KV
 */

export interface AccessCode {
    code: string;
    maxUses: number;
    description?: string;
    expiresAt?: Date;
    active: boolean;
}

/**
 * Lista de códigos de acceso válidos
 * Edita esta lista directamente para agregar/remover códigos
 */
export const ACCESS_CODES: AccessCode[] = [
    {
        code: 'TUVACUNA',
        maxUses: 3,
        description: 'Código de Acceso para Tuvacuna.co - Uso limitado a 3',
        active: true,
    }
];

/**
 * Contador de usos en memoria
 * NOTA: Se reinicia con cada cold start de la función serverless
 * Para persistencia real, integrar con Vercel KV o una base de datos
 */
const usageCount = new Map<string, number>();

/**
 * Códigos desactivados permanentemente
 */
const deactivatedCodes = new Set<string>();

/**
 * Valida un código de acceso
 */
export function validateCode(inputCode: string): { valid: boolean; message?: string } {
    const normalizedInput = inputCode.trim().toUpperCase();

    // Buscar el código en la lista
    const codeConfig = ACCESS_CODES.find(
        c => c.code.toUpperCase() === normalizedInput && c.active
    );

    if (!codeConfig) {
        return { valid: false, message: 'Código de acceso inválido' };
    }

    // Verificar si fue desactivado
    if (deactivatedCodes.has(normalizedInput)) {
        return { valid: false, message: 'Este código ya no está disponible' };
    }

    // Verificar expiración
    if (codeConfig.expiresAt && new Date() > codeConfig.expiresAt) {
        return { valid: false, message: 'Este código ha expirado' };
    }

    // Verificar usos
    const currentUses = usageCount.get(normalizedInput) || 0;

    if (currentUses >= codeConfig.maxUses) {
        // Auto-desactivar
        deactivatedCodes.add(normalizedInput);
        return {
            valid: false,
            message: 'Este código ha alcanzado su límite de usos'
        };
    }

    return { valid: true };
}

/**
 * Registra el uso de un código
 */
export function recordCodeUsage(inputCode: string): void {
    const normalizedInput = inputCode.trim().toUpperCase();
    const currentUses = usageCount.get(normalizedInput) || 0;
    const newUses = currentUses + 1;

    usageCount.set(normalizedInput, newUses);

    // Verificar si alcanzó el límite
    const codeConfig = ACCESS_CODES.find(c => c.code.toUpperCase() === normalizedInput);
    if (codeConfig && newUses >= codeConfig.maxUses) {
        deactivatedCodes.add(normalizedInput);
        console.log(`🔒 Código ${normalizedInput} desactivado después de ${newUses} usos`);
    } else {
        console.log(`📊 Código ${normalizedInput}: ${newUses}/${codeConfig?.maxUses || '?'} usos`);
    }
}

/**
 * Obtiene información sobre los usos de un código (solo para logs)
 */
export function getCodeUsageInfo(inputCode: string): { uses: number; maxUses: number; remaining: number } | null {
    const normalizedInput = inputCode.trim().toUpperCase();
    const codeConfig = ACCESS_CODES.find(c => c.code.toUpperCase() === normalizedInput);

    if (!codeConfig) return null;

    const uses = usageCount.get(normalizedInput) || 0;
    const remaining = Math.max(0, codeConfig.maxUses - uses);

    return { uses, maxUses: codeConfig.maxUses, remaining };
}

/**
 * Resetea el contador de un código específico (solo para desarrollo/debug)
 */
export function resetCodeUsage(inputCode: string): void {
    const normalizedInput = inputCode.trim().toUpperCase();
    usageCount.delete(normalizedInput);
    deactivatedCodes.delete(normalizedInput);
    console.log(`🔄 Contador del código ${normalizedInput} reseteado`);
}

/**
 * Lista todos los códigos activos (solo para administración)
 */
export function listActiveCodes(): Array<{ code: string; uses: number; maxUses: number; remaining: number }> {
    return ACCESS_CODES
        .filter(c => c.active && !deactivatedCodes.has(c.code.toUpperCase()))
        .map(c => {
            const uses = usageCount.get(c.code.toUpperCase()) || 0;
            return {
                code: c.code,
                uses,
                maxUses: c.maxUses,
                remaining: c.maxUses - uses,
            };
        });
}
