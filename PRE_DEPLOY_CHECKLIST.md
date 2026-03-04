# ✅ CHECKLIST PRE-DEPLOY

## 📋 Verificación Local

### Código
- [ ] `npm install` ejecutado sin errores
- [ ] No hay errores de TypeScript (`npm run build`)
- [ ] Todos los archivos están guardados
- [ ] `.gitignore` incluye `.env*`

### Configuración
- [ ] Archivo `.env.local` creado
- [ ] `RESEND_API_KEY` configurada y válida
- [ ] `SENDER_EMAIL` configurado
- [ ] `ADMIN_EMAIL` configurado
- [ ] Variables de entorno probadas localmente

### Testing Local
- [ ] `vercel dev` inicia sin errores
- [ ] Formulario se puede llenar completamente
- [ ] PDF se genera correctamente
- [ ] Emails se envían (revisar bandeja)
- [ ] Email de cliente recibido con PDF adjunto
- [ ] Email de admin recibido con PDF adjunto
- [ ] Rate limiting funciona (probar 6 envíos seguidos)

---

## 🌐 Verificación Resend

### Cuenta Resend
- [ ] Cuenta creada en https://resend.com
- [ ] Email verificado
- [ ] API Key generada y guardada
- [ ] Límites del plan revisados (100/día gratis)

### Para Producción (Opcional)
- [ ] Dominio agregado en Resend
- [ ] Registros DNS configurados
- [ ] Dominio verificado (check verde)
- [ ] `SENDER_EMAIL` actualizado con tu dominio

---

## 🚀 Preparación para Deploy

### Git
- [ ] Repositorio inicializado (`git init`)
- [ ] `.gitignore` configurado
- [ ] `.env` y `.env.local` en .gitignore
- [ ] Commit inicial hecho
- [ ] Repositorio en GitHub creado
- [ ] Código subido a GitHub (`git push`)

### Vercel
- [ ] Cuenta creada en https://vercel.com
- [ ] Repositorio de GitHub conectado
- [ ] Variables de entorno configuradas en Vercel:
  - [ ] `RESEND_API_KEY`
  - [ ] `SENDER_EMAIL`
  - [ ] `SENDER_NAME`
  - [ ] `ADMIN_EMAIL`
  - [ ] `VITE_APP_URL`
  - [ ] `VITE_APP_NAME`
  - [ ] `VITE_APP_VERSION`
  - [ ] `VITE_NODE_ENV`

### Build
- [ ] `npm run build` funciona localmente
- [ ] Carpeta `dist/` se genera correctamente
- [ ] `vercel.json` está en la raíz
- [ ] `tsconfig.api.json` configurado

---

## 🔍 Verificación Post-Deploy

### Deployment
- [ ] Deploy completado sin errores
- [ ] URL de producción generada
- [ ] Formulario carga correctamente
- [ ] Estilos se ven bien
- [ ] No hay errores en consola del navegador

### Funcionalidad
- [ ] Formulario se puede llenar
- [ ] Validaciones funcionan
- [ ] PDF se genera
- [ ] Email al cliente llega
- [ ] Email al admin llega
- [ ] PDFs adjuntos correctos

### Seguridad
- [ ] Variables de entorno NO están expuestas en el código
- [ ] `RESEND_API_KEY` NO es visible en frontend
- [ ] Rate limiting funciona
- [ ] Emails de spam filtrados

### Logs
- [ ] Logs de Vercel revisados (sin errores)
- [ ] Logs de Resend revisados
- [ ] Emails enviados confirmados en Resend Dashboard

---

## 🎯 Checklist de Producción

### Configuración Final
- [ ] `SENDER_EMAIL` usa dominio verificado (no `onboarding@resend.dev`)
- [ ] `VITE_APP_URL` apunta a dominio de producción
- [ ] `VITE_NODE_ENV=production`
- [ ] Todas las variables configuradas en "Production" en Vercel

### Performance
- [ ] Lighthouse score > 90
- [ ] Tiempo de carga < 3s
- [ ] Serverless function responde < 5s
- [ ] PDFs generan rápido

### Monitoreo
- [ ] Dashboard de Vercel revisado
- [ ] Dashboard de Resend revisado
- [ ] Alertas configuradas (opcional)
- [ ] Analytics habilitado (opcional)

---

## 🆘 Troubleshooting

### Si algo falla:

1. **Revisa los logs**
   - Vercel Dashboard → Function Logs
   - Resend Dashboard → Logs

2. **Verifica variables**
   ```bash
   # Local
   cat .env.local
   
   # Vercel
   vercel env ls
   ```

3. **Prueba localmente**
   ```bash
   vercel dev
   ```

4. **Revisa documentación**
   - [DEPLOYMENT.md](./DEPLOYMENT.md)
   - [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)

---

## ✅ TODO LISTO

Si todos los checks están marcados:

🎉 **¡Tu aplicación está lista para producción!**

Siguiente: Monitorea los primeros envíos y ajusta según sea necesario.

---

_Última actualización: 2026-03-04_
