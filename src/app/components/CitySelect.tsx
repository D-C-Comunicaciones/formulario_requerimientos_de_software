import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, SearchIcon } from 'lucide-react';

interface Props {
  value: string;
  onChange: (city: string) => void;
  options: string[];
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function CitySelect({
  value,
  onChange,
  options,
  className = '',
  placeholder = 'Seleccionar ciudad...',
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = options.filter(city =>
    city.toLowerCase().includes(search.toLowerCase())
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
    if (open && !disabled) {
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      setSearch('');
    }
  }, [open, disabled]);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  useEffect(() => {
    if (!open || disabled) return;

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
  }, [open, disabled]);

  return (
    <div ref={ref} className="relative" style={{ userSelect: 'none' }}>
      <button
        type="button"
        onClick={() => {
          if (!disabled) setOpen(o => !o);
        }}
        disabled={disabled}
        className={`w-full flex items-center gap-2 text-left ${className} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        style={{ justifyContent: 'space-between' }}
      >
        <span className="truncate text-gray-900">
          {value || <span className="text-gray-400">{placeholder}</span>}
        </span>
        <ChevronDownIcon
          size={16}
          className="text-gray-400 shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {open && !disabled && (
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
                placeholder="Buscar ciudad..."
                className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="overflow-auto" style={{ maxHeight: '200px' }}>
            {filtered.length === 0 && (
              <div className="px-3 py-3 text-sm text-gray-400 text-center">No se encontraron ciudades</div>
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

            {filtered.map(city => (
              <button
                key={city}
                type="button"
                onClick={() => { onChange(city); setOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-colors"
                style={{
                  background: city === value ? 'rgba(4,77,140,0.08)' : undefined,
                  fontWeight: city === value ? 600 : 400,
                }}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
