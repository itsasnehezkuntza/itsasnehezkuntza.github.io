# AGENTS.md — Taupada Akademia / Escape Room Matemático

## 1. Contexto general del proyecto

Este repositorio contiene una página web estática publicada con GitHub Pages para un proyecto educativo de refuerzo matemático en euskera.

El proyecto se llama provisionalmente **Taupada Akademia** y combina:

* refuerzo matemático para una alumna que termina DBH 3 / 3.º ESO y pasa a DBH 4 / 4.º ESO;
* una narrativa tipo escape room digital;
* una estética de academia de baile moderna, misteriosa y elegante;
* retos semanales conectados con fichas matemáticas en LaTeX.

La web no sustituye a las fichas matemáticas. Su función principal es aumentar la motivación, dar continuidad narrativa al verano y permitir que la alumna desbloquee mensajes, salas, pistas o fragmentos de una coreografía perdida mediante códigos obtenidos en las fichas.

## 2. Narrativa principal

La alumna recibe una invitación de **Taupada Akademia**, una academia de baile exigente y algo misteriosa.

Ha sido seleccionada para participar en una prueba especial de acceso. Sin embargo, una figura digital llamada **ITZALA_08** ha saboteado el sistema y ha fragmentado la coreografía final.

Durante 8 semanas, la alumna deberá recuperar los fragmentos perdidos superando misiones matemáticas. Cada semana representa una fase del entrenamiento: ritmo, precisión, energía, memoria, coordinación, escenario, audición y desbloqueo final.

La narrativa debe estar relacionada con:

* academia de baile;
* hip hop, comercial y contemporáneo;
* ensayos;
* coreografías;
* ritmo;
* escenarios;
* luces;
* precisión;
* energía;
* audición final;
* recuperación de una coreografía perdida;
* mensajes cifrados;
* accesos bloqueados;
* salas digitales;
* candados matemáticos.

La narrativa debe sentirse inmersiva, pero no infantil.

## 3. Tono y estilo

El tono debe ser:

* motivador;
* elegante;
* misterioso;
* cercano;
* claro;
* adecuado para una alumna de DBH 3/4;
* no infantil;
* no excesivamente dramático;
* con tensión narrativa moderada.

Evitar:

* lenguaje demasiado básico o de primaria;
* exceso de emojis;
* estética infantil;
* bromas constantes;
* textos demasiado largos;
* explicaciones matemáticas dentro de la web que sustituyan a la ficha.

La web debe sentirse como una interfaz de una academia secreta de baile, no como un juego infantil.

## 4. Idioma

El idioma principal de la interfaz debe ser **euskera claro y directo**.

Puede usarse castellano solo cuando sea útil para instrucciones internas o comentarios de código, pero los textos visibles para la alumna deben estar preferentemente en euskera.

Ejemplos de tono en euskera:

* “Sarbidea blokeatuta dago.”
* “Koreografiaren lehen zatia berreskuratu da.”
* “Kodea ez da zuzena. Begiratu berriro zure kalkuluak.”
* “Taupada egokia aurkitu duzu.”
* “Hurrengo aretoa desblokeatu da.”
* “Ez da zorte kontua: zehaztasuna behar duzu.”

## 5. Estética visual

La estética debe ser:

* moderna;
* limpia;
* cinematográfica;
* elegante;
* con sensación de interfaz digital;
* ligeramente misteriosa;
* relacionada con una academia de baile.

Paleta recomendada:

* azul marino profundo;
* violeta oscuro;
* crema suave;
* melocotón / peach como acento;
* blanco cálido para tarjetas o zonas de lectura;
* sombras suaves;
* brillos sutiles;
* efectos glitch muy moderados.

Evitar:

* colores chillones;
* fondos saturados;
* exceso de animaciones;
* contraste insuficiente;
* estilos infantiles;
* iconos caricaturescos.

La interfaz debe ser bonita, pero también legible.

## 6. Reglas técnicas generales

El proyecto debe funcionar bien en GitHub Pages.

Priorizar:

* HTML;
* CSS;
* JavaScript vanilla;
* estructura sencilla;
* archivos fáciles de modificar;
* código legible;
* componentes reutilizables;
* rutas relativas;
* buena organización de carpetas.

No usar frameworks pesados salvo que se pida explícitamente.

No romper la compatibilidad con GitHub Pages.

Evitar dependencias innecesarias.

Estructura sugerida:

