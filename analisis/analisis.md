# Análisis del proyecto FakeStore

## 1. Bocetos

- [Boceto de escritorio](boceto-escritorio.jpg)

Los bocetos son wireframes: muestran la ubicación de cada elemento (cajas con una X para las imágenes y líneas para el texto) sin contenido real de productos.

## 2. Decisiones de diseño de la interfaz y experiencia de usuario

**Estructura de la página.** De arriba hacia abajo: encabezado, categorías, bienvenida, destacados y catálogo completo. El usuario ve primero lo que necesita para orientarse (buscar o elegir categoría) y después el contenido.

**Encabezado simple.** Logo, buscador y dos íconos (tema y carrito). El buscador ocupa el espacio central porque es la acción más frecuente. El carrito muestra un contador con el total de unidades para que el usuario sepa cuántos productos lleva sin abrir el panel.

**Productos destacados.** Se muestran los 3 mejor calificados con una etiqueta "Destacado". Esto ayuda a quien no sabe qué buscar y aprovecha la calificación como señal de confianza.

**Tarjetas de producto.** Todas tienen la misma estructura: imagen, calificación en estrellas, título, descripción, precio, categoría y botón. La repetición permite comparar productos rápidamente. Título y descripción se limitan a 2 líneas para que todas las tarjetas tengan la misma altura. El botón queda siempre al final de la tarjeta.

**Carrito como panel lateral.** El carrito se abre sobre la página sin cambiar de pantalla, así el usuario no pierde su lugar en el catálogo. El total y los botones "Vaciar carrito" y "Cerrar carrito" quedan fijos abajo, y solo la lista de productos hace scroll. Se puede cerrar con el botón o con la tecla `Esc`. Vaciar el carrito pide confirmación para evitar borrarlo por error.

**Tema claro y oscuro.** Los colores se definen con variables CSS, por lo que el cambio de tema solo modifica un atributo (`data-tema`) en `<html>`. La preferencia se guarda y se restaura al volver.

**Diseño responsive.**
- Escritorio: 3 columnas.
- Tablet (≤ 800 px): 2 columnas y el carrusel muestra flechas de navegación.
- Celular (≤ 560 px): 1 columna, la búsqueda pasa a una segunda fila y las categorías se desplazan horizontalmente.

**Retroalimentación al usuario.** La página muestra "Cargando productos...", un mensaje de error con botón "Reintentar" si falla la API, el número de resultados y un mensaje cuando ningún producto coincide con los filtros.

**Accesibilidad básica.** Uso de etiquetas semánticas (`header`, `nav`, `main`, `aside`, `article`, `figure`), `aria-label` en botones de solo ícono, `alt` en imágenes y un contorno visible en el foco del teclado.

## 3. Estructura de datos

### Productos

Los productos se obtienen de la API como un **arreglo de objetos** y se guardan en la variable `productos`:

```js
{
  id: 1,
  title: "Mens Cotton Jacket",
  price: 55.99,
  description: "great outerwear jackets for...",
  category: "men's clothing",
  image: "https://fakestoreapi.com/img/....jpg",
  rating: { rate: 4.7, count: 500 }
}
```

La lista visible **no se modifica**: en cada búsqueda, filtro u ordenamiento se genera una copia filtrada con `filter()` y se ordena con `sort()`. Así el arreglo original siempre queda completo.

### Categorías

Se calculan a partir de los productos con un `Set`, que elimina duplicados, y se les agrega la opción `"todas"`:

```js
["todas", ...new Set(productos.map((p) => p.category))]
```

La variable `categoria` guarda la categoría activa. Los nombres en español se traducen con un objeto diccionario (`nombreCategoria`).

### Carrito

El carrito es un **objeto cuyas claves son los `id` de los productos**:

```js
carrito = {
  1: { producto: { ...objeto del producto... }, cantidad: 2 },
  5: { producto: { ...objeto del producto... }, cantidad: 1 }
}
```

¿Por qué un objeto y no un arreglo?
- **Acceso directo por id:** `carrito[id]` permite saber si un producto ya está en el carrito sin recorrer una lista.
- **Sin duplicados:** si el producto ya existe, solo se aumenta `cantidad`.
- **Eliminar es simple:** `delete carrito[id]`.

El total y el contador se calculan al mostrar el carrito, recorriendo `Object.values(carrito)` y sumando `precio × cantidad`. No se guardan, para que nunca queden desactualizados.

### Persistencia

| Clave en `localStorage` | Contenido |
|---|---|
| `carrito` | El objeto del carrito convertido a texto con `JSON.stringify` |
| `tema` | `"claro"` u `"oscuro"` |

Al cargar la página, `cargarCarrito()` lee y convierte el JSON. Si el dato no existe o está dañado, devuelve un objeto vacío gracias a `try/catch`.

## 4. Justificación de filtros y ordenamientos

### Búsqueda por texto
- Es la forma más rápida de encontrar algo cuando el usuario ya sabe qué quiere.
- Busca en título **y** descripción, así que encuentra resultados aunque el usuario no use el nombre exacto.
- No distingue mayúsculas de minúsculas.
- Se actualiza mientras se escribe (evento `input`), sin botón de "buscar", lo que reduce pasos.

### Filtro por categoría
- Sirve para quien no tiene una búsqueda concreta y prefiere explorar.
- Se usan botones visibles en lugar de una lista desplegable: así se ven todas las opciones a la vez (solo hay 4) y se elige con un clic.
- La categoría activa se resalta, de modo que el usuario siempre sabe qué filtro está aplicado.
- Búsqueda y categoría se combinan, por ejemplo "Electrónica" + "SSD".

### Ordenamientos

| Opción | Justificación |
|---|---|
| **Relevancia** (por defecto) | Mantiene el orden original de la API; es el punto de partida neutro. |
| **Precio: menor a mayor** | Útil para quien tiene un presupuesto limitado. |
| **Precio: mayor a menor** | Útil para quien busca productos premium o quiere ver primero lo más costoso. |
| **Nombre: A-Z** | Facilita ubicar un producto conocido en una lista larga. |
| **Calificación** | Muestra primero lo mejor valorado por otros usuarios; ayuda a decidir con confianza. |

Se eligió el menú desplegable porque agrupa varias opciones en poco espacio, algo importante en pantallas pequeñas.

### Botón "Limpiar filtros"
Restablece búsqueda, orden y categoría en un solo clic. Evita que el usuario se quede atrapado en una vista sin resultados y no sepa cómo volver al catálogo completo.

### Mensajes de resultado
Mostrar "N resultados" o "No hay productos con esos filtros" confirma que el filtro funcionó y evita que una lista vacía parezca un error.
