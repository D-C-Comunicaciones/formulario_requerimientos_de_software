import { motion, AnimatePresence } from 'motion/react';
import { PlusIcon, Trash2Icon, Link2Icon } from 'lucide-react';
import type { FormData, Reference } from '@/types/form';
import { StepLayout, inputCls } from './StepLayout';
import { useState } from 'react';

interface Props {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const URL_LIKE_REGEX = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?$/i;

function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function isValidReferenceUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed || /\s/.test(trimmed)) return false;
  if (!URL_LIKE_REGEX.test(trimmed)) return false;

  try {
    const normalized = normalizeUrl(trimmed);
    const parsed = new URL(normalized);
    return Boolean(parsed.hostname && parsed.hostname.includes('.'));
  } catch {
    return false;
  }
}

export function StepReferences({ data, onChange, onNext, onBack }: Props) {
  const refs = data.references;
  const [urlErrors, setUrlErrors] = useState<Record<string, string>>({});

  const update = (id: string, key: keyof Reference, value: string) => {
    onChange({
      references: refs.map(r => r.id === id ? { ...r, [key]: value } : r),
    });

    if (key === 'url' && urlErrors[id]) {
      setUrlErrors(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const validateAndNormalizeUrl = (id: string, rawUrl: string) => {
    const trimmed = rawUrl.trim();

    if (!trimmed) {
      setUrlErrors(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }

    if (!isValidReferenceUrl(trimmed)) {
      setUrlErrors(prev => ({
        ...prev,
        [id]: 'Ingresa una URL válida. Ej: dccomunicacionessas.com, www.dccomunicacionessas.com o https://dccomunicacionessas.com',
      }));
      return;
    }

    const normalized = normalizeUrl(trimmed);
    onChange({
      references: refs.map(r => r.id === id ? { ...r, url: normalized } : r),
    });

    setUrlErrors(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const addRef = () => {
    onChange({ references: [...refs, { id: crypto.randomUUID(), url: '', description: '' }] });
  };

  const removeRef = (id: string) => {
    const updated = refs.filter(r => r.id !== id);
    onChange({ references: updated.length === 0 ? [{ id: crypto.randomUUID(), url: '', description: '' }] : updated });

    setUrlErrors(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleNext = () => {
    const nextErrors: Record<string, string> = {};

    refs.forEach(ref => {
      if (!ref.url.trim()) return;

      if (!isValidReferenceUrl(ref.url)) {
        nextErrors[ref.id] = 'Ingresa una URL válida. Ej: google.com, www.google.com o https://google.com';
      }
    });

    if (Object.keys(nextErrors).length > 0) {
      setUrlErrors(nextErrors);
      return;
    }

    onChange({
      references: refs.map(ref => ({
        ...ref,
        url: ref.url.trim() ? normalizeUrl(ref.url) : '',
      })),
    });

    onNext();
  };

  return (
    <StepLayout
      stepNumber={6}
      title="¿Tienes ejemplos o referencias?"
      subtitle="Comparte sitios web, aplicaciones o sistemas que te gusten. Esto nos ayuda a entender el estilo o funcionalidades que buscas."
      onNext={handleNext}
      onBack={onBack}
    >
      {/* Hint */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4">
        <Link2Icon size={18} className="text-blue-500 shrink-0 mt-0.5" />
        <p className="text-blue-700 text-sm" style={{ lineHeight: 1.6 }}>
          Este paso es completamente <strong>opcional</strong>. Si no tienes referencias, puedes avanzar directamente.
          Las referencias pueden ser apps, páginas web, o incluso capturas de pantalla que puedas describir.
        </p>
      </div>

      {/* Reference cards */}
      <AnimatePresence mode="popLayout">
        {refs.map((ref, i) => (
          <motion.div
            key={ref.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm" style={{ fontWeight: 600 }}>
                Referencia {i + 1}
              </span>
              {refs.length > 1 && (
                <button
                  onClick={() => removeRef(ref.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <Trash2Icon size={14} />
                </button>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-gray-600 text-xs" style={{ fontWeight: 600 }}>
                Enlace (URL)
              </label>
              <input
                className={inputCls}
                type="url"
                placeholder="https://www.ejemplo.com"
                value={ref.url}
                onChange={e => update(ref.id, 'url', e.target.value)}
                onBlur={e => validateAndNormalizeUrl(ref.id, e.target.value)}
              />
              {urlErrors[ref.id] && (
                <p className="text-red-500 text-xs">{urlErrors[ref.id]}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-gray-600 text-xs" style={{ fontWeight: 600 }}>
                ¿Qué te gusta de este ejemplo?
              </label>
              <input
                className={inputCls}
                placeholder="Ej. Me gusta cómo organiza la información en tarjetas y lo fácil que es navegar…"
                value={ref.description}
                onChange={e => update(ref.id, 'description', e.target.value)}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add more */}
      {refs.length < 5 && (
        <button
          onClick={addRef}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-2xl py-3 transition-all text-sm"
          style={{ color: '#9ca3af', fontWeight: 500 }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='#D9AA1E'; e.currentTarget.style.color='#044D8C'; e.currentTarget.style.background='rgba(242,210,48,0.07)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='#e5e7eb'; e.currentTarget.style.color='#9ca3af'; e.currentTarget.style.background='transparent'; }}
        >
          <PlusIcon size={15} />
          Agregar otra referencia
        </button>
      )}
    </StepLayout>
  );
}
