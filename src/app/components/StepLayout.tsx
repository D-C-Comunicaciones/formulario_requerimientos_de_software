import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeftIcon, ArrowRightIcon, Loader2Icon } from 'lucide-react';
import { ReactNode } from 'react';

interface StepLayoutProps {
  stepNumber: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onNext: () => void;
  onBack: () => void;
  nextLabel?: string;
  isLoading?: boolean;
  isNextDisabled?: boolean;
  isFirstStep?: boolean;
}

export function StepLayout({
  stepNumber,
  title,
  subtitle,
  children,
  onNext,
  onBack,
  nextLabel = 'Continuar',
  isLoading = false,
  isNextDisabled = false,
  isFirstStep = false,
}: StepLayoutProps) {
  return (
    <motion.div
      key={stepNumber}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-2xl mx-auto px-4 py-8"
    >
      {/* Step header */}
      <div className="mb-8">
        <span
          className="inline-block text-xs px-3 py-1 rounded-full mb-3"
          style={{ fontWeight: 600, background: 'rgba(4,77,140,0.1)', color: '#044D8C' }}
        >
          Paso {stepNumber} de 8
        </span>
        <h2 className="text-gray-900 mb-2" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-gray-500" style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Form fields */}
      <div className="space-y-5">{children}</div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-all"
          style={{ fontWeight: 500 }}
        >
          <ArrowLeftIcon size={16} />
          {isFirstStep ? 'Inicio' : 'Atrás'}
        </button>

        <button
          onClick={onNext}
          disabled={isNextDisabled || isLoading}
          className="flex items-center gap-2 text-white px-6 py-2.5 rounded-xl transition-all shadow-sm disabled:cursor-not-allowed"
          style={{ fontWeight: 600, background: '#044D8C', boxShadow: '0 2px 8px rgba(4,77,140,0.3)' }}
          onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.background='#033d70'; }}
          onMouseLeave={e => { e.currentTarget.style.background='#044D8C'; }}
        >
          {isLoading ? (
            <>
              <Loader2Icon size={16} className="animate-spin" />
              Procesando…
            </>
          ) : (
            <>
              {nextLabel}
              <ArrowRightIcon size={16} />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

/* ── Shared input primitives ── */
interface FieldProps {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  error?: string;
}

export function Field({ label, hint, required, children, error }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-gray-700" style={{ fontWeight: 600, fontSize: '0.9rem' }}>
        {label}
        {required && <span className="ml-1" style={{ color: '#044D8C' }}>*</span>}
        {!required && <span className="text-gray-400 ml-1.5 text-xs" style={{ fontWeight: 400 }}>(opcional)</span>}
      </label>
      {hint && <p className="text-gray-400 text-xs">{hint}</p>}
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export const inputCls =
  'w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all';

export const textareaCls =
  'w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none';