```text
/
├── index.html
├── asteak/
│   ├── astea-01.html
│   ├── astea-02.html
│   └── ...
├── css/
│   └── style.css
├── js/
│   └── main.js
├── assets/
│   ├── images/
│   ├── icons/
│   └── audio/
└── AGENTS.md
```

## 7. Comportamiento de la web

La web debe tener una sensación de progresión.

Cada semana puede incluir:

* una pantalla de misión;
* una breve introducción narrativa;
* hasta 3 candados digitales;
* un panel de progreso;
* mensajes de acierto y error;
* una recompensa narrativa;
* un fragmento de la coreografía recuperado;
* una prueba de progreso que la alumna pueda copiar en su pasaporte.

Los candados deben estar conectados con resultados de la ficha matemática, no ser decorativos.

Cada candado debe poder tener:

* nombre;
* descripción narrativa;
* campo de código;
* botón de comprobación;
* pista 1;
* pista 2;
* mensaje de error;
* mensaje de éxito;
* desbloqueo visual o textual.

## 8. Reglas para los códigos y candados

Los códigos no deben depender de un único ejercicio fácil.

Deben construirse combinando varios resultados, por ejemplo:

* últimos dígitos de varios ejercicios;
* suma de resultados;
* ordenación de números;
* selección de letras según resultados;
* patrón numérico;
* combinación de signos;
* pequeña decisión lógica;
* mensaje cifrado breve.

Evitar códigos demasiado fáciles de adivinar.

Formato recomendado de códigos:

* `TAU-384`
* `RITMO-27`
* `ITZALA-594`
* `BEAT-418`
* `ATEA-36`
* `KOREO-1257`

El código debe validarse de forma tolerante con mayúsculas/minúsculas y espacios accidentales.

## 9. Relación con las fichas matemáticas

Las fichas semanales son el núcleo del aprendizaje.

La web solo debe usar resultados concretos de la ficha para desbloquear la narrativa.

Bloques matemáticos del verano:

1. signos, paréntesis y jerarquía;
2. divisibilidad, MKT/mcm y ZKH/mcd;
3. fracciones;
4. decimales y porcentajes;
5. potencias y raíces;
6. álgebra básica y ecuaciones;
7. proporcionalidad, regla de tres y unidades;
8. geometría básica y problemas globales.

Cada semana debe mantener repaso espiral de semanas anteriores.

La dificultad debe ser progresiva: empezar accesible y terminar con reto realista de DBH 4.

## 10. Personajes y elementos narrativos

### Taupada Akademia

Academia de baile moderna, exigente y misteriosa. No es una academia infantil. Tiene estética premium, luces de escenario, pasillos oscuros, mensajes digitales y pruebas de precisión.

### ITZALA_08

Figura digital misteriosa que ha saboteado el acceso a la coreografía final. No debe ser terrorífica. Debe sentirse como una presencia elegante, fría y desafiante.

Tono de ITZALA_08:

* directo;
* retador;
* algo críptico;
* no cruel;
* no infantil;
* no demasiado largo.

Ejemplos:

* “Ez duzu erritmoa galdu... baina oraindik ez da nahikoa.”
* “Kode zuzena aurkitu duzu. Hurrengo taupada aktibatu da.”
* “Akats txiki batek koreografia osoa desorekatu dezake.”
* “Zehaztasuna da ate hau irekitzeko giltza.”

### Alumna

La alumna debe sentirse protagonista. La web debe darle la sensación de estar entrando en la historia, no simplemente rellenando formularios.

No usar nombre real salvo que esté configurado explícitamente.

## 11. Accesibilidad y legibilidad

Priorizar siempre la legibilidad.

Reglas:

* textos visibles con buen contraste;
* tamaño de fuente cómodo;
* botones claros;
* estados hover/focus;
* navegación usable en móvil;
* no depender solo del color para indicar acierto/error;
* animaciones suaves;
* evitar flashes rápidos;
* diseño responsive.

La web debe funcionar bien en ordenador y móvil.

## 12. Estilo de código

Al modificar código:

* mantener nombres de clases claros;
* usar variables CSS para colores;
* comentar solo lo necesario;
* evitar duplicaciones;
* no reescribir archivos enteros si basta con modificar una parte;
* mantener la estructura existente;
* comprobar rutas relativas de imágenes;
* no eliminar contenido narrativo sin motivo;
* no romper funcionalidades ya creadas.

CSS recomendado:

```css
:root {
  --deep-navy: #0b1026;
  --night-violet: #24163f;
  --soft-peach: #e58b77;
  --warm-cream: #f6efe7;
  --muted-lilac: #9f8fc7;
  --panel-dark: rgba(16, 20, 45, 0.86);
  --panel-light: rgba(255, 255, 255, 0.92);
}
```

