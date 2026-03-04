# Usar Resend en localhost

## El problema
`npm run dev` (Vite, puerto 5173) **no ejecuta funciones serverless**.  
El endpoint `/api/send-email` solo funciona con **`vercel dev`** (puerto 3000).

---

## Requisitos

```bash
npm install -g vercel   # una sola vez
vercel login            # una sola vez
```

---

## Pasos para desarrollo local

**1. Vincula el proyecto** (una sola vez):
```bash
vercel link
```

**2. Levanta el servidor:**
```bash
vercel dev
```
Abre → `http://localhost:3000`

---

## Variables de entorno (.env)

Las variables ya están en `.env`. Vercel las lee automáticamente con `vercel dev`.

| Variable | Valor actual |
|---|---|
| `RESEND_API_KEY` | `re_b2D5nGP3_...` |
| `SENDER_EMAIL` | `noreply@dccomunicacionessas.com` |
| `ADMIN_EMAIL` | `dcidemcomunicacionessas@gmail.com` |

> ⚠️ **`SENDER_EMAIL` debe estar verificado en Resend.**  
> Si no lo está, cambia a `onboarding@resend.dev` para pruebas.

---

## Verificar dominio en Resend

1. Entra a [resend.com/domains](https://resend.com/domains)
2. Agrega `dccomunicacionessas.com`
3. Agrega los registros DNS que te indiquen
4. Espera verificación (~5 min)

Mientras tanto, usa `onboarding@resend.dev` como `SENDER_EMAIL`:
```dotenv
SENDER_EMAIL=onboarding@resend.dev
```
> Con este remitente, el correo al cliente **solo llega si el destinatario es tu mismo email de cuenta Resend**.

---

## Resumen

| Comando | Puerto | API funciona |
|---|---|---|
| `npm run dev` | 5173 | ❌ |
| `vercel dev` | 3000 | ✅ |
