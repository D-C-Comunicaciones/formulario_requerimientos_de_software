import { useState } from 'react';
import type { FormData } from '@/types/form';
import { StepLayout, Field, textareaCls } from './StepLayout';

interface Props {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepProblem({ data, onChange, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!data.currentSituation.trim())
      errs.currentSituation = 'Describe brevemente tu situación actual.';
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
      stepNumber={2}
      title="¿Cuál es tu situación actual?"
      subtitle="No necesitas usar lenguaje técnico. Descríbelo como si se lo explicaras a un amigo."
      onNext={handleNext}
      onBack={onBack}
    >
      <Field
        label="¿Qué sucede actualmente?"
        hint="Describe tu proceso o problema hoy en día."
        required
        error={errors.currentSituation}
      >
        <textarea
          className={textareaCls}
          rows={4}
          placeholder="Ej. Actualmente llevo el control de pedidos en hojas de Excel y muchas veces se pierden datos, hay errores y tardo mucho tiempo en actualizarlas manualmente..."
          value={data.currentSituation}
          onChange={set('currentSituation')}
        />
      </Field>

      <Field label="¿Qué deseas mejorar?" hint="¿Qué parte de tu proceso te gustaría cambiar?">
        <textarea
          className={textareaCls}
          rows={3}
          placeholder="Ej. Quiero que el proceso sea automático, sin errores y que varias personas puedan actualizarlo al mismo tiempo..."
          value={data.desiredImprovement}
          onChange={set('desiredImprovement')}
        />
      </Field>

      <Field label="¿Cómo lo haces hoy?" hint="¿Qué herramientas o métodos usas actualmente?">
        <textarea
          className={textareaCls}
          rows={3}
          placeholder="Ej. Usamos un Excel compartido por correo, también WhatsApp para avisar cambios, y a veces anotaciones en papel..."
          value={data.currentProcess}
          onChange={set('currentProcess')}
        />
      </Field>

      <Field label="¿Qué dificultades tienes?" hint="¿Qué te frustra o qué problemas genera el proceso actual?">
        <textarea
          className={textareaCls}
          rows={3}
          placeholder="Ej. Perdemos tiempo buscando información, cometemos errores al facturar, y los clientes se quejan de que no les damos información a tiempo..."
          value={data.difficulties}
          onChange={set('difficulties')}
        />
      </Field>
    </StepLayout>
  );
}
