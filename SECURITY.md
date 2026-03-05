# Sistema de Control de Acceso

Este formulario cuenta con un sistema de seguridad mediante código de acceso.

## Configuración

### 1. Variables de Entorno Requeridas

Agrega las siguientes variables en tu archivo `.env.local` (desarrollo) y en Vercel (producción):

```bash
# Códigos de acceso válidos (separados por comas)
ACCESS_CODES=DEMO2026,CLIENTE01,PROYECTO_ESPECIAL

# Clave secreta para firmar tokens JWT (genera una aleatoria y segura)
JWT_SECRET=tu-clave-secreta-muy-larga-y-aleatoria-aqui
```

### 2. Generar una Clave Secreta Segura

Puedes generar una clave secreta aleatoria con:

**Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**OpenSSL:**
```bash
openssl rand -hex 64
```

**Online (no recomendado para producción):**
https://randomkeygen.com/

### 3. Configurar en Vercel

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega:
   - `ACCESS_CODES` = tus códigos separados por comas
   - `JWT_SECRET` = tu clave secreta generada

## Funcionamiento

1. **Usuario ingresa código**: En la pantalla inicial, se solicita un código de acceso
2. **Validación en backend**: El código se valida contra `ACCESS_CODES`
3. **Token JWT**: Si es válido, se genera un token JWT firmado válido por 24 horas
4. **Acceso al formulario**: El token se guarda en `sessionStorage`
5. **Verificación en envío**: Al enviar el formulario, se valida el token en el backend

## Seguridad

✅ **Códigos nunca en frontend**: Los códigos válidos solo existen en variables de entorno del servidor

✅ **Tokens firmados**: Los tokens JWT están firmados criptográficamente y no se pueden falsificar

✅ **Expiración**: Los tokens expiran en 24 horas

✅ **Sesión temporal**: El token se pierde al cerrar el navegador (sessionStorage)

✅ **Validación doble**: Se valida tanto al obtener acceso como al enviar el formulario

## Gestión de Códigos

### Agregar nuevos códigos:
```bash
ACCESS_CODES=CODIGO1,CODIGO2,NUEVO_CODIGO3
```

### Remover un código:
Simplemente elimínalo de la lista y redeploya.

### Códigos temporales:
Puedes crear códigos específicos para cada cliente o proyecto y removerlos después.

## Notas Importantes

- ⚠️ Los códigos NO distinguen entre mayúsculas y minúsculas
- ⚠️ El token se guarda en sessionStorage (se pierde al cerrar la pestaña)
- ⚠️ Cambia `JWT_SECRET` regularmente para mayor seguridad
- ⚠️ No compartas la clave `JWT_SECRET` en el código fuente

## Troubleshooting

**Error: "Sistema no configurado"**
- Verifica que `ACCESS_CODES` tenga al menos un código

**Error: "Token de acceso inválido"**
- El token expiró (24 horas)
- Recarga la página e ingresa el código nuevamente

**Error: "Código de acceso inválido"**
- Verifica que el código esté en la lista `ACCESS_CODES`
- Los códigos son case-insensitive
