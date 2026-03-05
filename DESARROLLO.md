# Guía de Desarrollo Local

## Requisitos Previos

- Node.js 18+ instalado
- Vercel CLI instalado globalmente: `npm i -g vercel`
- Archivo `.env.local` configurado (ver `.env.example`)

## Configuración Inicial

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   ```bash
   # Copia el archivo de ejemplo
   copy .env.example .env.local
   
   # Edita .env.local y configura las variables requeridas:
   # - ACCESS_CODES: Códigos de acceso válidos (separados por comas)
   # - JWT_SECRET: Clave secreta para tokens (genera una nueva)
   # - RESEND_API_KEY: Tu API key de Resend
   # - SENDER_EMAIL: Email del remitente
   # - ADMIN_EMAIL: Email que recibirá los formularios
   ```

3. **Generar JWT_SECRET (opcional):**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

## Ejecutar en Desarrollo

### Opción 1: Ejecución completa (Recomendado)

Ejecuta dos terminales simultáneamente:

**Terminal 1 - Vercel Dev (Puerto 3000):**
```bash
vercel dev --listen 3000
```

**Terminal 2 - Vite (Puerto 5173):**  
```bash
npm run dev
```

Luego abre: `http://localhost:5173`

### Opción 2: Solo Frontend (sin validación de código)

```bash
npm run dev
```

⚠️ **Nota:** Sin `vercel dev`, las funciones serverless no funcionarán:
- La validación de código de acceso fallará
- El envío de emails fallará

## URLs de Desarrollo

- **Frontend (Vite):** http://localhost:5173
- **API Serverless:** http://localhost:3000/api/*
- **Vite Proxy:** `/api/*` → `http://localhost:3000/api/*`

## Códigos de Acceso

Los códigos configurados en `.env.local`:
```
ACCESS_CODES=DEMO2026,CLIENTE01,PROYECTO_ESPECIAL
```

Usa cualquiera de estos códigos en la pantalla de acceso.

## Estructura del Sistema de Seguridad

1. **Usuario ingresa código** → Frontend envía a `/api/validate-access`
2. **Backend valida código** → Compara con `ACCESS_CODES`
3. **Backend genera token JWT** → Firmado con `JWT_SECRET`
4. **Token se guarda** → `sessionStorage` (válido 24h)
5. **Al enviar formulario** → Token se valida en `/api/send-email`

## Problemas Comunes

### Error 500 en `/api/validate-access`

**Causa:** `vercel dev` no está corriendo.

**Solución:**
```bash
vercel dev --listen 3000
```

### "Error de configuración del servidor"

**Causa:** Variables de entorno no configuradas.

**Solución:** Verifica que `.env.local` tenga:
- `ACCESS_CODES`
- `JWT_SECRET`

### Código válido pero rechazado

**Causa:** Mayúsculas/minúsculas o espacios.

**Solución:** Los códigos son case-insensitive, pero verifica espacios extras.

## Deployment en Vercel

1. **Configurar variables de entorno en Vercel Dashboard:**
   - Settings → Environment Variables
   - Agrega todas las variables de `.env.local`
   - Configura para: Production, Preview, Development

2. **Deploy:**
   ```bash
   vercel --prod
   ```

## Variables de Entorno Requeridas

### Backend (Serverless)
- `ACCESS_CODES`: Códigos válidos (ej: "CODE1,CODE2,CODE3")
- `JWT_SECRET`: Clave secreta para JWT
- `RESEND_API_KEY`: API key de Resend
- `SENDER_EMAIL`: Email remitente
- `SENDER_NAME`: Nombre del remitente
- `ADMIN_EMAIL`: Email del administrador

### Frontend (Vite)
- `VITE_APP_URL`: URL de la aplicación
- `VITE_APP_NAME`: Nombre de la app
- `VITE_APP_VERSION`: Versión

## Seguridad

✅ Los códigos de acceso **nunca** se exponen en el frontend  
✅ Los tokens JWT están **firmados** y son imposibles de falsificar  
✅ Los tokens **expiran** después de 24 horas  
✅ Las validaciones ocurren en el **backend**  
✅ No hay **login** ni base de datos necesaria  

## Contacto

Para soporte técnico, contacta al desarrollador.
