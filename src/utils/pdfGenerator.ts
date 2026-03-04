import type { FormData } from '@/types/form';
import { getCountryName } from '@utils/americanCountries';

const PRIORITY_COLOR: Record<string, string> = {
  Alta:  '#dc2626',
  Media: '#d97706',
  Baja:  '#16a34a',
};

function esc(text: string): string {
  return (text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}

function row(label: string, value: string): string {
  if (!value?.trim()) return '';
  return `
    <tr>
      <td class="label">${esc(label)}</td>
      <td class="value">${esc(value)}</td>
    </tr>`;
}

function rowLong(label: string, value: string): string {
  if (!value?.trim()) return '';
  return `
    <tr>
      <td class="label">${esc(label)}</td>
      <td class="value long-value">${esc(value)}</td>
    </tr>`;
}

function section(num: number, title: string, content: string): string {
  return `
    <div class="section">
      <div class="section-header">
        <span class="section-num">${num}</span>
        <span class="section-title">${esc(title)}</span>
      </div>
      <div class="section-body">${content}</div>
    </div>`;
}

function buildHTML(fd: FormData, logoDataUrl: string): string {
  const now = new Date().toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const fullNow = new Date().toLocaleString('es-ES');
  const projectName = fd.company || fd.fullName || 'Proyecto de Software';
  
  // País primero, luego ciudad
  const countryName = fd.country ? getCountryName(fd.country) : '';
  const location = countryName && fd.city
    ? `${countryName}, ${fd.city}`
    : fd.city || countryName || '';

  /* § Funcionalidades table */
  const funcRows = fd.functionalities.map((fn, i) => `
    <tr class="${i % 2 === 0 ? 'even' : ''}">
      <td class="center">${i + 1}</td>
      <td><strong>${esc(fn.name)}</strong></td>
      <td>${esc(fn.description)}</td>
      <td>${esc(fn.purpose)}</td>
      <td class="center" style="color:${PRIORITY_COLOR[fn.priority] || '#000'};font-weight:600">
        ${esc(fn.priority)}
      </td>
      <td class="center">${fn.isEssential ? '✓ Sí' : 'No'}</td>
    </tr>`).join('');

  const funcTable = fd.functionalities.length === 0
    ? '<p class="empty">No se especificaron funcionalidades.</p>'
    : `<table class="func-table">
        <thead>
          <tr>
            <th>#</th><th>Nombre</th><th>Descripción</th>
            <th>Propósito</th><th>Prioridad</th><th>¿Indispensable?</th>
          </tr>
        </thead>
        <tbody>${funcRows}</tbody>
      </table>`;

  /* § References */
  const validRefs = (fd.references || []).filter(r => r.url || r.description);
  const refContent = validRefs.length === 0
    ? '<p class="empty">No se especificaron referencias.</p>'
    : `<table class="field-table">
        <tbody>
          ${validRefs.map((r, i) => `
            <tr>
              <td class="label">Referencia ${i + 1}</td>
              <td class="value long-value">
                ${r.url ? `<div>${esc(r.url)}</div>` : ''}
                ${r.description ? `<div class="ref-desc">${esc(r.description)}</div>` : ''}
              </td>
            </tr>`).join('')}
        </tbody>
      </table>`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Requerimientos — ${esc(projectName)}</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    font-size: 10pt;
    color: #1e293b;
    background: #fff;
    line-height: 1.5;
  }

  .content { padding-top: 0; }

  /* ── COVER ── */
  .cover {
    background: #ffffff;
    color: #1e293b;
    padding: 35mm 24mm;
    min-height: 120mm;
    page-break-after: always;
    position: relative;
    border: 1px solid #cbd5e1;
  }
  .cover-badge {
    display: inline-block;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    color: #1d4ed8;
    padding: 4px 14px;
    border-radius: 99px;
    font-size: 8pt;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin-bottom: 16px;
  }
  .cover h1 {
    font-size: 24pt;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.2;
    margin-bottom: 6mm;
  }
  .cover-meta {
    color: #334155;
    font-size: 10pt;
    margin-top: 12mm;
  }
  .cover-meta p { margin-bottom: 3px; }
  .cover-footer {
    position: absolute;
    bottom: 12mm; left: 30mm; right: 30mm;
    color: #475569;
    font-size: 8pt;
    border-top: 1px solid #cbd5e1;
    padding-top: 6px;
    display: flex;
    justify-content: space-between;
  }

  /* ── SECTIONS ── */
  .section {
    margin: 0 30mm 8mm;
    page-break-inside: avoid;
    border: 1px solid #dbe2ea;
    border-radius: 8px;
    overflow: hidden;
  }
  .section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: #f8fafc;
    border-bottom: 1px solid #dbe2ea;
  }
  .section-num {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #044D8C;
    color: #fff;
    font-size: 9pt;
    font-weight: 700;
    flex-shrink: 0;
  }
  .section-title {
    font-size: 13pt;
    font-weight: 700;
    color: #1e293b;
  }
  .section-body { padding: 0 2mm; }

  /* ── FIELD TABLE ── */
  .field-table {
    width: 100%;
    border-collapse: collapse;
  }
  .field-table .label {
    width: 38%;
    padding: 8px 10px;
    color: #475569;
    font-size: 8.5pt;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-weight: 600;
    vertical-align: top;
    border: 1px solid #dbe2ea;
    background: #f8fafc;
  }
  .field-table .value {
    padding: 8px 10px;
    color: #1e293b;
    font-size: 10pt;
    vertical-align: top;
    border: 1px solid #dbe2ea;
  }
  .field-table .long-value {
    white-space: normal;
    line-height: 1.65;
  }

  /* ── FUNCTIONALITIES TABLE ── */
  .func-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 8.5pt;
    table-layout: fixed;
  }
  .func-table thead tr {
    background: #f1f5f9;
    color: #0f172a;
  }
  .func-table thead th {
    padding: 6px 8px;
    text-align: left;
    font-weight: 600;
    font-size: 8pt;
    letter-spacing: 0.03em;
    border: 1px solid #dbe2ea;
  }
  .func-table tbody tr { border-bottom: 1px solid #dbe2ea; }
  .func-table tbody tr.even { background: #f8fafc; }
  .func-table tbody td {
    padding: 7px 8px;
    vertical-align: top;
    color: #1e293b;
    border: 1px solid #dbe2ea;
  }
  .func-table .center { text-align: center; }

  /* ── REFERENCES ── */
  .ref-desc {
    color: #64748b;
    font-size: 8.5pt;
    margin-top: 4px;
  }

  /* ── MISC ── */
  .empty { color: #94a3b8; font-size: 9pt; font-style: italic; }

  /* ── PAGE HEADER ── */
  .page-header {
    display: none;
    position: running(header);
    background: #1e293b;
    color: #fff;
    font-size: 8pt;
    padding: 4px 30mm;
    justify-content: space-between;
  }

  /* ── PRINT ── */
  @media print {
    body { font-size: 9.5pt; }
    .cover { padding: 28mm 18mm; }
    .section { margin: 0 20mm 6mm; }
    .cover-footer { left: 18mm; right: 18mm; }
  }

  @page {
    margin: 15mm 0 15mm;
    size: A4;
  }
  @page :first { margin: 0; }
</style>
</head>
<body>

<div class="content">
  <!-- COVER -->
  <div class="cover">
    ${logoDataUrl ? `<img src="${logoDataUrl}" alt="Logo" style="position:absolute;top:22px;left:30mm;height:46px;object-fit:contain;" />` : ''}
    <div class="cover-badge">Documento de Requerimientos de Software</div>
    <h1>${esc(projectName)}</h1>
    <div class="cover-meta">
      <p>Preparado por: <strong style="color:#fff">${esc(fd.fullName || 'No especificado')}</strong></p>
      <p>Correo: ${esc(fd.email || 'No especificado')}</p>
      ${fd.company ? `<p>Empresa: ${esc(fd.company)}</p>` : ''}
    </div>
    <div class="cover-footer">
      <span>Documento Confidencial</span>
      <span>Generado el ${fullNow}</span>
    </div>
  </div>

  <!-- § 1 INFORMACIÓN DEL CLIENTE -->
  ${section(1, 'Información del Cliente', `
    <table class="field-table">
      ${row('Nombre completo', fd.fullName)}
      ${row('Empresa / Organización', fd.company)}
      ${row('Correo electrónico', fd.email)}
      ${row('Teléfono', fd.phone)}
      ${row('Ubicación', location)}
      ${fd.address ? row('Dirección', fd.address) : ''}
      ${row('Medio preferido de contacto', fd.preferredContact)}
    </table>
  `)}

  <!-- § 2 PROBLEMA -->
  ${section(2, 'Descripción del Problema o Necesidad', `
    <table class="field-table">
      ${rowLong('¿Qué sucede actualmente?', fd.currentSituation)}
      ${rowLong('¿Qué desea mejorar?', fd.desiredImprovement)}
      ${rowLong('¿Cómo lo hace hoy?', fd.currentProcess)}
      ${rowLong('Dificultades', fd.difficulties)}
    </table>
  `)}

  <!-- § 3 OBJETIVO -->
  ${section(3, 'Objetivo Principal', `
    <table class="field-table">
      ${rowLong('¿Qué resultado desea lograr?', fd.desiredResult)}
      ${rowLong('¿Cómo sabrá que fue exitoso?', fd.successCriteria)}
    </table>
  `)}

  <!-- § 4 FUNCIONALIDADES -->
  ${section(4, 'Funcionalidades Requeridas', funcTable)}

  <!-- § 5 USUARIOS -->
  ${section(5, 'Usuarios del Sistema', `
    <table class="field-table">
      ${row('¿Quiénes lo usarán?', fd.userTypes)}
      ${row('Cantidad estimada de usuarios', fd.userCount)}
      ${row('Tipo de usuario / Rol', fd.userDescription)}
    </table>
  `)}

  <!-- § 6 REFERENCIAS -->
  ${section(6, 'Referencias', refContent)}

  <!-- § 7 PRESUPUESTO -->
  ${section(7, 'Presupuesto y Tiempos', `
    <table class="field-table">
      ${row('Fecha ideal de lanzamiento', fd.launchDate)}
      ${row('Rango estimado de inversión', fd.budgetRange)}
    </table>
  `)}

  <!-- DOCUMENT FOOTER -->
  <div style="margin: 10mm 30mm 6mm; padding-top: 6mm; border-top: 1px solid #e2e8f0; display:flex; justify-content:space-between;">
    <span style="color:#94a3b8;font-size:8pt">Documento Confidencial — Solo para uso interno</span>
    <span style="color:#94a3b8;font-size:8pt">Generado el ${fullNow}</span>
  </div>
</div>
</body>
</html>`;
}

type PdfSection = {
  title: string;
  rows: Array<[string, string]>;
};

function toDisplayValue(value?: string): string {
  return value && value.trim() ? value.trim() : 'No especificado';
}

async function loadLogoData(): Promise<{ dataUrl: string; format: 'PNG' | 'JPEG' | 'WEBP'; ratio: number } | null> {
  try {
    const response = await fetch('/img/logo-horizontal.png', { cache: 'no-store' });
    if (!response.ok) return null;

    const blob = await response.blob();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    const format: 'PNG' | 'JPEG' | 'WEBP' = blob.type.includes('jpeg') || blob.type.includes('jpg')
      ? 'JPEG'
      : blob.type.includes('webp')
        ? 'WEBP'
        : 'PNG';

    const ratio = await new Promise<number>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img.naturalWidth > 0 && img.naturalHeight > 0 ? img.naturalWidth / img.naturalHeight : 3.2);
      img.onerror = () => resolve(3.2);
      img.src = dataUrl;
    });

    return { dataUrl, format, ratio };
  } catch {
    return null;
  }
}

function drawHeader(
  pdf: import('jspdf').jsPDF,
  projectName: string,
  generatedAt: string,
  logo: { dataUrl: string; format: 'PNG' | 'JPEG' | 'WEBP'; ratio: number } | null,
) {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 12;

  if (logo) {
    const targetWidth = 56;
    const targetHeight = Math.max(10, Math.min(20, targetWidth / logo.ratio));
    pdf.addImage(logo.dataUrl, logo.format, margin, 8, targetWidth, targetHeight);
  }

  const rightX = pageWidth - margin;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text('Formulario de Requerimientos de Software', rightX, 12, { align: 'right' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text(projectName, rightX, 17, { align: 'right' });
  pdf.text(`Generado: ${generatedAt}`, rightX, 22, { align: 'right' });

  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(0.4);
  pdf.line(margin, 26, pageWidth - margin, 26);
}

function addStructuredPdfContent(
  pdf: import('jspdf').jsPDF,
  formData: FormData,
  logo: { dataUrl: string; format: 'PNG' | 'JPEG' | 'WEBP'; ratio: number } | null,
) {
  const countryName = formData.country ? getCountryName(formData.country) : '';
  const location = countryName && formData.city
    ? `${countryName}, ${formData.city}`
    : formData.city || countryName || 'No especificado';

  const functionalitiesRows = formData.functionalities.length
    ? formData.functionalities.map((item, index) => ([
        `Funcionalidad ${index + 1}`,
        [
          `Nombre: ${toDisplayValue(item.name)}`,
          `Descripción: ${toDisplayValue(item.description)}`,
          `Propósito: ${toDisplayValue(item.purpose)}`,
          `Prioridad: ${toDisplayValue(item.priority)}`,
          `Indispensable: ${item.isEssential ? 'Sí' : 'No'}`,
        ].join('\n'),
      ] as [string, string]))
    : [['Funcionalidades', 'No se especificaron funcionalidades.'] as [string, string]];

  const referencesRows = formData.references.length
    ? formData.references
        .filter((item) => item.url || item.description)
        .map((item, index) => ([
          `Referencia ${index + 1}`,
          [
            `URL: ${toDisplayValue(item.url)}`,
            `Descripción: ${toDisplayValue(item.description)}`,
          ].join('\n'),
        ] as [string, string]))
    : [['Referencias', 'No se especificaron referencias.'] as [string, string]];

  const sections: PdfSection[] = [
    {
      title: '1. Información General',
      rows: [
        ['Nombre completo', toDisplayValue(formData.fullName)],
        ['Empresa', toDisplayValue(formData.company)],
        ['Correo', toDisplayValue(formData.email)],
        ['Teléfono', toDisplayValue(formData.phone)],
        ['Ubicación', toDisplayValue(location)],
        ['Dirección', toDisplayValue(formData.address)],
        ['Contacto preferido', toDisplayValue(formData.preferredContact)],
      ],
    },
    {
      title: '2. Problema o Necesidad',
      rows: [
        ['Situación actual', toDisplayValue(formData.currentSituation)],
        ['Mejora deseada', toDisplayValue(formData.desiredImprovement)],
        ['Proceso actual', toDisplayValue(formData.currentProcess)],
        ['Dificultades', toDisplayValue(formData.difficulties)],
      ],
    },
    {
      title: '3. Objetivo',
      rows: [
        ['Resultado esperado', toDisplayValue(formData.desiredResult)],
        ['Criterio de éxito', toDisplayValue(formData.successCriteria)],
      ],
    },
    {
      title: '4. Funcionalidades',
      rows: functionalitiesRows,
    },
    {
      title: '5. Usuarios',
      rows: [
        ['Tipos de usuario', toDisplayValue(formData.userTypes)],
        ['Cantidad de usuarios', toDisplayValue(formData.userCount)],
        ['Descripción del usuario', toDisplayValue(formData.userDescription)],
      ],
    },
    {
      title: '6. Referencias',
      rows: referencesRows,
    },
    {
      title: '7. Presupuesto y Tiempos',
      rows: [
        ['Fecha ideal de lanzamiento', toDisplayValue(formData.launchDate)],
        ['Rango de inversión', toDisplayValue(formData.budgetRange)],
      ],
    },
  ];

  const projectName = toDisplayValue(formData.company || formData.fullName || 'Proyecto de Software');
  const generatedAt = new Date().toLocaleString('es-ES');

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 12;
  const bottomLimit = pageHeight - 12;
  const leftColWidth = 56;
  const rightColWidth = pageWidth - margin * 2 - leftColWidth;

  drawHeader(pdf, projectName, generatedAt, logo);

  let y = 32;

  const drawSectionTitle = (title: string) => {
    const titleHeight = 8;
    if (y + titleHeight > bottomLimit) {
      pdf.addPage();
      drawHeader(pdf, projectName, generatedAt, logo);
      y = 32;
    }

    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.35);
    pdf.rect(margin, y, pageWidth - margin * 2, titleHeight);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text(title, margin + 2, y + 5.5);
    y += titleHeight;
  };

  const drawRow = (label: string, value: string) => {
    const labelLines = pdf.splitTextToSize(label, leftColWidth - 4);
    const valueLines = pdf.splitTextToSize(value, rightColWidth - 4);
    const maxLines = Math.max(labelLines.length, valueLines.length, 1);
    const rowHeight = Math.max(8, maxLines * 4.8 + 2);

    if (y + rowHeight > bottomLimit) {
      pdf.addPage();
      drawHeader(pdf, projectName, generatedAt, logo);
      y = 32;
    }

    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.3);
    pdf.rect(margin, y, leftColWidth, rowHeight);
    pdf.rect(margin + leftColWidth, y, rightColWidth, rowHeight);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9.5);
    pdf.text(labelLines, margin + 2, y + 5);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    pdf.text(valueLines, margin + leftColWidth + 2, y + 5);

    y += rowHeight;
  };

  sections.forEach((section) => {
    drawSectionTitle(section.title);
    section.rows.forEach(([label, value]) => drawRow(label, value));
    y += 4;
  });
}

/**
 * Genera el documento como un PDF real usando jsPDF + html2canvas.
 * Retorna un Blob de tipo application/pdf listo para descarga directa.
 */
export async function generatePDF(formData: FormData): Promise<Blob> {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait',
  });

  const logo = await loadLogoData();
  addStructuredPdfContent(pdf, formData, logo);
  return pdf.output('blob');
}

/**
 * Re-open the saved HTML in a new tab for re-printing / saving.
 */
export function downloadPDF(blob: Blob, _filename?: string) {
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (!win) {
    const a    = document.createElement('a');
    a.href     = url;
    a.download = _filename ?? 'requerimientos-software.pdf';
    a.click();
  }
}

/**
 * Convierte un Blob HTML a base64 limpio para enviar por email
 */
export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Eliminar el prefijo data:...;base64,
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
