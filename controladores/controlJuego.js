import { loadObject, saveObject } from "../controladores/gestorAlmac.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm";

let granja;
let semillaActiva = null;

const inicial = "url('/recursos/pantalla_juego/sin_semilla.jpg')";
const plantada = "url('/recursos/pantalla_juego/plantada.jpg')";
const creciendo = "url('/recursos/pantalla_juego/creciendo.jpg')";

const IMG_PLANTA = {
    'Calabaza': '/recursos/pantalla_juego/calabaza.png',
    'Alcachofa': '/recursos/pantalla_juego/alcachofa.png',
    'Berenjena': '/recursos/pantalla_juego/berenjena.png',
    'Melocotón': '/recursos/pantalla_juego/melocoton.png',
    'Plátano': '/recursos/pantalla_juego/platano.png',
    'Manzana': '/recursos/pantalla_juego/manzana.png'
};

function mostrarToast(icono, mensaje) {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: icono,
    title: mensaje,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });
}

document.addEventListener('DOMContentLoaded', () => {

    granja = loadObject();
    if (!granja) {
        mostrarToast('error', 'No hay partida guardada. Configura primero tu granja.');
        setTimeout(() => { window.location.href = '/paginas/configuracion.html'; }, 1000);
        return;
    }
    renderTodasCeldas();
    actualizarContadores();

    const btnsParcela = document.querySelectorAll('button.parcela');
    const btnGuardar = document.querySelector('.btn-save');
    const btnContinuar = document.querySelector('.btn-cont');
    const btnsSem = document.querySelector('.botones-semillas');
   
    const spanUsosAzada = document.getElementById('usos-azada');
    const spanUsosHoz = document.getElementById('usos-hoz');
    const spanUsosRegadera = document.getElementById('usos-regadera');
    const spanDinero = document.getElementById('dinero');
    const spanEnerg = document.getElementById('energia');
    const spanNombre = document.getElementById('nombre-granjero');
    
    const celdas = document.querySelectorAll('.celda-vista');

    const inventarioDiv = document.querySelector('.inventario-semillas');
    const frutosDiv = document.querySelector('.frutos');
    

    granja.catalogo.forEach(planta => {
        const btn = document.createElement('button');
        btn.classList.add('btn-semilla');
        btn.dataset.semilla = planta.nombre;
        btn.innerHTML = `<img src="${IMG_PLANTA[planta.nombre] || ''}" alt="${planta.nombre}">`;
        btn.addEventListener('click', () => seleccionarSemilla(planta.nombre, btn));
        btnsSem.appendChild(btn);
    });
 
    function seleccionarSemilla(nombre, btnActivo) {
        if (semillaActiva === nombre) {
            semillaActiva = null;
            btnActivo.style.outline = '';
        }else{
            semillaActiva = nombre;
            btnsSem.querySelectorAll('.btn-semilla').forEach(b => b.style.outline = '');
            btnActivo.style.outline = '3px solid #2e8b57';
        }
    }

    btnsParcela.forEach(btn => {
        btn.addEventListener('click', () => {
            const indice = parseInt(btn.dataset.indice);
 
            if(semillaActiva){
                const res = granja.sembrar(indice, semillaActiva);
                if(res.ocup) {
                    renderCelda(indice);
                    actualizarContadores();
                    saveObject(granja);
                }else{
                    const mensajes = {
                        parcela_ocupada: 'Esta parcela ya está ocupada',
                        sin_semillas: 'No tienes semillas de ese tipo',
                        azada_rota: 'Tu azada no tiene más usos',
                        planta_no_encontrada:'Planta no encontrada en el catálogo'
                    };
                    mostrarToast('error', mensajes[res.motivo] || 'No se pudo sembrar');
                }
            }else{
                const planta = granja.parcelas[indice];
                if (planta && planta.estado === 'madura'){
                    const res = granja.recoger(indice);
                    if (res.ocup){
                        renderCelda(indice);
                        actualizarContadores();
                        saveObject(granja);
                        mostrarToast('success', '¡Cosecha recogida!');
                    }else if (res.motivo === 'hoz_rota')
                        mostrarToast('error', 'Tu hoz no tiene más usos');
                }else if (planta && planta.estado !== 'madura')
                    mostrarToast('error', 'La planta aún no está madura');
            }
        });
    });

    setInterval(() => {
        const cambiadas = granja.actualizarEstados();
        if(cambiadas.length > 0){
            cambiadas.forEach(i => renderCelda(i));
            actualizarContadores();
            saveObject(granja);
        }
    }, 1000);

    function renderTodasCeldas() {
        celdas.forEach((_, i) => renderCelda(i));
    }
 
    function renderCelda(i) {
        const celda  = celdas[i];
        const planta = granja.parcelas[i];
        celda.querySelectorAll('.img-planta').forEach(el => el.remove());
 
        if (!planta || planta.estado === 'inicial'){
            celda.style.backgroundImage = inicial;
            return;
        }
 
        switch (planta.estado){
            case 'plantada':
                celda.style.backgroundImage = plantada;
                break;
            case 'creciendo':
                celda.style.backgroundImage = creciendo;
                break;
            case 'madura':
                celda.style.backgroundImage = plantada;
                const imgEl = document.createElement('img');
                imgEl.src = IMG_PLANTA[planta.nombre] || '';
                imgEl.alt = planta.nombre;
                imgEl.className = 'img-planta';
                celda.appendChild(imgEl);
                break;
        }
    }

    function actualizarContadores() {
        const inv = granja.inventarioSemillas;
        const fr  = granja.frutosRecogidos;

        if (spanNombre) spanNombre.textContent = granja.granjero.nombre;
 
        if (inventarioDiv) {
            inventarioDiv.innerHTML = '';
            inv.forEach(s => {
                const li = document.createElement('li');
                li.innerHTML = `<img src="${IMG_PLANTA[s.nombre] || ''}" alt="${s.nombre}"><span>${s.nombre}: </span><span id="sem-${s.nombre.toLowerCase()}">${s.cantidad}</span>`;
                inventarioDiv.appendChild(li);
            });
        }

        if (frutosDiv) {
            frutosDiv.innerHTML = '';
            granja.catalogo.forEach(p => {
                const li = document.createElement('li');
                li.innerHTML = `<img src="${IMG_PLANTA[p.nombre] || ''}" alt="${p.nombre}"><span>${p.nombre}: </span><span>${fr[p.nombre] || 0}</span>`;
                frutosDiv.appendChild(li);
            });
        }
 
        if (spanUsosAzada)
            spanUsosAzada.textContent = granja.granjero.azada.usos;

        if (spanUsosHoz)
            spanUsosHoz.textContent = granja.granjero.hoz.usos;
        
        if(spanUsosRegadera)
            spanUsosRegadera.textContent = granja.granjero.regadera.usos;
        
        if (spanDinero)
            spanDinero.textContent = granja.granjero.dinero;
        
        if (spanEnerg)
            spanEnerg.textContent = granja.granjero.energia;
    }

    btnGuardar.addEventListener('click', () => {
        saveObject(granja);
    });

    btnContinuar.addEventListener('click', () => {
        saveObject(granja);
        mostrarToast("success", "Partida guardada correctamente, puedes continuar");
    });
});