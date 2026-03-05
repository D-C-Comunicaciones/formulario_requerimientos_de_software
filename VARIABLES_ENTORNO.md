# 📋 Guía de Variables de Entorno

## Resumen

Este proyecto utiliza dos tipos de variables de entorno:

1. **Variables del Frontend** (prefijo `VITE_*`): Públicas, accesibles en el navegador
2. **Variables del Servidor**: Privadas, solo para serverless functions

## Estructura de Configuración

El proyecto utiliza **dos archivos de configuración separados**:

### 1. Frontend: `src/config/env.ts`

**Para:** Componentes React, hooks, utilidades del cliente

**Variables:** Solo `VITE_*` (públicas, visibles en el navegador)

**Método de acceso:** `import.meta.env`

```typescript
import { env, getApiUrl } from '@config/env';

// Variables disponibles:
env.appUrl          // VITE_APP_URL
env.appName         // VITE_APP_NAME
env.appVersion      // VITE_APP_VERSION
env.apiEndpoint     // VITE_API_ENDPOINT
env.isDevelopment
env.isProduction
```

### 2. Backend: `api/config.ts`

**Para:** Serverless functions (API routes)

**Variables:** Todas las variables del servidor (sin prefijo `VITE_`)

**Método de acceso:** `process.env`

```typescript
import { serverEnv, getAllowedOrigins } from './config.js';

// Variables disponibles:
serverEnv.jwtSecret      // JWT_SECRET
serverEnv.resendApiKey   // RESEND_API_KEY
serverEnv.senderEmail    // SENDER_EMAIL
serverEnv.senderName     // SENDER_NAME
serverEnv.adminEmail     // ADMIN_EMAIL
serverEnv.appUrl         // APP_URL
serverEnv.vercelUrl      // VERCEL_URL
serverEnv.isDevelopment
serverEnv.isProduction
```

⚠️ **Importante:** NO importes `api/config.ts` en componentes React ni `src/config/env.ts` en serverless functions.

## Variables Requeridas

### Configuración en Vercel

Ve a tu proyecto en Vercel → Settings → Environment Variables y configura:

#### 🔒 Seguridad

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `JWT_SECRET` | Clave secreta para JWT | `abc123...` (64+ caracteres) |

#### 📧 Email (Resend)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `RESEND_API_KEY` | API key de Resend | `re_xxxxxxxxxxxxx` |
| `SENDER_EMAIL` | Email verificado en Resend | `noreply@tudominio.com` |
| `SENDER_NAME` | Nombre del remitente | `Formulario de Requerimientos` |
| `ADMIN_EMAIL` | Email del administrador | `admin@tuempresa.com` |

#### 🌐 Aplicación

| Variable | Descripción | Ejemplo | Requerido |
|----------|-------------|---------|-----------|
| `APP_URL` | URL personalizada de tu app | `https://tudominio.com` | Opcional* |
| `VITE_APP_URL` | URL pública (frontend) | `https://tudominio.com` | Sí |
| `VITE_APP_NAME` | Nombre de la app | `Mi Formulario` | No |
| `VITE_APP_VERSION` | Versión | `1.0.0` | No |
| `VITE_API_ENDPOINT` | Endpoint API | `/api/send-email` | No |

\* Si no configuras `APP_URL`, se usará automáticamente `VERCEL_URL`

## Variables Automáticas de Vercel

Vercel proporciona automáticamente:

- `VERCEL_URL`: URL de deployment (ej: `mi-proyecto-abc123.vercel.app`)
- `NODE_ENV`: `development` o `production`

## Configuración por Entorno

### Development (Local)

Crea un archivo `.env.local`:

```env
# Seguridad
JWT_SECRET=dev-secret-key

# Email
RESEND_API_KEY=re_xxxxxxxxxxxxx
SENDER_EMAIL=onboarding@resend.dev
ADMIN_EMAIL=tu@email.com

# Frontend
VITE_APP_URL=http://localhost:3000
```

Luego ejecuta:

```bash
vercel dev
```

### Production (Vercel)

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega todas las variables necesarias
4. Selecciona el entorno: `Production`, `Preview`, o `Development`
5. Guarda y redeploya

## Migración desde Versión Anterior

### ❌ Variables Deprecadas

| Antigua | Nueva | Notas |
|---------|-------|-------|
| `PRODUCTION_URL` | `APP_URL` | Eliminada. Usa `APP_URL` (sin `VITE_`) |

### ✅ Cómo Migrar

Si tenías configurado `PRODUCTION_URL`:

1. Renómbrala a `APP_URL` en Vercel
2. Asegúrate de que coincida con `VITE_APP_URL`
3. Redeploya la aplicación

## Validación de Variables

### En el Backend

La configuración valida automáticamente las variables críticas:

```typescript
import { validateServerEnv } from './api/config.js';

const validation = validateServerEnv();
if (!validation.valid) {
  console.error('Errores de configuración:', validation.errors);
}
```

### En el Frontend

```typescript
import { validateEnv } from './src/config/env.ts';

validateEnv(); // Muestra warnings en desarrollo
```

## Solución de Problemas

### Error: "Acceso denegado: origen no autorizado"

**Causa:** El dominio desde el que llamas no está en la lista de orígenes permitidos.

**Solución:**
1. Verifica que `APP_URL` o `VITE_APP_URL` estén configurados correctamente
2. En producción, Vercel usa automáticamente `VERCEL_URL`
3. Revisa los logs de Vercel para ver el origen rechazado

### Error: "RESEND_API_KEY no está configurada"

**Causa:** Falta la variable de entorno.

**Solución:**
1. Ve a Vercel → Settings → Environment Variables
2. Agrega `RESEND_API_KEY` con tu API key de Resend
3. Redeploya

### Error: "JWT_SECRET debe ser configurado en producción"

**Causa:** Estás usando el valor por defecto en producción.

**Solución:**
1. Genera una clave segura:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
2. Configúrala como `JWT_SECRET` en Vercel
3. Redeploya

## Seguridad

### ⚠️ Importante

- **NUNCA** commits archivos `.env` o `.env.local` con valores reales
- Las variables `VITE_*` son **públicas** (visibles en el navegador)
- No pongas secretos en variables `VITE_*`
- Variables sin `VITE_` son privadas (solo en serverless functions)

### ✅ Buenas Prácticas

- Usa `.env.example` para documentar las variables
- Rota `JWT_SECRET` periódicamente
- Usa claves de API diferentes para development y production
- Revisa los logs de Vercel regularmente

## Referencias

- [Documentación de Vercel](https://vercel.com/docs/environment-variables)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Resend API Keys](https://resend.com/api-keys)

---

**Última actualización:** Marzo 2025
