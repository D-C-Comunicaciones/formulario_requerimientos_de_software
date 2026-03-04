import type { FormData } from '@/types/form';
import { StepLayout, Field, inputCls } from './StepLayout';
import { CalendarIcon, DollarSignIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { SearchableSelect } from './SearchableSelect';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { format, isValid, parse } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const BUDGET_RANGES = [
  'Menos de $ 5.000.000 COP',
  '$ 5.000.000 – $ 15.000.000 COP',
  '$ 15.000.000 – $ 30.000.000 COP',
  '$ 30.000.000 – $ 60.000.000 COP',
  '$ 60.000.000 – $ 120.000.000 COP',
  'Más de $ 120.000.000 COP',
  'Aún no lo tengo definido',
  'Otro',
];

const OTHER_BUDGET_OPTION = 'Otro';

function formatDateEs(date: Date): string {
  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: es });
}

function parseLaunchDate(value: string): Date | undefined {
  if (!value?.trim()) return undefined;

  const parsedEs = parse(value, "dd 'de' MMMM 'de' yyyy", new Date(), { locale: es });
  if (isValid(parsedEs)) return parsedEs;

  const parsedNative = new Date(value);
  if (isValid(parsedNative)) return parsedNative;

  return undefined;
}

function formatCopFromDigits(digits: string): string {
  const cleanDigits = digits.replace(/\D/g, '');
  if (!cleanDigits) return '';
  const formatted = Number(cleanDigits).toLocaleString('es-CO');
  return `$ ${formatted}`;
}

function extractDigits(value: string): string {
  return (value || '').replace(/\D/g, '');
}

export function StepBudget({ data, onChange, onNext, onBack }: Props) {
  const [customBudgetDigits, setCustomBudgetDigits] = useState(() =>
    BUDGET_RANGES.includes(data.budgetRange) ? '' : extractDigits(data.budgetRange)
  );
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const selectedBudgetOption = useMemo(() => {
    if (!data.budgetRange) return '';
    return BUDGET_RANGES.includes(data.budgetRange) ? data.budgetRange : OTHER_BUDGET_OPTION;
  }, [data.budgetRange]);

  const selectedLaunchDate = useMemo(
    () => parseLaunchDate(data.launchDate),
    [data.launchDate]
  );

  const set = (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      onChange({ [key]: e.target.value });

  const onBudgetOptionChange = (option: string) => {
    if (option === OTHER_BUDGET_OPTION) {
      const formatted = formatCopFromDigits(customBudgetDigits);
      onChange({ budgetRange: formatted || '' });
      return;
    }

    setCustomBudgetDigits('');
    onChange({ budgetRange: option });
  };

  const onCustomBudgetChange = (rawValue: string) => {
    const onlyDigits = rawValue.replace(/\D/g, '');
    setCustomBudgetDigits(onlyDigits);
    onChange({ budgetRange: formatCopFromDigits(onlyDigits) });
  };

  const handleNext = () => {
    if (selectedBudgetOption === OTHER_BUDGET_OPTION && !customBudgetDigits) {
      alert('Si seleccionas "Otro", digita tu presupuesto en pesos sin puntos ni signos.');
      return;
    }
    onNext();
  };

  return (
    <StepLayout
      stepNumber={7}
      title="Presupuesto y tiempos"
      subtitle="Esta información es completamente opcional y solo nos ayuda a darte una propuesta más ajustada a tu realidad."
      onNext={handleNext}
      onBack={onBack}
    >
      {/* Info card */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
        <p className="text-amber-800 text-sm" style={{ lineHeight: 1.6 }}>
          💰 No te preocupes si no tienes cifras exactas. Una estimación o rango nos da suficiente información
          para orientar nuestra propuesta.
        </p>
      </div>

      <Field
        label="¿Cuándo te gustaría tener el sistema listo?"
        hint="Puede ser una fecha específica o un período estimado."
      >
        <div className="relative">
          <CalendarIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />

          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={`${inputCls} pl-9 text-left ${data.launchDate ? 'text-gray-900' : 'text-gray-400'}`}
              >
                {selectedLaunchDate
                  ? formatDateEs(selectedLaunchDate)
                  : data.launchDate || 'Selecciona una fecha'}
              </button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedLaunchDate}
                locale={es}
                onSelect={(date) => {
                  onChange({ launchDate: date ? formatDateEs(date) : '' });
                  setIsDatePickerOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </Field>

      <Field
        label="Rango estimado de inversión"
        hint="¿Cuánto tienes disponible para este proyecto?"
      >
        <div className="relative">
          <DollarSignIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <SearchableSelect
            className={`${inputCls} pl-9`}
            value={selectedBudgetOption}
            options={BUDGET_RANGES}
            placeholder="Seleccionar rango…"
            searchPlaceholder="Buscar rango..."
            onChange={onBudgetOptionChange}
          />
        </div>

        {selectedBudgetOption === OTHER_BUDGET_OPTION && (
          <input
            className={`${inputCls} mt-3`}
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="digite su presupuesto en pesos sin puntos ni signos"
            value={customBudgetDigits}
            onChange={(e) => onCustomBudgetChange(e.target.value)}
          />
        )}

        {selectedBudgetOption === OTHER_BUDGET_OPTION && customBudgetDigits && (
          <p className="text-xs text-gray-500 mt-2">
            Valor registrado: <strong>{formatCopFromDigits(customBudgetDigits)} COP</strong>
          </p>
        )}
      </Field>

      {/* Reassurance note */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
        <p className="text-slate-600 text-sm" style={{ lineHeight: 1.6 }}>
          🔒 Tu información es <strong>confidencial</strong>. Solo será usada por nuestro equipo
          para preparar una propuesta personalizada para ti.
        </p>
      </div>
    </StepLayout>
  );
}
