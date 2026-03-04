# 📋 Formulario de Requerimientos de Software

Formulario interactivo multi-paso para recopilar requerimientos de software con generación automática de PDF y envío por email.

## ✨ Características

- ✅ **Formulario Multi-Paso**: 8 pasos con validación
- ✅ **Generación de PDF**: Documento profesional automático
- ✅ **Envío por Email**: Notificación automática con Resend
- ✅ **Serverless**: 100% sin servidor (Vercel Functions)
- ✅ **React Email**: Templates profesionales de email
- ✅ **Rate Limiting**: Protección anti-spam integrada
- ✅ **Totalmente Responsive**: Funciona en móvil, tablet y desktop

## 🚀 Stack Tecnológico

- **Frontend**: Vite + React 18 + TypeScript
- **Styling**: Tailwind CSS 4 + Radix UI
- **Email**: Resend + React Email
- **Backend**: Vercel Serverless Functions
- **Deployment**: Vercel
- **Validation**: React Hook Form

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# Edita .env.local con tus credenciales

# Iniciar desarrollo
npm run dev
```

## 🔧 Configuración

### 1. Obtener API Key de Resend

1. Crea una cuenta en [resend.com](https://resend.com)
2. Ve a **API Keys** y genera una nueva
3. Copia la clave (formato: `re_xxxxx`)

### 2. Configurar Variables de Entorno

Crea `.env.local` en la raíz:

```env
# Resend
RESEND_API_KEY=re_TuApiKey
SENDER_EMAIL=onboarding@resend.dev
SENDER_NAME=Formulario de Requerimientos
ADMIN_EMAIL=admin@tuempresa.com

# App
VITE_APP_URL=http://localhost:5173
VITE_APP_NAME=Formulario de Requerimientos
```

### 3. Iniciar Desarrollo

```bash
# Solo frontend
npm run dev

# Con serverless functions (recomendado)
npm install -g vercel
vercel dev
```

Abre [http://localhost:3000](http://localhost:3000) (Vercel) o [http://localhost:5173](http://localhost:5173) (Vite)

## 📤 Deployment en Vercel

Ver guía completa en [DEPLOYMENT.md](./DEPLOYMENT.md)

### Deploy Rápido

1. Sube a GitHub
2. Importa en [vercel.com](https://vercel.com)
3. Configura variables de entorno
4. Deploy automático

## 📂 Estructura del Proyecto

```
├── api/
│   └── send-email.ts          # Función serverless
├── emails/
│   ├── ClientEmail.tsx        # Template email cliente
│   └── AdminEmail.tsx         # Template email admin
├── src/
│   ├── app/
│   │   ├── App.tsx           # Componente principal
│   │   └── components/       # Componentes del formulario
│   ├── config/
│   │   └── env.ts            # Config variables entorno
│   ├── utils/
│   │   ├── emailService.ts   # Cliente API email
│   │   └── pdfGenerator.ts   # Generador PDF
│   └── styles/               # Estilos globales
├── vercel.json               # Config Vercel
├── DEPLOYMENT.md             # Guía de despliegue
└── package.json
```

## 📝 Scripts

```bash
npm run dev          # Iniciar Vite
npm run build        # Build para producción
npm run email:dev    # Previsualizar emails
vercel dev           # Desarrollo con serverless
vercel --prod        # Deploy a producción
```

## 🆘 Soporte

¿Problemas? Revisa:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guía detallada de despliegue
- [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) - Resumen técnico
- [Vercel Docs](https://vercel.com/docs)
- [Resend Docs](https://resend.com/docs)

---

**Arquitectura Serverless | Vite + React + Resend**
  