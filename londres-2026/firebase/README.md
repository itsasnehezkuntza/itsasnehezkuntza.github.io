# La Patrulla Polar — activar Firebase (preparado, aún SIN conectar)

La web sigue alojada en GitHub Pages, y la carpeta de tickets continúa en Google Drive privado. Firebase solo se usa para estados y listas, nunca para enviar PDFs, localizadores ni fotos de documentos.

## Estado actual

- `firebase-config.js`: `null` (sin proyecto enlazado). La interfaz muestra **Pendiente de activar** y no intenta autenticar ni sincronizar.
- `firebase-bridge-v18.js`: detecta cambios locales y permite aplicar datos de la nube sin crear bucles. Los datos locales se siguen guardando como antes.
- `firebase-sync-v18.js`: inicio de sesión con Google, comprobación de membresía, actualizaciones puntuales y escucha de cambios.
- `firebase/firestore.rules`: **denegación por defecto** salvo usuarios autorizados. No publicar reglas `allow read, write: if true`.

## Activación (requiere propietario del proyecto)

1. Conectar Firebase en ChatGPT o abrir [Firebase Console](https://console.firebase.google.com/). Crear un proyecto con el plan gratuito **Spark** si es suficiente. No es necesario habilitar facturación ni Analytics para esta funcionalidad.
2. Registrar una **aplicación web** de Firebase. En **Authentication → Sign-in method**, activar **Google**. Añadir `itsasnehezkuntza.github.io` a **Authorized domains**.
3. Activar **Cloud Firestore** y publicar **exactamente** las reglas de `firebase/firestore.rules` en la pestaña **Rules** antes de usar la web. No activar una base de datos en "test mode" abierta a Internet.
4. Copiar la configuración pública de la aplicación web a `londres-2026/firebase-config.js` sustituyendo `null`:
   ```js
   window.POLAR_FIREBASE_CONFIG = {
     apiKey: "EL_API_KEY_PUBLICO_DE_LA_APP",
     authDomain: "PROYECTO.firebaseapp.com",
     projectId: "ID_DEL_PROYECTO",
     appId: "1:...:web:..."
   };
   window.POLAR_FIREBASE_TRIP_ID = "londres-2026";
   window.POLAR_FIREBASE_TRIP_CODE = "POLAR-LONDON-2026";
   ```
   **Nunca** pegar aquí una clave de cuenta de servicio, un token personal, un PDF o credenciales del proyecto.
5. Cada viajero abre la web e inicia sesión con Google. Si todavía no está autorizado, la web muestra su **UID de Firebase**. El propietario añade manualmente un documento **vacío** en Firestore:
   `trips / londres-2026 / members / UID_DEL_VIAJERO`
   Se deben crear únicamente tres documentos, uno por persona autorizada. No dar permisos al público para crear membresías. Se pueden añadir campos `role:"member"`, `addedAt` opcionales.
6. Recargar la web e introducir el código `POLAR-LONDON-2026`. El código **solo selecciona el viaje**: NO es una contraseña ni da permisos por sí mismo. Las reglas comprueban UID y membresía.
7. Un viajero elige **«Publicar mis cambios locales»** para copiar sus estados al espacio común. La operación puede reemplazar cambios recientes y requiere confirmación. Los otros viajeros ven el estado compartido mediante Firestore.
8. Comprobar en dos móviles: marcar un elemento de la checklist común en uno y verificar que aparece en el otro. Las casillas «Mi maleta» siguen siendo personales. Ningún PDF se sincroniza por Firebase.

## Estructura Firestore

```text
trips/londres-2026/members/UID_1       ← administrado en consola, escritura denegada en cliente
trips/londres-2026/members/UID_2
trips/londres-2026/members/UID_3
trips/londres-2026/shared/tasks         ← checklist común
trips/londres-2026/shared/packing       ← casillas y añadidos del grupo
trips/londres-2026/shared/bookings      ← solo estado y hora; nunca notas o localizadores
trips/londres-2026/personal/UID_1       ← casillas de maleta personal
trips/londres-2026/personal/UID_2
trips/londres-2026/personal/UID_3
```

**Seguridad:** la configuración de Firebase del navegador no es secreta; lo que protege los datos es Authentication + Firestore Rules. El código del viaje puede verse en el código público de GitHub. No habilitar acceso anónimo indiscriminado. Restringir también los permisos de cada archivo en Drive. Revisar `London Tripp`, el documento de planificación, porque anteriormente tenía permiso público de edición por enlace.

## Límites y decisiones técnicas

- Cada cambio de casilla se escribe como un campo individual para reducir conflictos entre los tres móviles.
- Los cambios de listas personalizadas se almacenan como arreglos y pueden necesitar resolución manual si varias personas editan el mismo arreglo simultáneamente.
- El modo local funciona aunque no haya conexión o el Firebase no esté aún activado.
- Los PDFs siguen en IndexedDB (dispositivo) o en Drive (compartido mediante las cuentas de Google). **No** se suben a Firestore ni a GitHub.
- El estado de entrada sincronizado no incluye `note` ni referencias confidenciales.
- Es recomendable probar las reglas con **Firebase Emulator Suite** antes de activar producción.
- La versión CDN del SDK JavaScript es la 13.4.0; verificar que el proyecto y los navegadores la soportan.

## Más destinos

Para un futuro `patrulla-polar-paris`, crear un nuevo `TRIP_ID` y un nuevo código, y dar acceso explícito a sus miembros. No compartir automáticamente las listas de un viaje con otro.
