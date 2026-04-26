import Granjero from "../clases_objeto/Granjero.js";
import Granja from "../clases_objeto/Granja.js";
import {saveObject} from "../controladores/gestorAlmac.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm";

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

const catalogo_compl = {
    v: [{ nombre: 'Calabaza', tiempoMadur: 60, cantFrutos: 3 },
        { nombre: 'Alcachofa', tiempoMadur: 40, cantFrutos: 2 },
        { nombre: 'Berenjena', tiempoMadur: 30, cantFrutos: 4 }],
    f: [{ nombre: 'Melocotón', tiempoMadur: 90, cantFrutos: 4 },
        { nombre: 'Plátano', tiempoMadur: 120, cantFrutos: 5 },
        { nombre: 'Manzana', tiempoMadur: 100, cantFrutos: 6 }]
};
catalogo_compl.m = [...catalogo_compl.v, ...catalogo_compl.f];


document.addEventListener('DOMContentLoaded', () => {

    const inputNombre = document.querySelector('#nombre');
    const radios = document.querySelectorAll('[name="tipo"]');
    const selectSemilla = document.querySelector('#semilla-inicial');
    const btnStart = document.querySelector('.btn-start');
    const spanReparto = document.querySelector('#reparto');
    const rowDinero = document.querySelector('#din');
    const rowEnergia = document.querySelector('#ener');
    let puntosDinero = 50;
    let puntosEnergia = 50;
    const total_puntos = 100;
    const min_puntos = 1;
    const max_puntos = 99;

    function actualizarBarras() {
        rowDinero.querySelector('.valorInic').textContent = puntosDinero;
        rowDinero.querySelector('.barra').style.width = ((puntosDinero - min_puntos) / (max_puntos - min_puntos) * 100) + '%';
        
        puntosEnergia = total_puntos - puntosDinero;
        
        rowEnergia.querySelector('.valorInic').textContent = puntosEnergia;
        rowEnergia.querySelector('.barra').style.width = ((puntosEnergia - min_puntos) / (max_puntos - min_puntos) * 100) + '%';

        spanReparto.textContent = total_puntos - puntosDinero - puntosEnergia;
    }

    rowDinero.querySelector('.barra-wrap').addEventListener('click', (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        puntosDinero = Math.round(ratio * (max_puntos - min_puntos) + min_puntos);
        puntosDinero = Math.max(min_puntos, Math.min(max_puntos, puntosDinero));
        actualizarBarras();
    });

    rowEnergia.querySelector('.barra-wrap').addEventListener('click', (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        puntosDinero = Math.round((1 - ratio) * (max_puntos - min_puntos) + min_puntos);
        puntosDinero = Math.max(min_puntos, Math.min(max_puntos, puntosDinero));
        actualizarBarras();
    });

    rowDinero.querySelector('.btn-menos').addEventListener('click', () => {
        if (puntosDinero > min_puntos){
            puntosDinero--; 
            actualizarBarras();
        }
    });

    rowDinero.querySelector('.btn-mas').addEventListener('click', () => {
        if (puntosDinero < max_puntos){
            puntosDinero++; 
            actualizarBarras();
        }
    });
    
    rowEnergia.querySelector('.btn-menos').addEventListener('click', () => {
        if (puntosDinero < max_puntos){
            puntosDinero++; 
            actualizarBarras();
        }
    });

    rowEnergia.querySelector('.btn-mas').addEventListener('click', () => {
        if (puntosDinero > min_puntos){
            puntosDinero--; 
            actualizarBarras();
        }
    });
 
    actualizarBarras();

    function rellenarSemillas(tipo) {
        selectSemilla.innerHTML = '<option value="">Elige una semilla</option>';
        (catalogo_compl[tipo] || []).forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.nombre;
            opt.textContent = p.nombre;
            selectSemilla.appendChild(opt);
        });
        selectSemilla.disabled = false;
    }
 
    radios.forEach(r => {
        r.addEventListener('change', () => {
            rellenarSemillas(r.value);
        });
    });


    btnStart.addEventListener('click', () => {
        const nombre = inputNombre.value.trim();
        const tipoSeleccionado = [...radios].find(r => r.checked)?.value;
        const semillaElegida = selectSemilla.value;
 
        if (!nombre) {
            mostrarToast('error', 'Debes introducir tu nombre de granjero');
            inputNombre.focus();
            return;
        }

        if (!tipoSeleccionado) {
            mostrarToast('error', 'Debes elegir un tipo de cultivo');
            return;
        }
        
        if (!semillaElegida) {
            mostrarToast('error', 'Debes elegir una semilla inicial');
            selectSemilla.focus();
            return;
        }
 
        const catalogo = catalogo_compl[tipoSeleccionado];
        const granjero = new Granjero(nombre, puntosDinero, puntosEnergia);
        const granja = new Granja(granjero, catalogo, tipoSeleccionado, semillaElegida);
 
        saveObject(granja);
        window.location.href = './pantalla_juego.html';  
    });
});