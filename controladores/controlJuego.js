import { loadObject, saveObject } from "../controladores/gestorAlmac.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm";

let granja;
let semillaActiva = null;

const inicial = "url('/recursos/pantalla_juego/sin_semilla.jpg')";
const plantada = "url('/recursos/pantalla_juego/plantada.jpg')";
const creciendo = "url('/recursos/pantalla_juego/creciendo.jpg')";

const IMG_PLANTA = {
    'Calabaza': '/recursos/pantalla_juego/calabaza.png',
    'Alcachofa': '/recursos/pantalla_juego/alcachofa.png'
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

    const btnsParcela = document.querySelectorAll('button.parcela');
    const btnCalab = document.querySelector('.btn-calab');
    const btnAlcac = document.querySelector('.btn-alcac');
    const btnBeren = document.querySelector('.btn-beren');
    
    const spanSemCalabaza = document.getElementById('sem-calabaza');
    const spanSemAlcachofa = document.getElementById('sem-alcachofa');
    const spanSemBeren = document.getElementById('sem-beren');

    const spanFrutosCalab = document.getElementById('frutos-calabaza');
    const spanFrutosAlcac = document.getElementById('frutos-alcachofa');
    const spanFrutosBeren = document.getElementById('frutos-berenj');

    const spanUsosAzada = document.getElementById('usos-azada');
    const spanUsosHoz = document.getElementById('usos-hoz');

    const spanDinero = document.getElementById('dinero');
    const spanEnerg = document.getElementById('energia');

    const celdas = document.querySelectorAll('.celda-vista');

    const btnTienda = document.querySelector('.btn-tienda');
    const btnGuardar = document.querySelector('.btn-save');
    const btnContinuar = document.querySelector('.btn-cont'); 

    if(loadObject() !== true){
        alert("TUTORIAL:                                                                       " +
            "1. Escoger una semilla para plantar                                               " +
            "2. Escoger una parcela donde plantar                                              " +
            "3. Esperar el tiempo necesario para recoger los frutos                            " +
            "4. Recoger los frutos pulsando encima de ellos                                    " +
            "5. Recargar semillas con el botón de la tienda                                    "
        );
    }

    granja = loadObject();
    renderTodasCeldas();
    actualizarContadores();
    
    
    btnCalab.addEventListener('click', () => {
        if (semillaActiva === 'Calabaza') {
            semillaActiva = null;
            btnCalab.style.outline = '';
        } else {
            semillaActiva = 'Calabaza';
            btnCalab.style.outline = '3px solid #2e8b57';
            btnAlcac.style.outline = '';
            btnBeren.style.outline = '';
        }
    });

    btnAlcac.addEventListener('click', () => {
        if (semillaActiva === 'Alcachofa') {
            semillaActiva = null;
            btnAlcac.style.outline = '';
        } else {
            semillaActiva = 'Alcachofa';
            btnAlcac.style.outline = '3px solid #2e8b57';
            btnCalab.style.outline = '';
            btnBeren.style.outline = '';
        }
    });

    btnBeren.addEventListener('click', () => {
        if (semillaActiva === 'Berenjena') {
            semillaActiva = null;
            btnBeren.style.outline = '';
        } else {
            semillaActiva = 'Berenjena';
            btnBeren.style.outline = '3px solid #2e8b57';
            btnCalab.style.outline = '';
            btnAlcac.style.outline = '';
        }
    });

    btnsParcela.forEach(btn => {
        btn.addEventListener('click', () => {
            const indice = parseInt(btn.dataset.indice);

            if (semillaActiva) {
                const res = granja.sembrar(indice, semillaActiva);
                if (res.ocup) {
                    renderCelda(indice);
                    actualizarContadores();
                    saveObject(granja);
                }
            } else{
                const planta = granja.parcelas[indice];
                if (planta && planta.estado === 'madura') {
                    const res = granja.recoger(indice);
                    if (res.ocup) {
                        renderCelda(indice);
                        actualizarContadores();
                        saveObject(granja);
                    }
                }
            }
        });
    });

    setInterval(() => {
        const cambiadas = granja.actualizarEstados();
        if (cambiadas.length > 0) {
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

        if (!planta || planta.estado === 'inicial') {
            celda.style.backgroundImage = inicial;
            return;
        }

        switch (planta.estado) {
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

        spanSemCalabaza.textContent = inv.find(s => s.nombre === 'Calabaza').cantidad;
        spanSemAlcachofa.textContent = inv.find(s => s.nombre === 'Alcachofa').cantidad;
        spanSemBeren.textContent = inv.find(s => s.nombre === 'Berenjena').cantidad;
        spanFrutosCalab.textContent = fr['Calabaza']  || 0;
        spanFrutosAlcac.textContent = fr['Alcachofa'] || 0;
        spanFrutosBeren.textContent = fr['Berenjena'] || 0;
        spanUsosAzada.textContent = granja.granjero.azada.usos;
        spanUsosHoz.textContent = granja.granjero.hoz.usos;
        spanDinero.textContent = granja.granjero.dinero;
        spanEnerg.textContent = granja.granjero.energia;
    }

    btnTienda.addEventListener('click', () => {
        if (semillaActiva === 'Calabaza') {
            btnCalab.style.outline = '3px solid #2e8b57';
            btnAlcac.style.outline = '';
            btnBeren.style.outline = '';
            granja.sumsem(semillaActiva);
            actualizarContadores();
        } else if (semillaActiva === 'Alcachofa'){
            btnAlcac.style.outline = '3px solid #2e8b57';
            btnCalab.style.outline = '';
            btnBeren.style.outline = '';
            granja.sumsem(semillaActiva);
            actualizarContadores();
        }else if (semillaActiva === 'Berenjena'){
            btnBeren.style.outline = '3px solid #2e8b57';
            btnCalab.style.outline = '';
            btnAlcac.style.outline = '';
            granja.sumsem(semillaActiva);
            actualizarContadores();
        }else
            mostrarToast("error", "Debes escoger una planta");
    });

    btnGuardar.addEventListener('click', () => {
        saveObject(granja);
    });

    btnContinuar.addEventListener('click', () => {
        saveObject(granja);
        mostrarToast("success", "Partida guardada correctamente, puedes continuar");
    });
});