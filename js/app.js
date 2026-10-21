const API = "https://fakestoreapi.com/products";

let productos = [];
let categoria = "todas";
let carrito = cargarCarrito();
/*Hago variables correspondentes con los ids del html*/
const busqueda = document.getElementById("busqueda");
const orden = document.getElementById("orden");
const panel = document.getElementById("carrito");
const mensaje = document.getElementById("mensaje");
const templateTarjeta = document.getElementById("template-tarjeta");
/*creacion etiqueta*/
function crear(etiqueta, texto, clase) {
 const el = document.createElement(etiqueta);
 el.textContent = texto;
 if (clase) el.className = clase;
 return el;
}

function dinero(n) {
  return "$" + n.toFixed(2) + " USD";
}
/*Funcion de diccionario*/
function nombreCategoria(c) {
 const nombres = {
  electronics: "Electrónica",
  jewelery: "Joyería",
  "men's clothing": "Ropa de hombre",
  "women's clothing": "Ropa de mujer"
 };
 return nombres[c] || c;
}
/*
/*API*/
async function obtenerProductos() {
  mensaje.textContent = "Cargando productos...";

  try{
    const respuesta = await fetch(API);
    if (!respuesta.ok) throw new Error("Error" + respuesta.status);

    productos = await respuesta.json();
    mensaje.textContent = "";

    crearCategorias();
    mostrarDestacados();
    mostrarProductos();
  } catch (error) {
    mensaje.textContent = "No se pudieron cargar los productos. ";
    const boton = crear("button", "Reintentar");
    boton.addEventListener("click", obtenerProductos);
    mensaje.appendChild(boton);
  } 
}

/*Tarjetas template*/
function crearTarjeta(p, destacado) {
 const clone = templateTarjeta.content.cloneNode(true);

 const img = clone.querySelector(".card-img");
 img.src = p.image;
 img.alt = p.title;

 const etiqueta = clone.querySelector(".etiqueta");
 if (destacado) {
  etiqueta.style.display = "block";
 }

 const n = Math.round(p.rating.rate);
 clone.querySelector(".estrellas-texto").textContent = "★".repeat(n) + "☆".repeat(5 - n);
 clone.querySelector(".rate-num").textContent = "(" + p.rating.rate + ")";

 clone.querySelector(".card-titulo").textContent = p.title;
 clone.querySelector(".card-desc").textContent = p.description;
 clone.querySelector(".card-precio").textContent = dinero(p.price);
 clone.querySelector(".card-cat").textContent = nombreCategoria(p.category);

 const boton = clone.querySelector(".btn-agregar");
 boton.addEventListener("click", function () {
  agregarAlCarrito(p.id);
 });

 return clone;
}

function mostrarDestacados() {
 // Los 3 mejor calificados
 const mejores = [...productos]
  .sort((a, b) => b.rating.rate - a.rating.rate)
  .slice(0, 3);

 document.getElementById("destacados")
  .replaceChildren(...mejores.map((p) => crearTarjeta(p, true)));
}

function mostrarProductos() {
 const texto = busqueda.value.toLowerCase();

 // Filtrar por búsqueda y categoría
 const lista = productos.filter(function (p) {
  const coincide = p.title.toLowerCase().includes(texto) ||
   p.description.toLowerCase().includes(texto);
  return coincide && (categoria === "todas" || p.category === categoria);
 });


  // Ordenar
  if (orden.value === "precio-asc") lista.sort((a, b) => a.price - b.price);
  if (orden.value === "precio-desc") lista.sort((a, b) => b.price - a.price);
  if (orden.value === "nombre") lista.sort((a, b) => a.title.localeCompare(b.title));
  if (orden.value === "calificacion") lista.sort((a, b) => b.rating.rate - a.rating.rate);

 document.getElementById("productos")
  .replaceChildren(...lista.map((p) => crearTarjeta(p, false)));

 document.getElementById("resultados").textContent =
  lista.length ? lista.length + " resultados" : "No hay productos con esos filtros.";

}

function crearCategorias() {
 const nombres = ["todas", ...new Set(productos.map((p) => p.category))];
 const barra = document.getElementById("categorias");
 barra.replaceChildren();

 nombres.forEach(function (nombre) {
  const boton = crear("button", nombre === "todas" ? "Todos" : nombreCategoria(nombre), "pildora");
  if (nombre === categoria) boton.classList.add("activa");

  boton.addEventListener("click", function () {
   categoria = nombre;
   crearCategorias();
   mostrarProductos();
  });

  barra.appendChild(boton);
 });
}
// Carrito
function cargarCarrito() {
 try {
  return JSON.parse(localStorage.getItem("carrito")) || {};
 } catch (error) {
  return {}; 
 }
}

function guardarCarrito() {
 localStorage.setItem("carrito", JSON.stringify(carrito));
 mostrarCarrito();
}

function agregarAlCarrito(id) {
 if (carrito[id]) {
  carrito[id].cantidad++;
 } else {
  carrito[id] = { producto: productos.find((p) => p.id === id), cantidad: 1 };
 }
 guardarCarrito();
}

function cambiarCantidad(id, cambio) {
 carrito[id].cantidad += cambio;
 if (carrito[id].cantidad <= 0) delete carrito[id];
 guardarCarrito();
}

function eliminar(id) {
 delete carrito[id];
 guardarCarrito();
}

function mostrarCarrito() {
 const lista = document.getElementById("lista-carrito");
 const items = Object.values(carrito);
 let total = 0;
 let unidades = 0;

 lista.replaceChildren();
 if (!items.length) lista.textContent = "Tu carrito está vacío.";

 items.forEach(function (item) {
  const p = item.producto;
  total += p.price * item.cantidad;
  unidades += item.cantidad;

  const menos = crear("button", "-");
  menos.addEventListener("click", () => cambiarCantidad(p.id, -1));

  const mas = crear("button", "+");
  mas.addEventListener("click", () => cambiarCantidad(p.id, 1));

  const quitar = crear("button", "Eliminar");
  quitar.addEventListener("click", () => eliminar(p.id));

  const img = document.createElement("img");
  img.src = p.image;
  img.alt = p.title;

  const datos = crear("div", "", "item-datos");
  datos.append(
   crear("p", p.title),
   menos, crear("span", " " + item.cantidad + " "), mas, quitar,
   crear("p", "Subtotal: " + dinero(p.price * item.cantidad))
  );

  const fila = crear("div", "", "item");
  fila.append(img, datos);
  lista.appendChild(fila);
 });

 document.getElementById("total").textContent = dinero(total);
 document.getElementById("contador").textContent = unidades;
}

