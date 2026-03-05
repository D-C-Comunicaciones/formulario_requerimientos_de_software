# ⚙️ Configuración de Variables en Vercel

## 🚨 IMPORTANTE: Configurar ANTES de hacer deploy

Para que la validación de origen funcione correctamente, necesitas configurar esta variable en Vercel:

## 📋 Variable Requerida

Ve a: **Vercel Dashboard** → Tu Proyecto → **Settings** → **Environment Variables**

### Variable: `APP_URL`

```
Name: APP_URL
Value: https://consultoria.dccomunicacionessas.com
Environments: ✅ Production  ✅ Preview  ✅ Development
```

**⚠️ MUY IMPORTANTE:**
- ✅ SIN barra final (/)
- ✅ CON https://
- ✅ Exactamente como aparece arriba

## ✅ Verificación

Después de configurar:

1. **Redeploya** el proyecto (o espera el auto-deploy del último push)
2. Ve a **Deployments** → Click en el deployment activo → **Function Logs**
3. Intenta acceder a tu sitio
4. Deberías ver en los logs:
   ```
   🔍 Validación de origen:
      Origen recibido: https://consultoria.dccomunicacionessas.com
      Orígenes permitidos: https://consultoria.dccomunicacionessas.com, https://formulario-requerimientos-de-softwa.vercel.app
   ✅ PERMITIDO: Origen autorizado
   ```

## ❌ Qué pasará con Postman

Una vez configurado, Postman recibirá:

```json
{
  "success": false,
  "message": "Acceso denegado: origen no autorizado"
}
```

Status: `403 Forbidden`

## 🔧 Otras Variables (Ya configuradas)

Verifica que también tengas:
- `JWT_SECRET` - Tu clave secreta para JWT
- `RESEND_API_KEY` - Tu API key de Resend
- `SENDER_EMAIL` - Email verificado en Resend
- `ADMIN_EMAIL` - Email del administrador

## 📝 Notas

- `VERCEL_URL` es automática, NO la configures manualmente
- La validación de origen ahora está **HABILITADA**
- Los logs en Vercel te mostrarán cualquier problema

---

**Última actualización:** Marzo 5, 2026
