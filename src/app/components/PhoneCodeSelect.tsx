import { useState, useRef, useEffect } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { ChevronDownIcon, SearchIcon } from 'lucide-react';
import { phoneCodes } from '@/utils/phoneCodes';

interface Props {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function PhoneCodeSelect({ value, onChange, className = '' }: Props) {
  const [open, setOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = phoneCodes.find(pc => pc.code === value);

  const filtered = phoneCodes.filter(pc =>
    `${pc.country} ${pc.code}`.toLowerCase().includes(search.toLowerCase())
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
      const dropdownHeight = 300;
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
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-2 text-left ${className}`}
        style={{ justifyContent: 'space-between' }}
      >
        {selected ? (
          <span className="flex items-center gap-2 min-w-0">
            <ReactCountryFlag
              countryCode={selected.iso}
              svg
              style={{ width: '1.2em', height: '1.2em', flexShrink: 0 }}
            />
            <span className="truncate text-gray-900">{selected.code}</span>
          </span>
        ) : (
          <span className="text-gray-400">Indicativo</span>
        )}

        <ChevronDownIcon
          size={16}
          className="text-gray-400 shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {open && (
        <div
          className={`absolute z-50 w-[260px] bg-white border border-gray-200 rounded-xl shadow-lg ${openUpward ? 'mb-1' : 'mt-1'}`}
          style={{ top: openUpward ? 'auto' : '100%', bottom: openUpward ? '100%' : 'auto' }}
        >
          <div className="px-2 pt-2 pb-1 border-b border-gray-100">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
              <SearchIcon size={13} className="text-gray-400 shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar país o código..."
                className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="overflow-auto" style={{ maxHeight: '240px' }}>
            {filtered.length === 0 && (
              <div className="px-3 py-3 text-sm text-gray-400 text-center">No se encontraron códigos</div>
            )}

            {filtered.map(pc => (
              <button
                key={`${pc.iso}-${pc.code}`}
                type="button"
                onClick={() => { onChange(pc.code); setOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-colors"
                style={{
                  background: pc.code === value ? 'rgba(4,77,140,0.08)' : undefined,
                  fontWeight: pc.code === value ? 600 : 400,
                }}
              >
                <ReactCountryFlag
                  countryCode={pc.iso}
                  svg
                  style={{ width: '1.2em', height: '1.2em', flexShrink: 0 }}
                />
                <span className="min-w-[56px]">{pc.code}</span>
                <span className="truncate text-gray-600">{pc.country}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
