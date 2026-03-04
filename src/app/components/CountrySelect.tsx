import { useState, useRef, useEffect } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { ChevronDownIcon, SearchIcon } from 'lucide-react';
import { AMERICAN_COUNTRIES } from '@utils/americanCountries';

interface Props {
  value: string;
  onChange: (countryCode: string) => void;
  className?: string;
  placeholder?: string;
}

export function CountrySelect({
  value,
  onChange,
  className = '',
  placeholder = 'Seleccionar país...',
}: Props) {
  const [open, setOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = AMERICAN_COUNTRIES.find(c => c.code === value);

  const filtered = AMERICAN_COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // Cerrar al hacer clic fuera
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

  // Enfocar buscador al abrir
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

  return (
    <div ref={ref} className="relative" style={{ userSelect: 'none' }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-2 text-left ${className}`}
        style={{ justifyContent: 'space-between' }}
      >
        <span className="flex items-center gap-2 min-w-0">
          {selected ? (
            <>
              <ReactCountryFlag
                countryCode={selected.code}
                svg
                style={{ width: '1.4em', height: '1.4em', flexShrink: 0 }}
              />
              <span className="truncate">{selected.name}</span>
            </>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </span>
        <ChevronDownIcon
          size={16}
          className="text-gray-400 shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={`absolute z-50 w-full bg-white border border-gray-200 rounded-xl shadow-lg ${openUpward ? 'mb-1' : 'mt-1'}`}
          style={{ minWidth: '220px', top: openUpward ? 'auto' : '100%', bottom: openUpward ? '100%' : 'auto' }}
        >
          {/* Buscador */}
          <div className="px-2 pt-2 pb-1 border-b border-gray-100">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
              <SearchIcon size={13} className="text-gray-400 shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar país..."
                className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Lista */}
          <div className="overflow-auto" style={{ maxHeight: '200px' }}>
            {filtered.length === 0 && (
              <div className="px-3 py-3 text-sm text-gray-400 text-center">No se encontraron países</div>
            )}

            {!search && (
              <button
                type="button"
                onClick={() => { onChange(''); setOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:bg-gray-50 transition-colors"
              >
                {placeholder}
              </button>
            )}

            {filtered.map(country => (
              <button
                key={country.code}
                type="button"
                onClick={() => { onChange(country.code); setOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-colors"
                style={{
                  background: country.code === value ? 'rgba(4,77,140,0.08)' : undefined,
                  fontWeight: country.code === value ? 600 : 400,
                }}
              >
                <ReactCountryFlag
                  countryCode={country.code}
                  svg
                  style={{ width: '1.4em', height: '1.4em', flexShrink: 0 }}
                />
                <span className="truncate">{country.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
