# 🔧 Configuración de Variables de Entorno

## 📂 Estructura de Archivos

### 🌐 Frontend: `src/config/env.ts`

**Propósito:** Configuración del cliente (navegador)

**Variables:** Solo `VITE_*` (públicas)

**Acceso:** `import.meta.env`

```typescript
import { env, getApiUrl } from '@config/env';

// Variables disponibles:
env.appUrl          // VITE_APP_URL
env.appName         // VITE_APP_NAME
env.appVersion      // VITE_APP_VERSION
env.apiEndpoint     // VITE_API_ENDPOINT
env.isDevelopment   // Detecta automáticamente
env.isProduction    // Detecta automáticamente
```

**Uso en componentes:**
```typescript
import { env } from '@config/env';

console.log(env.appName); // "Formulario de Requerimientos"
```

---

### ⚡ Backend: `api/config.ts`

**Propósito:** Configuración de serverless functions (Node.js)

**Variables:** Todas (sin prefijo `VITE_`)

**Acceso:** `process.env`

```typescript
import { serverEnv, getAllowedOrigins } from './config.js';

// Variables disponibles:
serverEnv.jwtSecret      // JWT_SECRET
serverEnv.resendApiKey   // RESEND_API_KEY
serverEnv.senderEmail    // SENDER_EMAIL
serverEnv.senderName     // SENDER_NAME
serverEnv.adminEmail     // ADMIN_EMAIL
serverEnv.appUrl         // APP_URL (o VERCEL_URL)
serverEnv.vercelUrl      // VERCEL_URL (automático)
serverEnv.isDevelopment  // Detecta automáticamente
serverEnv.isProduction   // Detecta automáticamente
```

**Uso en API routes:**
```typescript
import { serverEnv } from './config.js';

const resend = new Resend(serverEnv.resendApiKey);
```

---

## 🔑 Variables de Entorno

### Variables del Frontend (Públicas - `VITE_*`)

```env
VITE_APP_URL=https://tudominio.com
VITE_APP_NAME=Formulario de Requerimientos de Software
VITE_APP_VERSION=1.0.0
VITE_API_ENDPOINT=/api/send-email
```

⚠️ **Advertencia:** Estas variables son públicas y visibles en el navegador.

### Variables del Backend (Privadas)

```env
# Seguridad
JWT_SECRET=tu-secreto-super-seguro

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx
SENDER_EMAIL=noreply@tudominio.com
SENDER_NAME=Formulario de Requerimientos
ADMIN_EMAIL=admin@tuempresa.com

# Aplicación
APP_URL=https://tudominio.com
```

🔒 **Seguras:** Solo accesibles desde serverless functions.

---

## ✅ Reglas de Uso

| Contexto | Archivo | Variables | Acceso |
|----------|---------|-----------|--------|
| Componentes React | `src/config/env.ts` | `VITE_*` | `import.meta.env` |
| Serverless Functions | `api/config.ts` | Todas (sin `VITE_`) | `process.env` |

---

## 🚫 Errores Comunes

### ❌ No hacer esto:

```typescript
// ❌ En componentes React
import { serverEnv } from '../../api/config'; // NO FUNCIONA

// ❌ En serverless functions
import { env } from '../src/config/env'; // NO FUNCIONA

// ❌ Usar process.env en frontend
const apiKey = process.env.RESEND_API_KEY; // undefined
```

### ✅ Hacer esto:

```typescript
// ✅ En componentes React
import { env } from '@config/env';

// ✅ En serverless functions
import { serverEnv } from './config.js';

// ✅ Variables públicas en frontend
const appUrl = import.meta.env.VITE_APP_URL;
```

---

## 📝 Ejemplos Prácticos

### Frontend (emailService.ts)

```typescript
import { env, getApiUrl } from '@config/env';

const endpoint = getApiUrl(env.apiEndpoint);
// → En dev: "/api/send-email"
// → En prod: "https://tudominio.com/api/send-email"
```

### Backend (send-email.ts)

```typescript
import { serverEnv } from './config.js';

const resend = new Resend(serverEnv.resendApiKey);
await resend.emails.send({
  from: `${serverEnv.senderName} <${serverEnv.senderEmail}>`,
  to: email,
  subject: 'Test'
});
```

### Backend (validate-access.ts)

```typescript
import { serverEnv, getAllowedOrigins } from './config.js';

const token = generateToken(serverEnv.jwtSecret);
const origins = getAllowedOrigins();
// → ["https://tu-proyecto.vercel.app", "https://tudominio.com"]
```

---

## 🔄 Migración

Si estabas usando variables incorrectamente:

1. **Frontend:** Cambia `process.env.X` → `import.meta.env.VITE_X`
2. **Backend:** Ya está configurado correctamente
3. **Imports:** Usa el archivo correcto según el contexto

---

**Última actualización:** Marzo 2025
