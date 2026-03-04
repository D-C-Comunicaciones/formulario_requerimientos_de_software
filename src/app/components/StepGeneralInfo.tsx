import { useState } from 'react';
import type { FormData } from '@/types/form';
import { StepLayout, Field, inputCls } from './StepLayout';
import { CountrySelect } from './CountrySelect';
import { CitySelect } from './CitySelect';
import { ContactMethodSelect } from './ContactMethodSelect';
import { PhoneCodeSelect } from './PhoneCodeSelect';
import { buildFullPhoneNumber, formatPhoneNumber, parsePhoneNumber } from '@/utils/phoneCodes';
import { COLOMBIA_CITIES } from '@/utils/colombiaCities';

interface Props {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const CONTACT_OPTIONS = ['Correo electrónico', 'WhatsApp', 'Teléfono', 'Videollamada', 'Cualquiera'];

export function StepGeneralInfo({ data, onChange, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [phoneCode, setPhoneCode] = useState(() => parsePhoneNumber(data.phone).code);
  const [localPhone, setLocalPhone] = useState(() => parsePhoneNumber(data.phone).localNumber);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!data.fullName.trim())  errs.fullName  = 'Por favor ingresa tu nombre completo.';
    if (!data.email.trim())     errs.email     = 'Por favor ingresa tu correo electrónico.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
                                errs.email     = 'El correo no tiene un formato válido.';
    if (!data.preferredContact) errs.preferredContact = 'Selecciona un medio de contacto.';
    if (!data.country.trim())   errs.country   = 'Por favor selecciona tu país.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => { if (validate()) onNext(); };

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange({ [key]: e.target.value });
    if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  return (
    <StepLayout
      stepNumber={1}
      title="¿Quién eres?"
      subtitle="Cuéntanos un poco sobre ti para que podamos personalizar el documento y contactarte."
      onNext={handleNext}
      onBack={onBack}
      isFirstStep
    >
      {/* Row: Name + Company */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Nombre completo" required error={errors.fullName}>
          <input
            className={inputCls}
            placeholder="Ej. María González"
            value={data.fullName}
            onChange={set('fullName')}
          />
        </Field>
        <Field label="Empresa u organización">
          <input
            className={inputCls}
            placeholder="Ej. TechStart Colombia"
            value={data.company}
            onChange={set('company')}
          />
        </Field>
      </div>

      {/* Row: Email + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Correo electrónico" required error={errors.email}>
          <input
            className={inputCls}
            type="email"
            placeholder="hola@empresa.com"
            value={data.email}
            onChange={set('email')}
          />
        </Field>
        <Field label="Teléfono o WhatsApp">
          <div className="flex gap-2">
            <PhoneCodeSelect
              value={phoneCode}
              onChange={(value) => {
                setPhoneCode(value);
                onChange({ phone: buildFullPhoneNumber(value, localPhone) });
              }}
              className={`${inputCls} w-[150px] px-3`}
            />
            <input
              className={inputCls}
              placeholder="300 000 0000"
              value={formatPhoneNumber(localPhone)}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/\D/g, '');
                setLocalPhone(cleaned);
                onChange({ phone: buildFullPhoneNumber(phoneCode, cleaned) });
              }}
            />
          </div>
        </Field>
      </div>

      {/* Row: Country + City */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="País" required error={errors.country}>
          <CountrySelect
            value={data.country}
            onChange={(countryCode) => {
              onChange({ country: countryCode, city: '' });
              if (errors.country) setErrors(prev => { const n = { ...prev }; delete n.country; return n; });
            }}
            className={inputCls}
            placeholder="Seleccionar país..."
          />
        </Field>
        <Field label="Ciudad">
          <CitySelect
            value={data.city}
            onChange={(city) => onChange({ city })}
            options={COLOMBIA_CITIES}
            className={inputCls}
            placeholder={data.country ? 'Seleccionar ciudad...' : 'Primero selecciona un país'}
            disabled={!data.country}
          />
        </Field>
      </div>

      {/* Row: Address + Contact preference */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Dirección">
          <input
            className={inputCls}
            placeholder="Ej. Calle 123 # 45-67, Barrio Centro"
            value={data.address}
            onChange={set('address')}
          />
        </Field>

        <Field label="Medio preferido de contacto" required error={errors.preferredContact}>
          <ContactMethodSelect
            value={data.preferredContact}
            options={CONTACT_OPTIONS}
            className={inputCls}
            placeholder="Seleccionar…"
            onChange={(value) => {
              onChange({ preferredContact: value });
              if (errors.preferredContact) {
                setErrors(prev => {
                  const next = { ...prev };
                  delete next.preferredContact;
                  return next;
                });
              }
            }}
          />
        </Field>
      </div>
    </StepLayout>
  );
}
