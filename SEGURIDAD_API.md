# 🔒 Seguridad de la API

## Resumen

Este documento describe las medidas de seguridad implementadas para proteger los endpoints de la API contra accesos no autorizados y llamadas externas.

## Protecciones Implementadas

### 1. 🛡️ Validación de Origen (CORS)

Ambos endpoints (`/api/validate-access` y `/api/send-email`) validan el origen de las peticiones para evitar llamadas desde clientes externos como Postman, curl, o aplicaciones de terceros.

#### Funcionamiento

```typescript
function isAllowedOrigin(req: VercelRequest): boolean {
  const origin = req.headers.origin || req.headers.referer;
  
  // Orígenes permitidos
  const allowedOrigins = [
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    process.env.PRODUCTION_URL,
  ].filter(Boolean);

  // Rechazar si no hay origen o no está en la lista
  if (!origin || !allowedOrigins.some(allowed => origin.startsWith(allowed))) {
    return false;
  }
  
  return true;
}
```

#### Respuesta cuando se rechaza

```json
{
  "success": false,
  "message": "Acceso denegado: origen no autorizado"
}
```

**Código de estado:** `403 Forbidden`

### 2. 🔑 Autenticación JWT

El endpoint `/api/send-email` requiere un token JWT válido en el header `Authorization`:

```
Authorization: Bearer <token>
```

El token se genera en `/api/validate-access` después de validar el código de acceso.

### 3. ⏱️ Rate Limiting

Límite de 5 peticiones por IP cada 10 minutos en `/api/send-email`.

### 4. 📊 Seguimiento de Usos

Cada código de acceso tiene un límite de 3 usos. El sistema ahora:

- Registra cada uso del código
- Devuelve los usos restantes en la respuesta de `/api/validate-access`
- Almacena los usos restantes en `sessionStorage` del cliente
- Muestra al usuario cuántos usos le quedan después de validar el código

#### Respuesta de validación exitosa

```json
{
  "success": true,
  "token": "eyJhb...",
  "expiresIn": 86400,
  "remainingUses": 2
}
```

## Variables de Entorno Requeridas

### Variables del Servidor (Serverless Functions)

Configura estas variables en el dashboard de Vercel para las serverless functions:

```env
# Seguridad
JWT_SECRET=tu-secreto-super-seguro-aqui

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx
SENDER_EMAIL=noreply@tudominio.com
SENDER_NAME=Formulario de Requerimientos de Software
ADMIN_EMAIL=admin@tuempresa.com

# Aplicación (opcional - Vercel proporciona VERCEL_URL automáticamente)
APP_URL=https://tu-dominio-personalizado.com
```

### Variables del Frontend (Variables VITE_*)

Estas variables son públicas y accesibles desde el navegador:

```env
# Configuración pública
VITE_APP_URL=https://tu-dominio-personalizado.com
VITE_APP_NAME=Formulario de Requerimientos de Software
VITE_APP_VERSION=1.0.0
VITE_API_ENDPOINT=/api/send-email
```

### Variables Automáticas de Vercel

Vercel proporciona automáticamente:

- `VERCEL_URL`: URL de tu deployment (ej: `tu-proyecto-xyz123.vercel.app`)
- `NODE_ENV`: Entorno de ejecución (`development`, `production`)

### Centralización de Configuración

Todas las variables se gestionan a través de:

- **Frontend:** [src/config/env.ts](src/config/env.ts) - Usa `import.meta.env` para variables `VITE_*`
- **Backend:** [api/config.ts](api/config.ts) - Usa `process.env` para variables del servidor

**Importante:** No uses `PRODUCTION_URL`. La aplicación usa `APP_URL` (que debería coincidir con `VITE_APP_URL`) y Vercel proporciona `VERCEL_URL` automáticamente.

## Desarrollo Local

En desarrollo (`NODE_ENV=development`), la validación de origen se desactiva automáticamente para permitir pruebas locales.

Para probar en local:

```bash
# Iniciar servidor de desarrollo Vercel
vercel dev

# La app estará disponible en http://localhost:3000
```

## Pruebas de Seguridad

### ✅ Casos que DEBEN funcionar

1. **Acceso desde tu aplicación web desplegada**
   ```javascript
   // Desde tu frontend en https://tu-app.vercel.app
   fetch('/api/validate-access', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ code: 'TU_CODIGO' })
   })
   ```

2. **Desarrollo local con `vercel dev`**
   ```bash
   # En http://localhost:3000
   # La validación se desactiva automáticamente
   ```

### ❌ Casos que DEBEN fallar

1. **Llamada desde Postman sin origen**
   ```
   POST https://tu-app.vercel.app/api/validate-access
   Body: { "code": "ABC123" }
   
   Respuesta: 403 Forbidden
   ```

2. **Llamada desde otro dominio**
   ```javascript
   // Desde https://otro-dominio.com
   fetch('https://tu-app.vercel.app/api/send-email', ...)
   
   Respuesta: 403 Forbidden
   ```

3. **Llamada sin token JWT** (solo para `/api/send-email`)
   ```
   Respuesta: 401 Unauthorized
   ```

## Monitoreo

Los intentos de acceso bloqueados se registran en los logs de Vercel:

```
⚠️ Solicitud sin header origin/referer
🚫 Origen no permitido: https://dominio-externo.com
```

Puedes revisar estos logs en el dashboard de Vercel → tu proyecto → Logs.

## Seguridad Adicional Recomendada

1. **Rotación de códigos:** Cambia los códigos periódicamente en `api/access-codes.ts`
2. **Monitoreo de uso:** Revisa los logs regularmente para detectar intentos de acceso sospechosos
3. **HTTPS obligatorio:** Vercel proporciona esto por defecto
4. **Headers de seguridad:** Considera agregar headers adicionales en `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

## Contacto

Si detectas alguna vulnerabilidad de seguridad, por favor contacta inmediatamente al administrador del sistema.

---

**Última actualización:** Marzo 2025
