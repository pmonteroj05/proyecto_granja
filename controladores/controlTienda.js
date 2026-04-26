import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm";
import {loadObject, saveObject} from "../controladores/gestorAlmac.js";
import {filtrosXPath, cargarSem, cargarHerNivel, aplicarOrden, filtrarTipo} from "./lectorxml.js";


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
  
const img_sem = {
  'Calabaza': '../recursos/pantalla_juego/calabaza.png',
  'Alcachofa': '../recursos/pantalla_juego/alcachofa.png',
  'Berenjena': '../recursos/pantalla_juego/berenjena.png',
  'Melocotón': '../recursos/pantalla_juego/melocoton.png',
  'Plátano': '../recursos/pantalla_juego/platano.png',
  'Manzana': '../recursos/pantalla_juego/manzana.png',
  'Fresa': '../recursos/tienda/fresa.png',
  'Piña': '../recursos/tienda/pineapple.png'
};

const img_herr = {
  'Azada': '../recursos/pantalla_juego/azada.png',
  'Hoz': '../recursos/pantalla_juego/hoz.png',
  'Regadera': '../recursos/pantalla_juego/regadera.png'
};

const acciones = {sembrar: 'azada', regar: 'regadera', recoger: 'hoz'};
const den_acc = {'Azada': 'sembrar', 'Hoz': 'recoger', 'Regadera': 'regar'}; 
const herrGranja = (granja, accion) => granja.granjero[acciones[accion]];
const semillasPert = (granja) => new Set(granja.inventarioSemillas.filter(s => s.cantidad > 0).map(s => s.nombre));
const todasOro = (granja) => ['azada', 'hoz', 'regadera'].every(h => granja.granjero[h].nivel >= 4);


function cardSemilla(s, bloqueada, motivo, textBtn, onClick) {
  const div = document.createElement('div');
  div.className = 'card' + (bloqueada ? ' bloqueado' : '');
  div.innerHTML = `<img src="${img_sem[s.nombre] || ''}" alt="${s.nombre}">
                    <p>${s.nombre}</p>
                    <span class="tag tipo-${s.tipo.toLowerCase()}">${s.tipo}</span>
                    <div class="card-info">
                        <span>${s.precio} €</span>
                        <span>${s.tiempoCrec} s</span>
                        <span>${s.beneficio} frutos</span>
                    </div>
                    ${bloqueada ? `<div class="overlay"><span></span><p>${motivo}</p></div>` : 
                    `<button class="btn-comprar">${textBtn}</button>`}`;
  if (!bloqueada) div.querySelector('.btn-comprar').addEventListener('click', onClick);
  return div;
}

function cardHerramienta(h, bloqueada, motivo, colorNivel, onClick) {
  const div = document.createElement('div');
  div.className = 'card' + (bloqueada ? ' bloqueado' : '');
  div.innerHTML = `<img src="${img_herr[h.denominacion] || ''}" alt="${h.denominacion}" class="herr-${colorNivel}">
                    <p>${h.denominacion}</p>
                    <span class="tag nivel-${colorNivel}">${h.nivel}</span>
                    <div class="card-info">
                        <span>${h.coste} €</span>
                        <span>${h.usos} usos</span>
                        <span>${h.accion}</span>
                    </div>
                    ${bloqueada ? `<div class="overlay"><span></span><p>${motivo}</p></div>` : 
                    `<button class="btn-comprar">Mejorar</button>`}`;
  if (!bloqueada) div.querySelector('.btn-comprar').addEventListener('click', onClick);
  return div;
}

function cardRecarga(denominacion, granja, onClick) {
  const herr = herrGranja(granja, den_acc[denominacion]);
  const div = document.createElement('div');
  div.className = 'card';
  div.innerHTML = `<img src="${img_herr[denominacion] || ''}" alt="${denominacion}">
                    <p>${denominacion}</p>
                    <div class="card-info">
                        <span> 10 €</span>
                        <span>${herr.usos} / ${herr.usosMax} usos</span>
                        <span> +10 usos </span>
                    </div>
                    <button class="btn-comprar">Recargar</button>`;
  div.querySelector('.btn-comprar').addEventListener('click', onClick);
  return div;
}

