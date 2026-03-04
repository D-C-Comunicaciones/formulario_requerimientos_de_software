import { useState, useRef, useEffect } from 'react';
import {
  ChevronDownIcon,
  SearchIcon,
  MailIcon,
  MessageCircleIcon,
  PhoneIcon,
  VideoIcon,
  CircleEllipsisIcon,
} from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  className?: string;
  placeholder?: string;
}

export function ContactMethodSelect({
  value,
  onChange,
  options,
  className = '',
  placeholder = 'Seleccionar opción...',
}: Props) {
  const [open, setOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = options.filter(option =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      setSearch('');
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const updateDropdownDirection = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = 260;
      setOpenUpward(spaceBelow < dropdownHeight && spaceAbove > spaceBelow);
    };

    updateDropdownDirection();
    window.addEventListener('resize', updateDropdownDirection);
    window.addEventListener('scroll', updateDropdownDirection, true);

    return () => {
      window.removeEventListener('resize', updateDropdownDirection);
      window.removeEventListener('scroll', updateDropdownDirection, true);
    };
  }, [open]);

  const getIcon = (option: string) => {
    const normalized = option.toLowerCase();

    if (normalized.includes('correo')) return <MailIcon size={15} className="shrink-0" />;
    if (normalized.includes('whatsapp')) return <MessageCircleIcon size={15} className="shrink-0" />;
    if (normalized.includes('teléfono') || normalized.includes('telefono')) return <PhoneIcon size={15} className="shrink-0" />;
    if (normalized.includes('videollamada')) return <VideoIcon size={15} className="shrink-0" />;
    return <CircleEllipsisIcon size={15} className="shrink-0" />;
  };

  return (
    <div ref={ref} className="relative" style={{ userSelect: 'none' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-2 text-left ${className}`}
        style={{ justifyContent: 'space-between' }}
      >
        {value ? (
          <span className="flex items-center gap-2 min-w-0 text-gray-900">
            {getIcon(value)}
            <span className="truncate">{value}</span>
          </span>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
        <ChevronDownIcon
          size={16}
          className="text-gray-400 shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {open && (
        <div
          className={`absolute z-50 w-full bg-white border border-gray-200 rounded-xl shadow-lg ${openUpward ? 'mb-1' : 'mt-1'}`}
          style={{ minWidth: '220px', top: openUpward ? 'auto' : '100%', bottom: openUpward ? '100%' : 'auto' }}
        >
          <div className="px-2 pt-2 pb-1 border-b border-gray-100">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
              <SearchIcon size={13} className="text-gray-400 shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar opción..."
                className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="overflow-auto" style={{ maxHeight: '200px' }}>
            {filtered.length === 0 && (
              <div className="px-3 py-3 text-sm text-gray-400 text-center">No se encontraron opciones</div>
            )}

            {!search && (
              <button
                type="button"
                onClick={() => { onChange(''); setOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:bg-gray-50 transition-colors"
              >
                {placeholder}
              </button>
            )}

            {filtered.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => { onChange(option); setOpen(false); }}
                className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-colors"
                style={{
                  background: option === value ? 'rgba(4,77,140,0.08)' : undefined,
                  fontWeight: option === value ? 600 : 400,
                }}
              >
                {getIcon(option)}
                <span className="truncate">{option}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
