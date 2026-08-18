# CV web v2 — Claudio Martínez Meza (estructura editorial)

HTML + CSS + JS puro. Sin frameworks.

- `index.html` — cabecera con nombre y foto, franja de datos, barra lateral fija (contacto, software, idiomas, marcas) y columna con secciones numeradas 01–06 (perfil, experiencia en línea de tiempo, servicios, software, formación, contacto).
- `styles.css` — paleta Bistre / Goldfinch / Butter / Indian Red / Garnet; responsive; versión de impresión en 2 páginas (botón PDF).
- `script.js` — menú móvil, reveal, barras y puntos de nivel, enlace activo, copiar correo, PDF.

## Tipografía Integral CF
Integral CF es una fuente comercial (no está en Google Fonts). La web ya está preparada:
1. Copia los archivos a `assets/fonts/` con estos nombres:
   `IntegralCF-Bold.woff2` (o `.woff` / `.otf`) y opcionalmente `IntegralCF-Heavy.woff2` / `.otf`.
2. Listo: el CSS la toma automáticamente (también la usa si está instalada en el sistema).
Mientras no esté, usa **Anybody** (Google Fonts) en ancho extendido y peso 900, la alternativa libre más parecida.

Textos: `index.html`. Colores y tipografías: variables al inicio de `styles.css`.
