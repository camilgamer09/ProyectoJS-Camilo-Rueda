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