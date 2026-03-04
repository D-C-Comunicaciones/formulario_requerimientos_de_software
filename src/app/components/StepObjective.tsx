import { useState } from 'react';
import type { FormData } from '@/types/form';
import { StepLayout, Field, textareaCls } from './StepLayout';

interface Props {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepObjective({ data, onChange, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!data.desiredResult.trim())
      errs.desiredResult = 'Cuéntanos qué resultado esperas lograr.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => { if (validate()) onNext(); };

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ [key]: e.target.value });
    if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  return (
    <StepLayout
      stepNumber={3}
      title="¿Qué resultado quieres lograr?"
      subtitle="Piensa en el impacto que quieres tener. ¿Cómo se verá tu negocio cuando esto funcione bien?"
      onNext={handleNext}
      onBack={onBack}
    >
      {/* Visual hint card */}
      <div className="rounded-2xl p-4" style={{ background: 'rgba(4,77,140,0.07)', border: '1px solid rgba(4,77,140,0.18)' }}>
        <p className="text-sm" style={{ lineHeight: 1.6, color: '#033d70' }}>
          💡 <strong>Consejo:</strong> Piensa en términos de resultados concretos.
          Por ejemplo: "quiero ahorrar 5 horas a la semana", "quiero que mis clientes puedan hacer pedidos solos", etc.
        </p>
      </div>

      <Field
        label="¿Qué resultado deseas lograr?"
        hint="Describe la transformación que esperas en tu negocio o proceso."
        required
        error={errors.desiredResult}
      >
        <textarea
          className={textareaCls}
          rows={4}
          placeholder="Ej. Quiero tener un sistema donde mis vendedores puedan registrar pedidos desde su celular, y yo pueda ver todo en tiempo real desde mi computador sin necesidad de llamadas ni correos..."
          value={data.desiredResult}
          onChange={set('desiredResult')}
        />
      </Field>

      <Field
        label="¿Cómo sabrás que el proyecto fue exitoso?"
        hint="¿Qué indicadores o señales te confirmarán que funcionó?"
      >
        <textarea
          className={textareaCls}
          rows={3}
          placeholder="Ej. Si logramos reducir errores en pedidos a cero, si los clientes dejan de llamar para saber el estado de su pedido, o si ahorramos al menos 3 horas diarias en trabajo manual..."
          value={data.successCriteria}
          onChange={set('successCriteria')}
        />
      </Field>
    </StepLayout>
  );
}
