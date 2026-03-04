import { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PlusIcon, Trash2Icon, PencilIcon, CheckIcon, XIcon,
  ChevronUpIcon, ChevronDownIcon, AlertCircleIcon,
} from 'lucide-react';
import type { FormData, Functionality } from '@/types/form';
import { StepLayout, inputCls, textareaCls } from './StepLayout';
import { SearchableSelect } from './SearchableSelect';

interface Props {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const EMPTY_FUNC = (): Functionality => ({
  id: crypto.randomUUID(),
  name: '',
  description: '',
  purpose: '',
  priority: 'Media',
  isEssential: true,
});

const PRIORITY_STYLES: Record<string, string> = {
  Alta:  'bg-red-50    text-red-600    border-red-200',
  Media: 'bg-amber-50  text-amber-600  border-amber-200',
  Baja:  'bg-green-50  text-green-600  border-green-200',
};

const PRIORITY_OPTIONS: Functionality['priority'][] = ['Alta', 'Media', 'Baja'];

const FuncCard = forwardRef<HTMLDivElement, {
  fn: Functionality;
  index: number;
  total: number;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}>(function FuncCard(
  { fn, index, total, onEdit, onDelete, onMoveUp, onMoveDown },
  ref
) {
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"
    >
      <div className="flex items-start gap-3">
        {/* Number badge */}
        <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ fontWeight: 700, background: 'rgba(4,77,140,0.1)', color: '#044D8C' }}>
          {index + 1}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-gray-900" style={{ fontWeight: 600, fontSize: '0.95rem' }}>{fn.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${PRIORITY_STYLES[fn.priority]}`} style={{ fontWeight: 500 }}>
              {fn.priority}
            </span>
            {fn.isEssential && (
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ fontWeight: 500, background: 'rgba(4,77,140,0.1)', color: '#044D8C', border: '1px solid rgba(4,77,140,0.25)' }}>
                Indispensable
              </span>
            )}
          </div>
          {fn.description && (
            <p className="text-gray-500 text-sm line-clamp-2">{fn.description}</p>
          )}
        </div>

        {/* Actions */}
        <div className="shrink-0 flex items-center gap-1">
          <button
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Subir"
          >
            <ChevronUpIcon size={14} />
          </button>
          <button
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Bajar"
          >
            <ChevronDownIcon size={14} />
          </button>
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg text-gray-400 transition-all"
            onMouseEnter={e => { e.currentTarget.style.color='#044D8C'; e.currentTarget.style.background='rgba(4,77,140,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.color='#9ca3af'; e.currentTarget.style.background='transparent'; }}
            title="Editar"
          >
            <PencilIcon size={14} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
            title="Eliminar"
          >
            <Trash2Icon size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
});

function FuncForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Functionality;
  onSave: (fn: Functionality) => void;
  onCancel: () => void;
}) {
  const [fn, setFn] = useState<Functionality>({ ...initial });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof Functionality, val: string | boolean) => {
    setFn(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fn.name.trim())        errs.name        = 'El nombre es obligatorio.';
    if (!fn.description.trim()) errs.description = 'Agrega una descripción.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => { if (validate()) onSave(fn); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 space-y-4" style={{ background: 'rgba(4,77,140,0.05)', border: '2px solid rgba(4,77,140,0.2)' }}
    >
      {/* Name */}
      <div className="space-y-1">
        <label className="text-gray-700 text-sm" style={{ fontWeight: 600 }}>
          Nombre de la funcionalidad <span style={{ color: '#044D8C' }}>*</span>
        </label>
        <input
          className={inputCls}
          placeholder="Ej. Registro de usuarios, Panel de reportes, Notificaciones automáticas…"
          value={fn.name}
          onChange={e => set('name', e.target.value)}
        />
        {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="text-gray-700 text-sm" style={{ fontWeight: 600 }}>
          Descripción detallada <span style={{ color: '#044D8C' }}>*</span>
        </label>
        <textarea
          className={textareaCls}
          rows={3}
          placeholder="Describe con tus palabras qué hace esta funcionalidad y cómo debería comportarse…"
          value={fn.description}
          onChange={e => set('description', e.target.value)}
        />
        {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
      </div>

      {/* Purpose */}
      <div className="space-y-1">
        <label className="text-gray-700 text-sm" style={{ fontWeight: 600 }}>
          ¿Para qué la necesitas?
        </label>
        <input
          className={inputCls}
          placeholder="Ej. Para que los clientes puedan crear su propia cuenta y hacer pedidos sin llamar…"
          value={fn.purpose}
          onChange={e => set('purpose', e.target.value)}
        />
      </div>

      {/* Priority + Essential */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-gray-700 text-sm" style={{ fontWeight: 600 }}>Prioridad</label>
          <SearchableSelect
            className={inputCls}
            value={fn.priority}
            options={PRIORITY_OPTIONS}
            placeholder="Seleccionar prioridad..."
            searchPlaceholder="Buscar prioridad..."
            onChange={(value) => set('priority', value as Functionality['priority'])}
          />
        </div>
        <div className="space-y-1">
          <label className="text-gray-700 text-sm" style={{ fontWeight: 600 }}>
            ¿Es indispensable para iniciar?
          </label>
          <div className="flex gap-3 mt-1">
            {[true, false].map(val => (
              <button
                key={String(val)}
                type="button"
                onClick={() => set('isEssential', val)}
                className={`flex-1 py-2 rounded-xl border text-sm transition-all ${
                  fn.isEssential === val
                    ? 'text-white'
                    : 'bg-white text-gray-600 border-gray-200'
                }`}
                style={fn.isEssential === val ? { fontWeight: 500, background: '#044D8C', borderColor: '#044D8C' } : { fontWeight: 500 }}
                onMouseEnter={e => { if (fn.isEssential !== val) e.currentTarget.style.borderColor='#D9AA1E'; }}
                onMouseLeave={e => { if (fn.isEssential !== val) e.currentTarget.style.borderColor='#e5e7eb'; }}
              >
                {val ? '✓ Sí' : '✗ No'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 text-white px-5 py-2 rounded-xl text-sm transition-all"
          style={{ fontWeight: 600, background: '#044D8C' }}
          onMouseEnter={e => (e.currentTarget.style.background='#033d70')}
          onMouseLeave={e => (e.currentTarget.style.background='#044D8C')}
        >
          <CheckIcon size={15} /> Guardar
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 px-5 py-2 rounded-xl text-sm transition-all"
          style={{ fontWeight: 500 }}
        >
          <XIcon size={15} /> Cancelar
        </button>
      </div>
    </motion.div>
  );
}

export function StepFunctionalities({ data, onChange, onNext, onBack }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState('');

  const fns = data.functionalities;

  const saveNew = (fn: Functionality) => {
    onChange({ functionalities: [...fns, fn] });
    setShowNew(false);
    setError('');
  };

  const saveEdit = (fn: Functionality) => {
    onChange({ functionalities: fns.map(f => f.id === fn.id ? fn : f) });
    setEditingId(null);
  };

  const del = (id: string) => onChange({ functionalities: fns.filter(f => f.id !== id) });

  const move = (index: number, dir: -1 | 1) => {
    const arr = [...fns];
    const swap = index + dir;
    [arr[index], arr[swap]] = [arr[swap], arr[index]];
    onChange({ functionalities: arr });
  };

  const handleNext = () => {
    if (fns.length === 0) {
      setError('Agrega al menos una funcionalidad antes de continuar.');
      return;
    }
    onNext();
  };

  return (
    <StepLayout
      stepNumber={4}
      title="¿Qué debe hacer tu sistema?"
      subtitle="Agrega cada función o característica que necesitas. Puedes agregar tantas como quieras y ordenarlas por importancia."
      onNext={handleNext}
      onBack={onBack}
    >
      {/* List */}
      <AnimatePresence mode="popLayout">
        {fns.map((fn, i) =>
          editingId === fn.id ? (
            <FuncForm
              key={fn.id}
              initial={fn}
              onSave={saveEdit}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <FuncCard
              key={fn.id}
              fn={fn}
              index={i}
              total={fns.length}
              onEdit={() => { setEditingId(fn.id); setShowNew(false); }}
              onDelete={() => del(fn.id)}
              onMoveUp={() => move(i, -1)}
              onMoveDown={() => move(i, 1)}
            />
          )
        )}
      </AnimatePresence>

      {/* New form */}
      <AnimatePresence>
        {showNew && (
          <FuncForm
            key="new"
            initial={EMPTY_FUNC()}
            onSave={saveNew}
            onCancel={() => setShowNew(false)}
          />
        )}
      </AnimatePresence>

      {/* Add button */}
      {!showNew && editingId === null && (
        <button
          onClick={() => { setShowNew(true); setError(''); }}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed rounded-2xl py-4 transition-all"
          style={{ borderColor: 'rgba(4,77,140,0.3)', color: '#044D8C', fontWeight: 500 }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='#D9AA1E'; e.currentTarget.style.background='rgba(242,210,48,0.07)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(4,77,140,0.3)'; e.currentTarget.style.background='transparent'; }}
        >
          <PlusIcon size={18} />
          Agregar funcionalidad
        </button>
      )}

      {/* Validation error */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
          <AlertCircleIcon size={16} />
          {error}
        </div>
      )}

      {/* Summary hint */}
      {fns.length > 0 && (
        <p className="text-gray-400 text-sm text-center">
          {fns.length} funcionalidad{fns.length !== 1 ? 'es' : ''} agregada{fns.length !== 1 ? 's' : ''} ·{' '}
          {fns.filter(f => f.isEssential).length} indispensable{fns.filter(f => f.isEssential).length !== 1 ? 's' : ''}
        </p>
      )}
    </StepLayout>
  );
}
