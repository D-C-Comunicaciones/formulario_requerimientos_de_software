export interface PhoneCode {
  country: string;
  code: string;
  iso: string;
}

export const phoneCodes: PhoneCode[] = [
  { country: 'Colombia', code: '+57', iso: 'CO' },
  { country: 'Argentina', code: '+54', iso: 'AR' },
  { country: 'Bolivia', code: '+591', iso: 'BO' },
  { country: 'Brasil', code: '+55', iso: 'BR' },
  { country: 'Canadá', code: '+1', iso: 'CA' },
  { country: 'Chile', code: '+56', iso: 'CL' },
  { country: 'Costa Rica', code: '+506', iso: 'CR' },
  { country: 'Cuba', code: '+53', iso: 'CU' },
  { country: 'Ecuador', code: '+593', iso: 'EC' },
  { country: 'El Salvador', code: '+503', iso: 'SV' },
  { country: 'España', code: '+34', iso: 'ES' },
  { country: 'Estados Unidos', code: '+1', iso: 'US' },
  { country: 'Guatemala', code: '+502', iso: 'GT' },
  { country: 'Honduras', code: '+504', iso: 'HN' },
  { country: 'México', code: '+52', iso: 'MX' },
  { country: 'Nicaragua', code: '+505', iso: 'NI' },
  { country: 'Panamá', code: '+507', iso: 'PA' },
  { country: 'Paraguay', code: '+595', iso: 'PY' },
  { country: 'Perú', code: '+51', iso: 'PE' },
  { country: 'República Dominicana', code: '+1-809', iso: 'DO' },
  { country: 'Uruguay', code: '+598', iso: 'UY' },
  { country: 'Venezuela', code: '+58', iso: 'VE' },
];

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (!cleaned) return '';
  if (cleaned.length <= 4) return cleaned;

  const groups: string[] = [];
  let i = 0;

  while (i < cleaned.length) {
    const remaining = cleaned.length - i;
    if (remaining === 4) {
      groups.push(cleaned.slice(i, i + 4));
      break;
    }
    groups.push(cleaned.slice(i, i + 3));
    i += 3;
  }

  return groups.join(' ');
}

export function buildFullPhoneNumber(countryCode: string, localNumber: string): string {
  const formatted = formatPhoneNumber(localNumber);
  return formatted ? `${countryCode} ${formatted}` : '';
}

export function parsePhoneNumber(fullPhone: string): { code: string; localNumber: string } {
  if (!fullPhone) return { code: '+57', localNumber: '' };

  const sortedCodes = [...phoneCodes].sort((a, b) => b.code.length - a.code.length);
  const matchedCode = sortedCodes.find(pc => fullPhone.startsWith(pc.code));

  if (matchedCode) {
    const localNumber = fullPhone.slice(matchedCode.code.length).trim().replace(/\s/g, '');
    return { code: matchedCode.code, localNumber };
  }

  return { code: '+57', localNumber: fullPhone.replace(/\D/g, '') };
}