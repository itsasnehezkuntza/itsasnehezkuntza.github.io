# Taupada Akademia — GitHub Pages

Este paquete convierte la intro y el panel del escape room de Wix en una web estática lista para GitHub Pages.

## Estructura

```text
.
├── index.html
├── assets/
│   ├── css/
│   │   ├── intro.css
│   │   └── panel.css
│   ├── js/
│   │   ├── intro.js
│   │   └── panel.js
│   └── img/
├── pages/
│   ├── panel.html
│   └── lehen-taupada.html
├── README.md
└── .nojekyll
```

## Flujo actual

```text
index.html
  ↓ ONARTU
pages/panel.html
  ↓ Lehen taupada hasi
pages/lehen-taupada.html
```

`pages/lehen-taupada.html` es todavía una página provisional para que el enlace no dé error. Ahí irá la primera misión real con candados, ficha PDF y prueba de progreso.

## Cómo verlo en local

Desde la carpeta del proyecto:

```bash
python3 -m http.server 8000
```

Después abre:

```text
http://localhost:8000
```

## Cómo subirlo a GitHub Pages

1. Crea un repositorio nuevo en GitHub, por ejemplo `taupada-akademia`.
2. Sube todos los archivos de esta carpeta al repositorio. La raíz del repositorio debe contener `index.html`, `assets/`, `pages/`, `README.md` y `.nojekyll`.
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

## Nota sobre rutas

En Wix se podían usar enlaces como `/lehen-taupada`. Para GitHub Pages, especialmente si publicas como repositorio de proyecto, conviene usar rutas relativas:

```html
href="./lehen-taupada.html"
href="./panel.html"
href="../index.html"
```

Esto evita que la web intente ir a la raíz absoluta de `github.io`.

## Nota sobre las imágenes

Ahora las imágenes siguen cargándose desde URLs de Wix (`static.wixstatic.com`). Funciona, pero más adelante conviene descargarlas y guardarlas en `assets/img/` para que el proyecto no dependa de Wix.

## Siguiente paso recomendado

Crear la página real de `pages/lehen-taupada.html` con:

- acceso a la ficha semanal en PDF;
- candado básico;
- candado intermedio;
- candado final;
- prueba para copiar en el pasaporte;
- desbloqueo narrativo de la segunda taupada.
