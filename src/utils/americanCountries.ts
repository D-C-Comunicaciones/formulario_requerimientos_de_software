/**
 * Países de América con códigos ISO 3166-1 alpha-2
 * Para usar con react-country-flag
 */

export interface Country {
  code: string; // Código ISO 3166-1 alpha-2
  name: string; // Nombre del país
}

export const AMERICAN_COUNTRIES: Country[] = [
  // // América del Norte
  // { code: 'CA', name: 'Canadá' },
  // { code: 'US', name: 'Estados Unidos' },
  // { code: 'MX', name: 'México' },
  // 
  // // América Central
  // { code: 'BZ', name: 'Belice' },
  // { code: 'CR', name: 'Costa Rica' },
  // { code: 'SV', name: 'El Salvador' },
  // { code: 'GT', name: 'Guatemala' },
  // { code: 'HN', name: 'Honduras' },
  // { code: 'NI', name: 'Nicaragua' },
  // { code: 'PA', name: 'Panamá' },
  // 
  // // Caribe
  // { code: 'AG', name: 'Antigua y Barbuda' },
  // { code: 'BS', name: 'Bahamas' },
  // { code: 'BB', name: 'Barbados' },
  // { code: 'CU', name: 'Cuba' },
  // { code: 'DM', name: 'Dominica' },
  // { code: 'DO', name: 'República Dominicana' },
  // { code: 'GD', name: 'Granada' },
  // { code: 'HT', name: 'Haití' },
  // { code: 'JM', name: 'Jamaica' },
  // { code: 'KN', name: 'San Cristóbal y Nieves' },
  // { code: 'LC', name: 'Santa Lucía' },
  // { code: 'VC', name: 'San Vicente y las Granadinas' },
  // { code: 'TT', name: 'Trinidad y Tobago' },
  
  // América del Sur
  // { code: 'AR', name: 'Argentina' },
  // { code: 'BO', name: 'Bolivia' },
  // { code: 'BR', name: 'Brasil' },
  // { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
//   { code: 'EC', name: 'Ecuador' },
  // { code: 'GY', name: 'Guyana' },
  // { code: 'PY', name: 'Paraguay' },
  // { code: 'PE', name: 'Perú' },
  // { code: 'SR', name: 'Surinam' },
  // { code: 'UY', name: 'Uruguay' },
  // { code: 'VE', name: 'Venezuela' },
];

/**
 * Obtiene el nombre del país a partir del código ISO
 */
export function getCountryName(code: string): string {
  const country = AMERICAN_COUNTRIES.find(c => c.code === code);
  return country ? country.name : code;
}

/**
 * Obtiene el código ISO a partir del nombre del país
 */
export function getCountryCode(name: string): string {
  const country = AMERICAN_COUNTRIES.find(c => c.name === name);
  return country ? country.code : '';
}
