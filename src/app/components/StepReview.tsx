import { motion } from 'motion/react';
import {
  UserIcon, BriefcaseIcon, MailIcon, PhoneIcon, MapPinIcon,
  MessageSquareIcon, TargetIcon, ZapIcon, UsersIcon,
  LinkIcon, CalendarIcon, DollarSignIcon, PencilIcon,
  CheckCircleIcon, Loader2Icon,
} from 'lucide-react';
import type { FormData } from '@/types/form';
import { getCountryName } from '@utils/americanCountries';

interface Props {
  data: FormData;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading: boolean;
}

const PRIORITY_BADGE: Record<string, string> = {
  Alta:  'bg-red-50 text-red-600 border border-red-200',
  Media: 'bg-amber-50 text-amber-600 border border-amber-200',
  Baja:  'bg-green-50 text-green-600 border border-green-200',
};

function SectionCard({
  title,
  icon: Icon,
  step,
  onEdit,
  children,
}: {
  title: string;
  icon: React.ElementType;
  step: number;
  onEdit: (s: number) => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/70">
        <div className="flex items-center gap-2">
          <Icon size={15} style={{ color: '#044D8C' }} />
          <span className="text-gray-700 text-sm" style={{ fontWeight: 600 }}>{title}</span>
        </div>
        <button
          onClick={() => onEdit(step)}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-all"
          style={{ fontWeight: 500, color: '#044D8C', background: 'rgba(4,77,140,0.08)' }}
          onMouseEnter={e => (e.currentTarget.style.background='rgba(4,77,140,0.18)')}
          onMouseLeave={e => (e.currentTarget.style.background='rgba(4,77,140,0.08)')}
        >
          <PencilIcon size={11} /> Editar
        </button>
      </div>
      <div className="px-5 py-4">{children}</div>
    </motion.div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-4 py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-gray-400 text-xs shrink-0 sm:w-40" style={{ fontWeight: 500 }}>
        {label}
      </span>
      <span className="text-gray-700 text-sm" style={{ lineHeight: 1.5 }}>{value}</span>
    </div>
  );
}

