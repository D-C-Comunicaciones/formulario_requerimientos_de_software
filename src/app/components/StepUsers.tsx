import { useState } from 'react';
import type { FormData } from '@/types/form';
import { StepLayout, Field, inputCls, textareaCls } from './StepLayout';
import { UsersIcon } from 'lucide-react';
import { SearchableSelect } from './SearchableSelect';

interface Props {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const USER_COUNT_OPTIONS = [
  '1–5 personas',
  '6–20 personas',
  '21–100 personas',
  '100–500 personas',
  'Más de 500 personas',
  'No lo sé todavía',
];

export function StepUsers({ data, onChange, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!data.userTypes.trim())
      errs.userTypes = 'Cuéntanos quiénes usarán el sistema.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => { if (validate()) onNext(); };

  const setField = (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange({ [key]: e.target.value });
      if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
    };

  return (
    <StepLayout
      stepNumber={5}
      title="¿Quiénes usarán el sistema?"
      subtitle="Esto nos ayuda a entender si necesitas diferentes permisos, roles o interfaces para distintos tipos de personas."
      onNext={handleNext}
      onBack={onBack}
    >
      {/* Visual hint */}
      <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
        <UsersIcon size={20} className="shrink-0 mt-0.5" style={{ color: '#044D8C' }} />
        <p className="text-slate-600 text-sm" style={{ lineHeight: 1.6 }}>
          Piensa en todos los que interactuarán con tu sistema: empleados, clientes, administradores, supervisores, etc.
        </p>
      </div>

      <Field
        label="¿Quiénes lo usarán?"
        hint="Menciona los diferentes perfiles de personas que usarán el sistema."
        required
        error={errors.userTypes}
      >
        <input
          className={inputCls}
          placeholder="Ej. Vendedores, administradores, clientes externos, supervisores de área…"
          value={data.userTypes}
          onChange={setField('userTypes')}
        />
      </Field>

      <Field label="¿Cuántas personas aproximadamente?" hint="Una estimación es suficiente.">
        <SearchableSelect
          className={inputCls}
          value={data.userCount}
          options={USER_COUNT_OPTIONS}
          placeholder="Seleccionar…"
          searchPlaceholder="Buscar rango..."
          onChange={(value) => onChange({ userCount: value })}
        />
      </Field>

      <Field
        label="Describe el tipo de usuario"
        hint="¿Qué hará cada tipo de usuario? ¿Tienen niveles de acceso diferentes?"
      >
        <textarea
          className={textareaCls}
          rows={4}
          placeholder="Ej. El administrador podrá ver todos los reportes y gestionar usuarios. Los vendedores solo podrán registrar y ver sus propios pedidos. Los clientes podrán consultar el estado de sus pedidos…"
          value={data.userDescription}
          onChange={setField('userDescription')}
        />
      </Field>
    </StepLayout>
  );
}
