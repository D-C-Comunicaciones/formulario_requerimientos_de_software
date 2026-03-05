function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function baseLayout(preview: string, content: string): string {
  return `
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Formulario de Requerimientos</title>
  </head>
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preview}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f4f6;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="max-width:640px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;">
            ${content}
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function buildClientEmailHtml(clientName: string): string {
  const safeClientName = esc(clientName || 'Cliente');
  const year = new Date().getFullYear();

  return baseLayout(
    'Hemos recibido tu formulario de requerimientos de software',
    `
      <tr>
        <td style="background:#4F46E5;padding:32px 24px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:28px;line-height:1.2;">✅ Formulario Recibido</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 24px;color:#374151;font-size:16px;line-height:1.7;">
          <p style="margin:0 0 14px 0;">Hola <strong>${safeClientName}</strong>,</p>
          <p style="margin:0 0 14px 0;">Hemos recibido exitosamente tu formulario de requerimientos de software.</p>
          <p style="margin:0 0 14px 0;">Nuestro equipo revisará la información y te contactará pronto para discutir los próximos pasos.</p>
          <p style="margin:0 0 20px 0;">Adjunto encontrarás una copia en PDF de tu formulario.</p>
          <div style="background:#EEF2FF;border-left:4px solid #4F46E5;border-radius:8px;padding:16px;">
            <p style="margin:0 0 10px 0;color:#3730A3;"><strong>💡 Próximos pasos:</strong></p>
            <p style="margin:0 0 6px 0;">1️⃣ Revisaremos tu solicitud en 24-48 horas</p>
            <p style="margin:0 0 6px 0;">2️⃣ Te contactaremos para agendar reunión inicial</p>
            <p style="margin:0;">3️⃣ Discutiremos alcance y presupuesto del proyecto</p>
          </div>
          <p style="margin:18px 0 0 0;"><strong>¡Gracias por confiar en nosotros!</strong></p>
        </td>
      </tr>
      <tr>
        <td style="background:#f9fafb;padding:20px 24px;text-align:center;border-top:1px solid #e5e7eb;color:#6b7280;font-size:13px;line-height:1.5;">
          <p style="margin:0 0 4px 0;">Este es un correo automático, por favor no respondas a este mensaje.</p>
          <p style="margin:0;">© ${year} Formulario de Requerimientos. Todos los derechos reservados.</p>
        </td>
      </tr>
    `,
  );
}

export function buildAdminEmailHtml(clientName: string, clientEmail: string, submittedAt: string): string {
  const safeClientName = esc(clientName || 'No especificado');
  const safeClientEmail = esc(clientEmail || 'No especificado');
  const safeSubmittedAt = esc(submittedAt || 'No especificado');
  const year = new Date().getFullYear();

  return baseLayout(
    `Nuevo formulario recibido de ${safeClientName}`,
    `
      <tr>
        <td style="background:#059669;padding:32px 24px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:28px;line-height:1.2;">📋 Nuevo Formulario Recibido</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 24px;color:#374151;font-size:16px;line-height:1.7;">
          <p style="margin:0 0 16px 0;font-weight:600;color:#1f2937;">Se ha recibido un nuevo formulario de requerimientos de software.</p>
          <div style="background:#f9fafb;border:2px solid #059669;border-radius:10px;padding:16px;margin-bottom:18px;">
            <p style="margin:0 0 12px 0;color:#047857;font-weight:700;">Información del Cliente</p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
              <tr>
                <td style="padding:6px 10px 6px 0;color:#6b7280;font-weight:600;width:130px;">👤 Cliente:</td>
                <td style="padding:6px 0;color:#111827;">${safeClientName}</td>
              </tr>
              <tr>
                <td style="padding:6px 10px 6px 0;color:#6b7280;font-weight:600;">📧 Email:</td>
                <td style="padding:6px 0;color:#111827;">${safeClientEmail}</td>
              </tr>
              <tr>
                <td style="padding:6px 10px 6px 0;color:#6b7280;font-weight:600;">📅 Fecha:</td>
                <td style="padding:6px 0;color:#111827;">${safeSubmittedAt}</td>
              </tr>
            </table>
          </div>
          <div style="background:#FEF3C7;border-left:4px solid #F59E0B;border-radius:8px;padding:14px;margin-bottom:16px;">
            <p style="margin:0 0 8px 0;color:#92400E;"><strong>⚡ Acción requerida:</strong></p>
            <p style="margin:0 0 4px 0;color:#78350F;">• Revisa el PDF adjunto con todos los detalles</p>
            <p style="margin:0 0 4px 0;color:#78350F;">• Contacta al cliente en las próximas 24-48 horas</p>
            <p style="margin:0;color:#78350F;">• Agenda una reunión inicial para discutir el proyecto</p>
          </div>
          <p style="margin:0;">El documento PDF con todos los detalles está adjunto a este correo.</p>
        </td>
      </tr>
      <tr>
        <td style="background:#f9fafb;padding:20px 24px;text-align:center;border-top:1px solid #e5e7eb;color:#6b7280;font-size:13px;line-height:1.5;">
          <p style="margin:0 0 4px 0;">Sistema automatizado de formularios</p>
          <p style="margin:0;">© ${year} Formulario de Requerimientos</p>
        </td>
      </tr>
    `,
  );
}
