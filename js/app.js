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

/*API*/
async function obtenerProductos() {
  mensaje.textContent = "Cargando productos...";

  try{
    const respuesta = await fetch(API);
    if (!respuesta.ok) throw new Error("Error" + respuesta.status);

    productos = await respuesta.json();
    mensaje.textContent = "";

    crearCategoria();
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

