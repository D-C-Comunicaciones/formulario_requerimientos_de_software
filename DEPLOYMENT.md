# 🚀 GUÍA DE DESPLIEGUE EN VERCEL

## Arquitectura Serverless

Este proyecto ha sido migrado completamente a una arquitectura serverless:

- ✅ **Frontend**: Vite + React
- ✅ **Backend**: Vercel Serverless Functions
- ✅ **Email**: Resend (sin SMTP manual)
- ✅ **React Email**: Templates profesionales
- ❌ **NO se requiere**: Express, Nodemailer, servidor Node.js

---

## 📋 Pre-requisitos

### 1. Cuenta en Resend

1. Crea una cuenta gratuita en [resend.com](https://resend.com)
2. Ve a **API Keys** y genera una nueva clave
3. Guarda tu clave (formato: `re_xxxxxxxxxxxxx`)

### 2. Verificar dominio (Opcional para producción)

Para producción, verifica tu dominio en Resend:

1. Ve a **Domains** en Resend
2. Agrega tu dominio (ej: `tudominio.com`)
3. Configura los registros DNS según las instrucciones
4. Espera la verificación (puede tomar hasta 48 horas)

**Para desarrollo/pruebas**: Puedes usar `onboarding@resend.dev` (no requiere verificación)

---

## 🔧 Configuración Local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Frontend (público)
VITE_APP_URL=http://localhost:5173
VITE_APP_NAME=Formulario de Requerimientos
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=development

# Backend Serverless (privado)
RESEND_API_KEY=re_TuApiKeyDeResend
SENDER_EMAIL=onboarding@resend.dev
SENDER_NAME=Formulario de Requerimientos
ADMIN_EMAIL=admin@tuempresa.com
```

### 3. Probar localmente

```bash
# Iniciar frontend
npm run dev

# Para probar serverless functions localmente, usa Vercel CLI:
npm install -g vercel
vercel dev
```

Abre: `http://localhost:3000` (Vercel Dev) o `http://localhost:5173` (Vite)

---

## ☁️ Despliegue en Vercel

### Método 1: Desde GitHub (Recomendado)

1. **Sube tu código a GitHub**

```bash
git init
git add .
git commit -m "Migración a serverless con Resend"
git branch -M main
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main
```

2. **Conecta con Vercel**

- Ve a [vercel.com](https://vercel.com)
- Click en **Add New Project**
- Importa tu repositorio de GitHub
- Vercel detectará automáticamente que es un proyecto Vite

3. **Configura Variables de Entorno**

En Vercel Dashboard → Settings → Environment Variables, agrega:

| Variable | Value | Environment |
|----------|-------|-------------|
| `RESEND_API_KEY` | `re_xxxxx` | Production, Preview, Development |
| `SENDER_EMAIL` | `noreply@tudominio.com` | Production, Preview, Development |
| `SENDER_NAME` | `Formulario de Requerimientos` | Production, Preview, Development |
| `ADMIN_EMAIL` | `admin@tuempresa.com` | Production, Preview, Development |
| `VITE_APP_URL` | `https://tu-proyecto.vercel.app` | Production |
| `VITE_APP_NAME` | `Formulario de Requerimientos` | Production, Preview, Development |
| `VITE_APP_VERSION` | `1.0.0` | Production, Preview, Development |
| `VITE_NODE_ENV` | `production` | Production |

4. **Deploy**

- Click en **Deploy**
- Espera 2-3 minutos
- ¡Listo! Tu app estará en `https://tu-proyecto.vercel.app`

### Método 2: Desde CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Sigue las instrucciones en pantalla
```

---

## 🔐 Configuración de Seguridad

### Rate Limiting

El endpoint `/api/send-email` tiene rate limiting básico:
- Máximo 5 envíos por IP cada 10 minutos
- Implementado en memoria (se resetea con cada deploy)

Para producción avanzada, considera:
- Upstash Redis para rate limiting persistente
- Vercel Edge Config
- Vercel Firewall

### Validaciones

La función serverless valida:
- ✅ Método HTTP (solo POST)
- ✅ Formato de email
- ✅ Tamaño del PDF (máx 10MB)
- ✅ Longitud de campos
- ✅ Tipos de datos

---

## 📧 Configuración de Resend

### Para Desarrollo

Usa el email de prueba de Resend:

```env
SENDER_EMAIL=onboarding@resend.dev
```

### Para Producción

1. Verifica tu dominio en Resend
2. Usa tu dominio verificado:

```env
SENDER_EMAIL=noreply@tudominio.com
```

### Límites de Resend (Plan Gratuito)

- 100 emails/día
- 3,000 emails/mes
- Solo dominios verificados en producción

[Ver planes de Resend](https://resend.com/pricing)

---

## 🧪 Testing

### Probar envío de emails en desarrollo

```bash
# Iniciar Vercel Dev (incluye serverless functions)
vercel dev

# En el navegador:
# 1. Llena el formulario
# 2. Envía
# 3. Verifica los logs en la terminal
# 4. Verifica el email en tu bandeja
```

### Debugging

Ver logs en Vercel Dashboard:
1. Ve a tu proyecto
2. Click en el deployment
3. Ve a **Function Logs**

---

## 📦 Estructura del Proyecto

```
├── api/
│   └── send-email.ts          # Serverless function
├── emails/
│   ├── ClientEmail.tsx        # Template email cliente
│   └── AdminEmail.tsx         # Template email admin
├── src/
│   ├── config/
│   │   └── env.ts             # Config variables entorno
│   ├── utils/
│   │   ├── emailService.ts    # Cliente API
│   │   └── pdfGenerator.ts    # Generador PDF
│   └── ...
├── .env                       # Ejemplo de variables
├── vercel.json                # Config Vercel
└── package.json
```

---

## ✅ Checklist Final

Antes de hacer deploy a producción:

- [ ] Variables de entorno configuradas en Vercel
- [ ] Dominio verificado en Resend (o usando onboarding@resend.dev)
- [ ] RESEND_API_KEY válida
- [ ] ADMIN_EMAIL correcto
- [ ] Código en GitHub
- [ ] Probado localmente con `vercel dev`
- [ ] Revisado los logs de función serverless

---

## 🆘 Troubleshooting

### Error: "RESEND_API_KEY no está configurada"

**Solución**: Agrega la variable en Vercel Dashboard → Settings → Environment Variables

### Error: "Failed to fetch"

**Causas posibles**:
1. Función serverless no está deployada
2. URL incorrecta en VITE_APP_URL
3. Problema de CORS

**Solución**: Verifica que `vercel.json` esté en la raíz

### Emails no llegan

**Causas posibles**:
1. SENDER_EMAIL no verificado
2. Límite de Resend alcanzado
3. Email en spam

**Solución**:
- Verifica dominio en Resend
- Revisa logs en Resend Dashboard
- Revisa carpeta de spam

### PDF vacío o corrupto

**Solución**: El HTML se convierte a base64, no es un PDF real. Para PDF verdadero, considera usar `jsPDF` o similar.

---

## 🔄 Redeploy después de cambios

Cada push a `main` redeploya automáticamente si conectaste con GitHub.

Para forzar redeploy:

```bash
vercel --prod
```

---

## 📚 Recursos

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Resend](https://resend.com/docs)
- [React Email](https://react.email)
- [Vite](https://vitejs.dev)

---

## ✨ Ventajas de esta Arquitectura

✅ **Sin servidor**: No necesitas mantener un servidor Express  
✅ **Escalable**: Vercel escala automáticamente  
✅ **Económico**: Plan gratuito generoso  
✅ **Rápido**: Edge functions en CDN global  
✅ **Simple**: Menos código, menos bugs  
✅ **Seguro**: API keys nunca se exponen al frontend  

---

## 🎉 ¡Listo!

Tu formulario ahora está completamente serverless y listo para producción.

**¿Preguntas?** Revisa la documentación o los logs de Vercel.
