# 🎮 Toffy's Dev Quest -- Portafolio Interactivo

**Toffy's Dev Quest** es un portafolio estilo videojuego retro que
combina desarrollo web, creatividad visual y elementos de juegos
clásicos para presentar mis habilidades como **desarrollador
fullstack**, mi trayectoria como **artista circense** y mis proyectos
profesionales.

Construido con **HTML5 Canvas**, **JavaScript modular**, **i18n**,
**JSON dinámico** y una estética inspirada en consolas de los 80--90.

------------------------------------------------------------------------

## 🧭 Objetivo del proyecto

Crear un portafolio único que no solo muestre mis habilidades técnicas,
sino que además refleje mi identidad artística, entregando una
experiencia interactiva tipo videojuego y una navegación memorable.

------------------------------------------------------------------------

## 🚀 Tecnologías utilizadas

-   **JavaScript (ES Modules / sin frameworks)**
-   **HTML5 Canvas API**
-   **CSS personalizado estilo retro pixel-art**
-   **Dynamic Imports**
-   **JSON dinámico para proyectos y skills**
-   **Sistema i18n (ES / EN)**
-   **Mailto handler para formulario de contacto**
-   **Audio retro (FX de navegación y clicks)**

------------------------------------------------------------------------

## 🌍 Funcionalidades principales

-   🎮 Menú principal estilo videojuego\
-   🌐 Cambio de idioma (ES / EN)\
-   📁 Proyectos cargados desde `projects.{lang}.json`\
-   🧠 Skills con barra de nivel y panel lateral descriptivo\
-   🕹️ Navegación con teclas (Flechas, Enter, Escape)\
-   📬 Formulario de contacto integrado en la interfaz\
-   💾 Carga modular de pantallas (`menu.js`, `skills.js`, etc.)\
-   🔊 Sonidos al interactuar (click, back, move)

------------------------------------------------------------------------

## 📂 Estructura del proyecto

    toffycaluga-portfolio/
    │
    ├── index.html                # Punto de entrada
    ├── styles.css                # Estilos retro pixel-art
    │
    ├── /assets
    │   ├── /icons                # Logos de skills
    │   └── /audio                # Efectos de sonido
    │
    ├── /data
    │   ├── projects.es.json      # Proyectos ES
    │   ├── projects.en.json      # Proyectos EN
    │   ├── skills.es.json        # Skills ES
    │   └── skills.en.json        # Skills EN
    │
    ├── /i18n
    │   ├── lang.js               # Controlador de idioma
    │   ├── es.json               # Textos ES
    │   └── en.json               # Textos EN
    │
    ├── /screens
    │   ├── menu.js               # Pantalla principal
    │   ├── projects.js           # Pantalla de proyectos
    │   ├── skills.js             # Pantalla de habilidades
    │   ├── experience.js         # Pantalla de experiencia
    │   ├── contact.js            # Pantalla de contacto
    │   └── utils.js              # Utilidades de render (si aplica)
    │
    └── package.json              # Dependencias / scripts opcionales

------------------------------------------------------------------------

## 🧪 Cómo ejecutarlo en local

``` bash
git clone https://github.com/toffycaluga/toffycaluga-portfolio.git
cd toffycaluga-portfolio
npm install
npm run dev   # o abrir index.html directamente
```

------------------------------------------------------------------------


⌨️ con ❤️ por [Abraham Lillo](https://github.com/toffycaluga)