## 13. Animaciones

Las animaciones deben ser sutiles y elegantes.

Buenas opciones:

* aparición suave;
* escritura progresiva de mensajes;
* brillo leve en botones;
* glitch muy controlado en mensajes de ITZALA_08;
* transición de pantalla;
* desbloqueo con luz o pulso;
* aparición de fragmento de coreografía.

Evitar:

* animaciones muy rápidas;
* efectos mareantes;
* demasiados elementos moviéndose;
* sonidos obligatorios;
* interacciones confusas.

## 14. Imágenes y recursos

Las imágenes deben seguir la estética:

* semi-realista;
* cinematográfica;
* moderna;
* tonos azul marino, violeta, crema y peach;
* sin texto dentro de la imagen salvo que se pida expresamente;
* no infantil;
* no horror.

Tipos de imágenes útiles:

* pasillo oscuro de academia de baile;
* puerta de escenario bloqueada;
* sala de ensayo vacía;
* pantalla digital misteriosa;
* avatar de la alumna;
* avatar de ITZALA_08;
* icono de Taupada Akademia;
* fragmentos abstractos de coreografía;
* luces de escenario.

## 15. GitHub Pages

Usar rutas relativas para que funcione en GitHub Pages.

Evitar rutas absolutas como:

```html
<img src="/assets/images/fondo.png">
```

Preferir:

```html
<img src="./assets/images/fondo.png">
```

o, desde subcarpetas:

```html
<img src="../assets/images/fondo.png">
```

Antes de terminar una tarea, revisar:

* que los enlaces funcionan;
* que las imágenes cargan;
* que no hay errores de consola evidentes;
* que el diseño sigue siendo responsive;
* que el tono narrativo se mantiene.

## 16. Qué debe hacer Codex cuando reciba una tarea

Antes de modificar código:

1. Leer este `AGENTS.md`.
2. Revisar la estructura actual del proyecto.
3. Identificar qué archivo debe tocar.
4. Mantener la narrativa y estética existentes.
5. Proponer cambios mínimos y coherentes.
6. No cambiar nombres de archivos sin necesidad.
7. No eliminar contenido funcional.
8. Mantener compatibilidad con GitHub Pages.

Cuando cree una nueva página semanal:

1. Usar la misma estética general.
2. Incluir una introducción narrativa breve.
3. Incluir los candados necesarios.
4. Añadir mensajes de acierto/error.
5. Añadir una recompensa narrativa.
6. Dejar el código fácil de editar por la profesora.

## 17. Frases reutilizables en euskera

Mensajes de acceso:

* “Sarbidea egiaztatzen...”
* “Taupada seinalea bilatzen...”
* “Kodea aztertzen...”
* “Atea desblokeatzen...”

Acierto:

* “Zuzena. Hurrengo taupada aktibatu da.”
* “Koreografiaren zatia berreskuratu da.”
* “Erritmoa egokia da. Jarraitu.”
* “Sarbidea baimenduta.”

Error:

* “Kodea ez da zuzena.”
* “Begiratu berriro zure kalkuluak.”
* “Akats txiki batek atea itxita mantentzen du.”
* “Saiatu berriro, baina ez asmatu: arrazoitu.”

Pistas:

* “Pista 1: begiratu zein ariketetatik hartu behar diren emaitzak.”
* “Pista 2: ordena garrantzitsua da.”
* “Pista 3: ez hartu emaitza osoa; hartu eskatutako zifra.”
* “Pista 4: zeinuak ere informazioa dira.”

## 18. No hacer

No convertir la web en una simple lista de ejercicios.

No infantilizar el diseño.

No usar demasiados emojis.

No poner textos enormes en pantalla.

No añadir matemáticas nuevas que no estén conectadas con la ficha.

No hacer que los códigos sean adivinables.

No romper la navegación entre páginas.

No usar librerías externas innecesarias.

No depender de servidores externos para funciones básicas.

No cambiar la narrativa principal sin pedirlo.

## 19. Objetivo final del proyecto

El objetivo final es que la alumna sienta que durante el verano está avanzando en una misión real: recuperar una coreografía perdida y prepararse para una audición final.

La web debe reforzar esta sensación de progreso, pero siempre al servicio del aprendizaje matemático.

La prioridad es:

1. aprendizaje matemático sólido;
2. motivación sostenida;
3. narrativa coherente;
4. diseño elegante;
5. código sencillo y mantenible.
