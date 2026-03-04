/**
 * Email Service – Servicio de envío de correos con Resend
 *
 * Arquitectura Serverless:
 * - Frontend envía petición a /api/send-email
 * - Función serverless procesa y envía con Resend
 * - No requiere backend Express
 *
 * Variables de entorno requeridas (ver archivo .env):
 * ─────────────────────────────────────────────────────
 *   RESEND_API_KEY=re_TuApiKey (serverless only)
 *   SENDER_EMAIL=noreply@tudominio.com
 *   SENDER_NAME=Formulario de Requerimientos
 *   ADMIN_EMAIL=admin@tuempresa.com
 * ─────────────────────────────────────────────────────
 */

import { env, getApiUrl } from '@config/env';

export interface EmailPayload {
  clientEmail: string;
  clientName: string;
  pdfBlob: Blob;
}

export interface EmailResult {
  success: boolean;
  message: string;
  sentAt?: string;
}

/**
 * Convierte un Blob a base64 limpio
 */
function blobToBase64(blob: Blob): Promise<string> {
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

/**
 * Envía el formulario por email usando la función serverless
 * Endpoint: /api/send-email
 */
export async function sendFormEmail(payload: EmailPayload): Promise<EmailResult> {
  try {
    // Convertir el PDF blob a base64
    const pdfBase64 = await blobToBase64(payload.pdfBlob);

    // Construir la URL del endpoint serverless
    const endpoint = getApiUrl(env.apiEndpoint);

    console.log('[EmailService] Enviando correo a:', endpoint);

    // Realizar la petición al endpoint serverless
    let response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientEmail: payload.clientEmail,
        clientName: payload.clientName,
        pdfBase64,
      }),
    });

    // Fallback en desarrollo: si Vite responde 404 en /api, intentar contra :3000 directamente
    if (!response.ok && response.status === 404 && env.isDevelopment) {
      const fallbackEndpoint = `${(env.appUrl || 'http://localhost:3000').replace(/\/+$/, '')}${env.apiEndpoint.startsWith('/') ? env.apiEndpoint : `/${env.apiEndpoint}`}`;

      if (fallbackEndpoint !== endpoint) {
        console.warn('[EmailService] Endpoint relativo no encontrado, reintentando en:', fallbackEndpoint);
        response = await fetch(fallbackEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clientEmail: payload.clientEmail,
            clientName: payload.clientName,
            pdfBase64,
          }),
        });
      }
    }

    // Manejar errores HTTP
    if (!response.ok) {
      let errorMessage = `Error HTTP ${response.status}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }

      if (response.status === 404 && env.isDevelopment) {
        throw new Error('No se encontró /api/send-email. En desarrollo ejecuta también `vercel dev` en puerto 3000 o configura un backend disponible.');
      }

      throw new Error(errorMessage);
    }

    // Parsear respuesta exitosa
    const result = await response.json();
    
    console.log('[EmailService] ✅ Correo enviado exitosamente');

    return {
      success: true,
      message: result.message || 'Correos enviados exitosamente',
      sentAt: result.sentAt,
    };

  } catch (error) {
    console.error('[EmailService] ❌ Error al enviar correo:', error);

    // Mensajes de error más amigables
    let message = 'Error al enviar el correo. Por favor intenta de nuevo.';

    if (error instanceof TypeError && error.message.includes('fetch')) {
      message = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
    } else if (error instanceof Error) {
      message = error.message;
    }

    return {
      success: false,
      message,
    };
  }
}