export function StepReview({ data, onEdit, onSubmit, onBack, isLoading }: Props) {
  const validRefs = data.references.filter(r => r.url || r.description);
  
  // Concatenar país y ciudad
  const locationDisplay = data.country && data.city 
    ? `${getCountryName(data.country)}, ${data.city}`
    : data.city || (data.country ? getCountryName(data.country) : '');

  return (
    <motion.div
      key="review"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-2xl mx-auto px-4 py-8"
    >
      {/* Header */}
      <div className="mb-8">
        <span
          className="inline-block text-xs px-3 py-1 rounded-full mb-3"
          style={{ fontWeight: 600, background: 'rgba(4,77,140,0.1)', color: '#044D8C' }}
        >
          Paso 8 de 8
        </span>
        <h2 className="text-gray-900 mb-2" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
          Revisa tu información
        </h2>
        <p className="text-gray-500" style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
          Todo se ve bien? Revisa el resumen y cuando estés listo, genera tu documento.
          Puedes editar cualquier sección haciendo clic en "Editar".
        </p>
      </div>

      <div className="space-y-4">
        {/* § 1 General Info */}
        <SectionCard title="Información del cliente" icon={UserIcon} step={1} onEdit={onEdit}>
          <Row label="Nombre"      value={data.fullName} />
          <Row label="Empresa"     value={data.company} />
          <Row label="Correo"      value={data.email} />
          <Row label="Teléfono"    value={data.phone} />
          <Row label="Ubicación"   value={locationDisplay} />
          <Row label="Contacto"    value={data.preferredContact} />
        </SectionCard>

        {/* § 2 Problem */}
        <SectionCard title="Situación y problema" icon={MessageSquareIcon} step={2} onEdit={onEdit}>
          <Row label="Situación actual"     value={data.currentSituation} />
          <Row label="Qué desea mejorar"   value={data.desiredImprovement} />
          <Row label="Proceso actual"       value={data.currentProcess} />
          <Row label="Dificultades"         value={data.difficulties} />
        </SectionCard>

        {/* § 3 Objective */}
        <SectionCard title="Objetivo principal" icon={TargetIcon} step={3} onEdit={onEdit}>
          <Row label="Resultado esperado" value={data.desiredResult} />
          <Row label="Criterio de éxito"  value={data.successCriteria} />
        </SectionCard>

        {/* § 4 Functionalities */}
        <SectionCard title="Funcionalidades" icon={ZapIcon} step={4} onEdit={onEdit}>
          {data.functionalities.length === 0 ? (
            <p className="text-gray-400 text-sm italic">No se agregaron funcionalidades.</p>
          ) : (
            <div className="space-y-3">
              {data.functionalities.map((fn, i) => (
                <div key={fn.id} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-start gap-2 flex-wrap mb-1">
                    <span className="text-xs text-gray-400" style={{ fontWeight: 600 }}>#{i + 1}</span>
                    <span className="text-gray-800 text-sm" style={{ fontWeight: 600 }}>{fn.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_BADGE[fn.priority]}`} style={{ fontWeight: 500 }}>
                      {fn.priority}
                    </span>
                    {fn.isEssential && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ fontWeight: 500, background: 'rgba(4,77,140,0.1)', color: '#044D8C', border: '1px solid rgba(4,77,140,0.25)' }}>
                        Indispensable
                      </span>
                    )}
                  </div>
                  {fn.description && (
                    <p className="text-gray-500 text-xs mt-1">{fn.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* § 5 Users */}
        <SectionCard title="Usuarios del sistema" icon={UsersIcon} step={5} onEdit={onEdit}>
          <Row label="¿Quiénes lo usarán?" value={data.userTypes} />
          <Row label="Cantidad estimada"   value={data.userCount} />
          <Row label="Tipo de usuario"     value={data.userDescription} />
        </SectionCard>

        {/* § 6 References (only if filled) */}
        {validRefs.length > 0 && (
          <SectionCard title="Referencias" icon={LinkIcon} step={6} onEdit={onEdit}>
            {validRefs.map((r, i) => (
              <div key={r.id} className="py-1.5 border-b border-gray-50 last:border-0">
                {r.url && (
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline block truncate" style={{ color: '#044D8C' }}>
                    {r.url}
                  </a>
                )}
                {r.description && (
                  <p className="text-gray-500 text-xs mt-0.5">{r.description}</p>
                )}
              </div>
            ))}
          </SectionCard>
        )}

        {/* § 7 Budget */}
        <SectionCard title="Presupuesto y tiempos" icon={CalendarIcon} step={7} onEdit={onEdit}>
          <Row label="Fecha ideal" value={data.launchDate || 'No especificado'} />
          <Row label="Rango de inversión" value={data.budgetRange || 'No especificado'} />
        </SectionCard>
      </div>

      {/* CTA */}
      <div className="mt-10 space-y-4">
        <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: 'rgba(4,77,140,0.07)', border: '1px solid rgba(4,77,140,0.2)' }}>
          <CheckCircleIcon size={18} className="shrink-0 mt-0.5" style={{ color: '#044D8C' }} />
          <p className="text-sm" style={{ lineHeight: 1.6, color: '#033d70' }}>
            Al hacer clic en el botón, generaremos tu documento PDF automáticamente y te enviaremos
            una copia a <strong>{data.email || 'tu correo'}</strong>.
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-all text-sm"
            style={{ fontWeight: 500 }}
          >
            ← Atrás
          </button>

          <button
            onClick={onSubmit}
            disabled={isLoading}
            className="flex items-center gap-2.5 text-white px-7 py-3 rounded-xl transition-all shadow-lg text-sm"
            style={{ fontWeight: 700, background: '#044D8C', boxShadow: '0 4px 14px rgba(4,77,140,0.35)' }}
            onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background='#033d70'; }}
            onMouseLeave={e => { if (!isLoading) e.currentTarget.style.background='#044D8C'; }}
          >
            {isLoading ? (
              <>
                <Loader2Icon size={16} className="animate-spin" />
                Generando documento…
              </>
            ) : (
              <>
                <CheckCircleIcon size={16} />
                Generar documento y enviar
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
