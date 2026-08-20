# CV web v3 — Claudio Martínez Meza (editorial negro / rojo / blanco)

HTML + CSS + JS puro, sin frameworks. Calcado a la referencia "WEB DESIGNER" (Mariana Design).

- `index.html` — topbar, hero con asterisco rojo + foto sobre panel rojo + sello giratorio "Disponible para freelance", franja negra de cifras, Trabajo seleccionado (3 mosaicos), Servicios (bloque rojo + rejilla 2x2), Sobre mí (texto · foto · barras de software + Descargar CV), Experiencia (línea por año + Formación/Idiomas/Datos), Confían en mí (logos), CTA roja de contacto, pie.
- `styles.css` — variables al inicio (`--red`, `--ink`, tipografías). Display: Anton (Google Fonts). Texto: Inter. Responsive (390 / 1440 verificados) + hoja de impresión A4 de 2 páginas.
- `script.js` — menú móvil, reveal al hacer scroll, contadores, barras y puntos de nivel, enlace activo, copiar correo. `?nofx` en la URL desactiva animaciones (capturas / PDF).
- `CV-Claudio-Martinez-Meza.pdf` — generado desde la hoja de impresión (Chrome/Playwright, A4, 2 páginas). Regenerar tras editar textos: abrir `index.html?nofx`, Ctrl+P, guardar como PDF con fondos.

Textos: `index.html`. Colores y tipografías: variables al inicio de `styles.css`.
