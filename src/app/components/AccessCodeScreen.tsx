import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LockKeyholeIcon, ShieldCheckIcon, AlertCircleIcon, XIcon } from 'lucide-react';
import { validateAccessCode } from '@utils/accessService';

interface Props {
    onAccessGranted: () => void;
    onClose?: () => void;
}

export function AccessCodeScreen({ onAccessGranted, onClose }: Props) {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isValidating, setIsValidating] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!code.trim()) {
            setError('Por favor ingresa el código de acceso');
            return;
        }

        setError('');
        setIsValidating(true);

        try {
            const result = await validateAccessCode(code.trim());

            if (result.success) {
                // Pequeña pausa para mostrar el éxito
                setTimeout(() => {
                    onAccessGranted();
                }, 500);
            } else {
                setError(result.message || 'Código de acceso inválido');
            }
        } catch (err) {
            setError('Error al validar el código. Intenta de nuevo.');
        } finally {
            setIsValidating(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ 
                    background: 'rgba(0, 0, 0, 0.85)',
                    backdropFilter: 'blur(8px)'
                }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="relative max-w-md w-full"
                    onClick={(e) => e.stopPropagation()}
                >
                <div
                    className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 relative"
                    style={{ boxShadow: '0 25px 50px -12px rgba(4,77,140,0.25)' }}
                >
                    {/* Botón cerrar (opcional) */}
                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <XIcon size={24} />
                        </button>
                    )}

                    {/* Header con icono */}
                    <div className="text-center mb-8">
                        <div
                            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                            style={{ background: 'rgba(4,77,140,0.1)' }}
                        >
                            <ShieldCheckIcon size={32} style={{ color: '#044D8C' }} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Acceso Requerido
                        </h1>
                        <p className="text-gray-600 text-sm">
                            Ingresa el código de acceso proporcionado para continuar
                        </p>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Código de Acceso
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockKeyholeIcon size={20} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => {
                                        setCode(e.target.value);
                                        setError('');
                                    }}
                                    placeholder="Ingresa tu código"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg font-mono tracking-wider uppercase"
                                    style={{
                                        borderColor: error ? '#ef4444' : undefined,
                                    }}
                                    disabled={isValidating}
                                    autoFocus
                                />
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-2 flex items-center gap-2 text-red-600 text-sm"
                                >
                                    <AlertCircleIcon size={16} />
                                    <span>{error}</span>
                                </motion.div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isValidating || !code.trim()}
                            className="w-full py-3 px-4 rounded-lg text-white font-semibold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                background: isValidating || !code.trim() ? '#94a3b8' : '#044D8C',
                                boxShadow: isValidating || !code.trim() ? 'none' : '0 4px 14px rgba(4,77,140,0.4)',
                            }}
                            onMouseEnter={(e) => {
                                if (!isValidating && code.trim()) {
                                    (e.target as HTMLButtonElement).style.background = '#055fad';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isValidating && code.trim()) {
                                    (e.target as HTMLButtonElement).style.background = '#044D8C';
                                }
                            }}
                        >
                            {isValidating ? (
                                <span className="flex items-center justify-center gap-2">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                    />
                                    Validando...
                                </span>
                            ) : (
                                'Acceder al Formulario'
                            )}
                        </button>
                    </form>

                    {/* Nota de seguridad */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                            🔒 Tu código de acceso es confidencial. No lo compartas con terceros.
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
        </AnimatePresence>
    );
}
