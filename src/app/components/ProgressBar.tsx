import { CheckIcon } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number; // 1–8
  totalSteps: number;
}

const STEP_LABELS = [
  'Datos',
  'Problema',
  'Objetivo',
  'Funcionalidades',
  'Usuarios',
  'Referencias',
  'Presupuesto',
  'Revisión',
];

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const pct = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  return (
    <div className="w-full bg-white border-b border-gray-100 shadow-sm px-4 py-3">
      {/* Mobile: compact bar */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">Paso {currentStep} de {totalSteps}</span>
          <span className="text-xs" style={{ fontWeight: 600, color: '#044D8C' }}>{STEP_LABELS[currentStep - 1]}</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #044D8C, #D99414)' }}
          />
        </div>
      </div>

      {/* Desktop: step indicators */}
      <div className="hidden sm:flex items-center justify-center gap-0 max-w-3xl mx-auto">
        {STEP_LABELS.map((label, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent   = stepNum === currentStep;

          return (
            <div key={stepNum} className="flex items-center">
              {/* Connector line */}
              {i > 0 && (
                <div
                  className={`h-0.5 w-6 lg:w-10 transition-colors duration-300 ${
                    isCompleted ? '' : 'bg-gray-200'
                  }`}
                  style={isCompleted ? { background: '#044D8C' } : {}}
                />
              )}
              {/* Step circle + label */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all duration-300 ${
                    isCompleted
                      ? 'text-white'
                      : isCurrent
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                  style={{
                    fontWeight: 600,
                    ...(isCompleted || isCurrent
                      ? { background: '#044D8C', boxShadow: isCurrent ? '0 0 0 4px rgba(242,210,48,0.3)' : 'none' }
                      : {}),
                  }}
                >
                  {isCompleted ? <CheckIcon size={13} /> : stepNum}
                </div>
                <span
                  className={`mt-1 text-xs whitespace-nowrap transition-colors duration-300 ${
                    isCurrent ? '' : isCompleted ? 'text-gray-500' : 'text-gray-300'
                  }`}
                  style={{
                    fontWeight: isCurrent ? 600 : 400,
                    fontSize: '0.65rem',
                    ...(isCurrent ? { color: '#044D8C' } : {}),
                  }}
                >
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