document.addEventListener('DOMContentLoaded', () => {
 
  let granja = loadObject();
 
  const tipoCultivo = granja.tipoCultivo || 'm';
  const spanDinero  = document.getElementById('dinT');
  const contListaSem = document.getElementById('listaSem');
  const contCantSem = document.getElementById('listaCantSem');
  const contUsosHerr = document.getElementById('listaUsosHerr');
  const contNivBronce = document.getElementById('listaBronce');
  const contNivPlata = document.getElementById('listaPlata');
  const contNivOro = document.getElementById('listaOro');
  const contPremium = document.getElementById('listaPremium');
  const actualizarDinero = () => { if (spanDinero) spanDinero.textContent = granja.granjero.dinero; };
  
  actualizarDinero();
 
  async function reRender() {
    actualizarDinero();
    await renderSemillas(document.getElementById('filtro-select')?.value || 'todos');
    await renderCantidad();
    renderUsos();
    await renderNiveles();
    await renderPremium();
  }
 
  async function renderSemillas(filtro) {
    if(!contListaSem)
      return;
    
    let smlls = await cargarSem(filtrosXPath[filtro] || filtrosXPath.todos);
    smlls = filtrarTipo(smlls, tipoCultivo);
    smlls = aplicarOrden(smlls, filtro);
    const poseidas = semillasPert(granja);

    contListaSem.innerHTML = '';
    smlls.forEach(s => {
      const yaComprada = poseidas.has(s.nombre);
      contListaSem.appendChild(cardSemilla(s, yaComprada, 
          'Ya tienes esta semilla', 'Comprar semilla (+ 10)',
          () => comprarNueva(s)));
    });
  }
 
  async function renderCantidad() {
    if (!contCantSem) 
      return;
    let smlls = await cargarSem(filtrosXPath.todos);
    smlls = filtrarTipo(smlls, tipoCultivo);
    const poseidas = semillasPert(granja);

    contCantSem.innerHTML = '';

    smlls.forEach(s => {
        const acceso = poseidas.has(s.nombre);
        contCantSem.appendChild(cardSemilla(s, !acceso, 
            'Compra primero esta semilla', '+ 10 semillas',
            () => comprarCantidad(s)));
    });
  }
 
  function renderUsos(){
    if(!contUsosHerr)
      return;
    contUsosHerr.innerHTML = '';
    ['Azada', 'Hoz', 'Regadera'].forEach(den => {
        contUsosHerr.appendChild(cardRecarga(den, granja, () => comprarUsos(den)));
    });
  }
 
  async function renderNiveles() {
    const cncc = [
        {cod: 'n2', num: 2, color: 'bronce', cont: contNivBronce},
        {cod: 'n3', num: 3, color: 'plata', cont: contNivPlata},
        {cod: 'n4', num: 4, color: 'oro', cont: contNivOro}
    ];

    for (const {cod, num, color, cont} of cncc) {
        if (!cont) 
          continue;
        const herrs = await cargarHerNivel(cod);

        cont.innerHTML = '';
        
        herrs.forEach(h => {
            const herr = herrGranja(granja, h.accion);
            const yaComprada = herr && herr.nivel >= num;
            cont.appendChild(cardHerramienta(
                h, yaComprada, 'Ya tienes este nivel o superior', color,
                () => subirNivel(h, num)
            ));
        });
    }
  }

  async function renderPremium() {
    if (!contPremium) 
      return;

    const smlls = await cargarSem(filtrosXPath.premium);
    const todoOro = todasOro(granja);
    const poseidas = semillasPert(granja);

    contPremium.innerHTML = '';

    smlls.forEach(s => {
        const yaComprada = poseidas.has(s.nombre);
        const bloqueada = !todoOro || yaComprada;
        const motivo = yaComprada ? 'Ya tienes esta semilla' : 'Necesitas todas las herramientas en nivel Oro';
        
        const card = cardSemilla(s, bloqueada, motivo, 'Comprar premium (+ 10)', () => comprarNueva(s));

        if(todoOro && !yaComprada)
          card.classList.add('unlocked');

        contPremium.appendChild(card);
    });
  }
 
  (async () => { await reRender(); })();
 
  document.getElementById('filtro-select')?.addEventListener('change', async (e) => {
      await renderSemillas(e.target.value);
  });
 
  function comprarNueva(s) {
    if (granja.granjero.dinero < s.precio){
      mostrarToast('error', 'No tienes suficiente dinero'); 
      return;
    }

    granja.granjero.perderDinero(s.precio);
    granja.sumsem(s.nombre, 10);

    if (!granja.catalogo.find(p => p.nombre === s.nombre))
        granja.añadirAlCatalogo({nombre: s.nombre, tiempoMadur: s.tiempoCrec, cantFrutos: s.beneficio});
    
    saveObject(granja);
    reRender();
    mostrarToast('success', `+ 10 semillas de ${s.nombre}`);
  }
 
  function comprarCantidad(s) {
    if(!semillasPert(granja).has(s.nombre)){
      mostrarToast('error', 'Primero debes comprar esta semilla');
      return;
    }

    if(granja.granjero.dinero < s.precio){
      mostrarToast('error', 'No tienes suficiente dinero');
      return;
    }

    granja.granjero.perderDinero(s.precio);
    granja.sumsem(s.nombre, 10);

    saveObject(granja);
    reRender();
    mostrarToast('success', `+ 10 semillas de ${s.nombre}`);
  }
 
  function comprarUsos(denominacion){
    if(granja.granjero.dinero < 10){
      mostrarToast('error', 'No tienes suficiente dinero');
      return;
    }

    granja.granjero.perderDinero(10);
    granja.granjero.ganarEnergia(10)
    herrGranja(granja, den_acc[denominacion]).recargarUsos(10);
    
    saveObject(granja);
    reRender();
    mostrarToast('success', `+ 10 usos para ${denominacion}`);
  }
 
  function subirNivel(h, nivelNum){
    const herr = herrGranja(granja, h.accion);
    if(herr.nivel >= nivelNum){
      mostrarToast('error', `${h.denominacion} ya tiene ese nivel o superior`);
      return;
    }

    if(granja.granjero.dinero < h.coste){
      mostrarToast('error', 'No tienes suficiente dinero');
      return;
    }

    granja.granjero.perderDinero(h.coste);
    granja.granjero.ganarEnergia(10)
    herr.subirNivel();
    herr.recargarUsos(h.usos)
    
    saveObject(granja);
    reRender();
    mostrarToast('success', `${h.denominacion} mejorada a nivel ${h.nivel}`);
  }
});