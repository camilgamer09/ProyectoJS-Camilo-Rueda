# FakeStore 🛒

Tienda en línea de ejemplo hecha con **HTML, CSS y JavaScript puro** (sin frameworks). Consume los productos de la API pública [FakeStore API](https://fakestoreapi.com/products) y permite explorarlos, filtrarlos y armar un carrito de compras que se conserva aunque se cierre el navegador.

## Características

- Catálogo de productos cargado desde una API REST con `fetch`.
- Sección de **productos destacados** (los 3 mejor calificados) en carrusel.
- **Búsqueda** por texto (título y descripción) en tiempo real.
- **Filtro por categoría** mediante botones tipo píldora.
- **Ordenamiento** por precio (asc/desc), nombre (A-Z) y calificación.
- **Carrito lateral**: agregar, aumentar/disminuir cantidad, eliminar, vaciar, subtotal y total.
- El carrito y el tema se guardan en `localStorage`.
- **Tema claro / oscuro**.
- Diseño **responsive** (escritorio, tablet y celular).
- Manejo de errores de red con botón "Reintentar".

## Estructura del proyecto

```
fakestore/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── docs/
│   ├── boceto-escritorio.svg
│   ├── boceto-movil.svg
│   └── analisis.md
└── README.md
```

## Instrucciones para ejecutar

No requiere instalación ni dependencias.

1. Clona o descarga el repositorio:
   ```bash
   git clone <URL-DEL-REPOSITORIO>
   cd fakestore
   ```
2. Abre `index.html` en tu navegador (doble clic), **o** usa un servidor local:
   - En VS Code: instala la extensión **Live Server** y pulsa *Go Live*.
   - Con Python: `python -m http.server 5500` y abre `http://localhost:5500`.
3. **Necesitas conexión a internet**, ya que los productos vienen de `fakestoreapi.com` y los íconos de Google Fonts (Material Symbols).

## Tecnologías

- HTML5 (etiquetas semánticas y `<template>`)
- CSS3 (variables CSS, Flexbox, Grid, media queries)
- JavaScript (ES6+, `fetch`/`async-await`, `localStorage`)

## Documentación

En la carpeta [`docs/`](docs/) se encuentran los bocetos de la interfaz y el archivo [`analisis.md`](docs/analisis.md) con las decisiones de diseño, la estructura de datos y la justificación de filtros y ordenamientos.
