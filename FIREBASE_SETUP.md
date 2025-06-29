# Configuración de Firebase para Verificación de Email y Restablecimiento de Contraseña

## Configuración en Firebase Console

### 1. Verificación de Email

1. Ve a **Firebase Console** > **Authentication** > **Templates**
2. Selecciona **Email verification**
3. Configura el template con los siguientes valores:

**Nombre del remitente:** iUnlock-Cloud
**De:** iUnlock-Cloud <noreply@iunlock-cloud.org>
**Responder a:** support@iunlock-cloud.org
**Asunto:** Verify your email for %APP_NAME%

**Mensaje:**
```html
<p>Hello %DISPLAY_NAME%,</p>
<p>Follow this link to verify your email address.</p>
<p><a href='%LINK%'>%LINK%</a></p>
<p>If you didn't ask to verify this address, you can ignore this email.</p>
<p>Thanks,</p>
<p>Your %APP_NAME% team</p>
```

**URL de acción (valor %LINK%):**
```
https://iunlock-cloud.org/verify-email
```

### 2. Restablecimiento de Contraseña

1. Ve a **Firebase Console** > **Authentication** > **Templates**
2. Selecciona **Password reset**
3. Configura el template con los siguientes valores:

**Nombre del remitente:** iUnlock-Cloud
**De:** iUnlock-Cloud <noreply@iunlock-cloud.org>
**Responder a:** support@iunlock-cloud.org
**Asunto:** Reset your password for %APP_NAME%

**Mensaje:**
```html
<p>Hello %DISPLAY_NAME%,</p>
<p>Follow this link to reset your password.</p>
<p><a href='%LINK%'>%LINK%</a></p>
<p>If you didn't ask to reset your password, you can ignore this email.</p>
<p>Thanks,</p>
<p>Your %APP_NAME% team</p>
```

**URL de acción (valor %LINK%):**
```
https://iunlock-cloud.org/reset-password
```

## Configuración Adicional en Firebase Console

### 3. Configuración de Dominios Autorizados

1. Ve a **Firebase Console** > **Authentication** > **Settings** > **Authorized domains**
2. Agrega tu dominio: `iunlock-cloud.org`
3. Si estás en desarrollo, también agrega: `localhost`

### 4. Configuración de Acciones de Email

1. Ve a **Firebase Console** > **Authentication** > **Settings** > **Action URL**
2. Configura las siguientes URLs:

**Para verificación de email:**
```
https://iunlock-cloud.org/verify-email
```

**Para restablecimiento de contraseña:**
```
https://iunlock-cloud.org/reset-password
```

## Rutas Implementadas

### Verificación de Email
- **Ruta:** `/verify-email`
- **Archivo:** `src/pages/EmailVerification.tsx`
- **Funcionalidad:** Maneja la verificación de email usando el código `oobCode` de Firebase
- **Parámetros soportados:** `oobCode`, `oobcode`, `code`, `actionCode`, `action_code`

### Solicitud de Restablecimiento de Contraseña
- **Ruta:** `/forgot-password`
- **Archivo:** `src/pages/ForgotPassword.tsx`
- **Funcionalidad:** Permite solicitar un email de restablecimiento de contraseña

### Confirmación de Restablecimiento de Contraseña
- **Ruta:** `/reset-password`
- **Archivo:** `src/pages/ResetPassword.tsx`
- **Funcionalidad:** Permite establecer una nueva contraseña usando el código `oobCode`
- **Parámetros soportados:** `oobCode`, `oobcode`, `code`, `actionCode`, `action_code`

## Funciones del AuthContext

### Nuevas funciones agregadas:
- `sendPasswordReset(email)`: Envía email de restablecimiento
- `confirmPasswordReset(oobCode, newPassword)`: Confirma el restablecimiento
- `verifyEmail(oobCode)`: Verifica el email
- `checkActionCode(oobCode)`: Verifica el tipo de acción del código

## Características Implementadas

### Verificación de Email:
- ✅ Manejo automático de códigos de verificación
- ✅ Verificación del tipo de acción antes de procesar
- ✅ Mensajes de error específicos
- ✅ Redirección automática después de verificación exitosa
- ✅ Interfaz de usuario moderna y responsive
- ✅ Soporte para múltiples nombres de parámetros
- ✅ Información de debug en desarrollo

### Restablecimiento de Contraseña:
- ✅ Solicitud de restablecimiento por email
- ✅ Validación de códigos de restablecimiento
- ✅ Formulario de nueva contraseña con confirmación
- ✅ Validación de contraseñas (mínimo 6 caracteres)
- ✅ Interfaz de usuario moderna y responsive
- ✅ Mensajes de error específicos
- ✅ Soporte para múltiples nombres de parámetros
- ✅ Información de debug en desarrollo

### Características Generales:
- ✅ Diseño consistente con el resto de la aplicación
- ✅ Mensajes de toast para feedback del usuario
- ✅ Estados de carga apropiados
- ✅ Manejo de errores robusto
- ✅ Navegación intuitiva
- ✅ Consejos y ayuda para el usuario
- ✅ Interfaz completamente en español

## Solución de Problemas

### Si el enlace de verificación no funciona:

1. **Verifica la configuración de Firebase:**
   - Asegúrate de que las URLs de acción estén configuradas correctamente
   - Verifica que tu dominio esté en la lista de dominios autorizados

2. **Revisa los parámetros de la URL:**
   - La aplicación ahora soporta múltiples nombres de parámetros
   - En desarrollo, revisa la consola para información de debug

3. **Verifica el template de email:**
   - Asegúrate de que el template use `%LINK%` como placeholder
   - Verifica que la URL de acción sea correcta

4. **Prueba en desarrollo:**
   - Usa `localhost` como dominio autorizado
   - Revisa la información de debug que se muestra en la interfaz

### Debug en Desarrollo:
- La aplicación muestra información de debug cuando `NODE_ENV === 'development'`
- Revisa la consola del navegador para logs detallados
- La interfaz muestra información sobre los parámetros recibidos

## Notas Importantes

1. **URLs de Acción:** Asegúrate de que las URLs de acción en Firebase Console coincidan exactamente con las rutas de tu aplicación.

2. **Dominio:** Reemplaza `iunlock-cloud.org` con tu dominio real en la configuración de Firebase.

3. **Templates:** Los templates de email se pueden personalizar según tus necesidades de marca.

4. **Seguridad:** Los códigos de acción (`oobCode`) expiran después de 1 hora por seguridad.

5. **Testing:** Prueba las funcionalidades en un entorno de desarrollo antes de desplegar a producción.

6. **Parámetros:** La aplicación ahora maneja múltiples variaciones del nombre del parámetro `oobCode`.

## Comandos para Testing

```bash
# Construir la aplicación
npm run build

# Ejecutar en desarrollo
npm run dev

# Verificar que no hay errores de TypeScript
npx tsc --noEmit
``` 