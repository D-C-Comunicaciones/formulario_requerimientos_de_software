# ⚡ INICIO RÁPIDO

## 🚀 Primeros Pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Crear archivo de configuración
cp .env.local.example .env.local

# 3. Editar .env.local y agregar tu RESEND_API_KEY

# 4. Iniciar desarrollo con serverless
npx vercel dev
```

Abre: http://localhost:3000

## 🔑 Obtener API Key de Resend

1. Regístrate en https://resend.com
2. Ve a API Keys
3. Crea una nueva clave
4. Cópiala a `.env.local`

## 📋 Checklist

- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivo `.env.local` creado
- [ ] `RESEND_API_KEY` configurada
- [ ] Servidor iniciado (`vercel dev`)
- [ ] Formulario probado localmente

## 🚢 Deploy en Vercel

Ver guía completa en [DEPLOYMENT.md](./DEPLOYMENT.md)

```bash
# Con CLI
vercel --prod

# O conecta GitHub con Vercel Dashboard
```

## 📚 Documentación

- [README.md](./README.md) - Documentación general
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guía de despliegue
- [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) - Detalles técnicos

---

¿Problemas? Revisa [DEPLOYMENT.md](./DEPLOYMENT.md)
