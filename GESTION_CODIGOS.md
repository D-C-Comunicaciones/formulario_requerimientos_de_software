# Gestión de Códigos de Acceso

## 📍 Ubicación

Los códigos de acceso se gestionan en:
```
api/access-codes.ts
```

## 🔧 Agregar un Nuevo Código

Edita `api/access-codes.ts` y agrega un nuevo objeto en el array `ACCESS_CODES`:

```typescript
{
  code: 'MICODIGO2026',
  maxUses: 5,              // Número de veces que se puede usar
  description: 'Cliente ABC - Proyecto XYZ',
  expiresAt: new Date('2026-12-31'), // Opcional: fecha de expiración
  active: true,
}
```

## 🎯 Configuración de Códigos

### Parámetros

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `code` | string | ✅ | El código que el usuario ingresará |
| `maxUses` | number | ✅ | Número máximo de usos permitidos |
| `description` | string | ❌ | Descripción interna (solo para referencia) |
| `expiresAt` | Date | ❌ | Fecha de expiración del código |
| `active` | boolean | ✅ | Si el código está activo o no |

### Ejemplos

**Código de un solo uso:**
```typescript
{
  code: 'UNICO_USO_001',
  maxUses: 1,
  description: 'Cliente Premium - Uso único',
  active: true,
}
```

**Código temporal:**
```typescript
{
  code: 'MARZO_PROMO',
  maxUses: 20,
  description: 'Promoción de Marzo',
  expiresAt: new Date('2026-03-31'),
  active: true,
}
```

**Código ilimitado (temporalmente):**
```typescript
{
  code: 'DEMO_PERMANENTE',
  maxUses: 999999,
  description: 'Demo con muchos usos',
  active: true,
}
```

## 🚫 Desactivar un Código

### Opción 1: Marcar como inactivo
```typescript
{
  code: 'CODIGO_VIEJO',
  maxUses: 10,
  active: false,  // ← Cambia a false
}
```

### Opción 2: Eliminar del array
Simplemente elimina el objeto completo del array.

## 📊 Sistema de Auto-Destrucción

### ¿Cómo funciona?

1. **Contador en memoria:** Cada vez que se usa un código, se incrementa un contador
2. **Verificación automática:** Al alcanzar `maxUses`, el código se desactiva automáticamente
3. **Desactivación permanente:** El código queda marcado como desactivado en la sesión actual

### ⚠️ Importante: Limitación de Memoria

El contador de usos está EN MEMORIA, lo que significa:

✅ **Funciona bien para:**
- Desarrollo local
- Pruebas rápidas
- Códigos con pocos usos previstos

❌ **Limitaciones:**
- Se reinicia con cada deploy
- Se reinicia con cada cold start de la función serverless
- No es persistente entre reinicios del servidor

### 🔄 Para Persistencia Real

Si necesitas persistencia absoluta del contador de usos, implementa una de estas opciones:

#### Opción 1: Vercel KV (Recomendado)
```bash
# Instalar dependencia
npm install @vercel/kv

# Configurar en Vercel Dashboard
# Storage → Create KV Database
```

```typescript
// En access-codes.ts
import { kv } from '@vercel/kv';

async function recordCodeUsage(code: string) {
  const key = `code_usage:${code}`;
  await kv.incr(key);
}
```

#### Opción 2: Base de datos externa
- MongoDB
- PostgreSQL
- Redis
- Supabase

## 🔍 Monitoreo de Códigos

Los logs de Vercel muestran:

```
✅ Acceso concedido. Código: DEMO2026 - Usos: 2/3 (Quedan: 1)
🔒 Código DEMO2026 desactivado después de 3 usos
❌ Código inválido: DEM***
```

## 💡 Mejores Prácticas

### ✅ Recomendado

- Usa códigos descriptivos: `CLIENTE_ABC_2026`
- Limita los usos: No más de 10-20 por código
- Establece fechas de expiración para promociones
- Documenta el propósito en `description`
- Desactiva códigos antiguos en lugar de eliminarlos

### ❌ Evitar

- Códigos genéricos: `CODE1`, `TEST`
- Códigos fáciles de adivinar: `123456`
- Demasiados usos ilimitados
- Reutilizar códigos eliminados
- Dejar códigos vencidos como activos

## 🛠️ Comandos Útiles

### Resetear el contador de un código (solo desarrollo)
Esta función está disponible pero solo para debug:

```typescript
import { resetCodeUsage } from './access-codes';
resetCodeUsage('MICODIGO');
```

### Listar códigos activos (solo administración)
```typescript
import { listActiveCodes } from './access-codes';
const activeCodes = listActiveCodes();
console.log(activeCodes);
```

## 📝 Workflow Recomendado

1. **Cliente solicita acceso** → Le creas un código único
2. **Agregas el código** en `api/access-codes.ts`
3. **Deploy** con `git push` o `vercel --prod`
4. **Envías el código** al cliente
5. **Cliente usa el formulario** N veces según `maxUses`
6. **Código se auto-desactiva** después de los usos permitidos
7. (Opcional) **Marcas como `active: false`** en el código para limpieza

## 🔐 Seguridad

- Los códigos **nunca** se exponen en el frontend
- Solo existen en el servidor (`api/access-codes.ts`)
- El cliente solo obtiene un token JWT firmado
- Los tokens son imposibles de falsificar sin la clave `JWT_SECRET`

## 📞 Soporte

Para implementar persistencia con Vercel KV u otro sistema, consulta la documentación en `DESARROLLO.md`.
