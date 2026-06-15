# Taupada Akademia — GitHub Pages

Este paquete convierte la primera página del escape room de Wix en una web estática lista para GitHub Pages.

## Estructura

```text
.
├── index.html
├── assets/
│   ├── css/
│   │   └── intro.css
│   ├── js/
│   │   └── intro.js
│   └── img/
├── pages/
│   └── panel.html
└── .nojekyll
```

## Cómo verlo en local

Abre `index.html` directamente en el navegador.

Si quieres probarlo con servidor local:

```bash
python3 -m http.server 8000
```

Después abre:

```text
http://localhost:8000
```

## Cómo subirlo a GitHub Pages

1. Crea un repositorio nuevo en GitHub, por ejemplo `taupada-akademia`.
2. Sube todos los archivos de esta carpeta al repositorio.
3. En GitHub, entra en:

```text
Settings → Pages → Build and deployment → Source: Deploy from a branch
```

4. Selecciona:

```text
Branch: main
Folder: /root
```

5. Guarda los cambios.

La web quedará en una dirección parecida a:

```text
https://TU_USUARIO.github.io/taupada-akademia/
```

## Nota sobre las imágenes

Ahora las imágenes siguen cargándose desde URLs de Wix (`static.wixstatic.com`). Funciona, pero más adelante conviene descargarlas y guardarlas en `assets/img/` para que el proyecto no dependa de Wix.

## Siguiente paso recomendado

Sustituir `pages/panel.html` por el panel real de misiones semanales.
