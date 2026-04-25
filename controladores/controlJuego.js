import { loadObject, saveObject } from "../controladores/gestorAlmac.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm";

let granja = null;
let herramientaActiva = null;
let semillaSeleccionada = null;
let modoRiego = false;

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
        mostrarToast('error', 'No se encontró una partida guardada. Crea una nueva.');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);
        return;
    }

    const imagenesSemillas = {
        'Calabaza': '/recursos/pantalla_juego/calabaza.png',
        'Alcachofa': '/recursos/pantalla_juego/alcachofa.png',
        'Berenjena': '/recursos/pantalla_juego/berenjena.png',
        'Melocotón': '/recursos/pantalla_juego/melocoton.png',
        'Plátano': '/recursos/pantalla_juego/platano.png',
        'Manzana': '/recursos/pantalla_juego/manzana.png',
        'Fresa': '/recursos/tienda/fresa.png',
        'Piña': '/recursos/tienda/pineapple.png'
    };

    const imagenesEstados = {
        'plantada': '/recursos/pantalla_juego/plantada.jpg',
        'creciendo': '/recursos/pantalla_juego/creciendo.jpg',
        'sinSemilla': '/recursos/pantalla_juego/sin_semilla.jpg'
    };

    const spanNombre = document.getElementById('nombre-granjero');
    const spanDinero = document.getElementById('dinero');
    const spanEnergia = document.getElementById('energia');
    const spanUsosAzada = document.getElementById('usos-azada');
    const spanUsosHoz = document.getElementById('usos-hoz');
    const spanUsosRegadera = document.getElementById('usos-regadera');
    const listaSemillas = document.querySelector('.inventario-semillas');
    const listaFrutos = document.querySelector('.frutos');
    const btnsParcela = document.querySelectorAll('.parcela');
    const contenedorSemillas = document.querySelector('.botones-semillas');
    const btnAzada = document.getElementById('azada');
    const btnHoz = document.getElementById('hoz');
    const btnRegadera = document.getElementById('regadera');
    
    function renderInfoGranjero() {
        if(!spanNombre) return;
        spanNombre.textContent = granja.granjero.nombre;
        spanDinero.textContent = granja.granjero.dinero;
        spanEnergia.textContent = granja.granjero.energia;
        
        if(spanUsosAzada) 
            spanUsosAzada.textContent = `${granja.granjero.azada.usos}/${granja.granjero.azada.usosMax}`;
        if(spanUsosHoz) 
            spanUsosHoz.textContent = `${granja.granjero.hoz.usos}/${granja.granjero.hoz.usosMax}`;
        if(spanUsosRegadera) 
            spanUsosRegadera.textContent = `${granja.granjero.regadera.usos}/${granja.granjero.regadera.usosMax}`;
    }

    function renderInventarioSemillas() {
        if(!listaSemillas) return;
        listaSemillas.innerHTML = '';
        
        granja.inventarioSemillas.forEach(sem => {
            if (sem.cantidad > 0) {
                const li = document.createElement('li');
                li.textContent = `${sem.nombre}: ${sem.cantidad}`;
                listaSemillas.appendChild(li);
            }
        });

        if (listaSemillas.children.length === 0) {
            const li = document.createElement('li');
            li.textContent = "Sin semillas";
            listaSemillas.appendChild(li);
        }
    }

    function renderFrutos() {
        if(!listaFrutos) return;
        listaFrutos.innerHTML = '';
        
        const tieneFrutos = Object.keys(granja.frutosRecogidos).some(key => granja.frutosRecogidos[key] > 0);
        
        if (tieneFrutos) {
            Object.entries(granja.frutosRecogidos).forEach(([nombre, cantidad]) => {
                if (cantidad > 0) {
                    const li = document.createElement('li');
                    li.textContent = `${nombre}: ${cantidad}`;
                    listaFrutos.appendChild(li);
                }
            });
        } else {
            const li = document.createElement('li');
            li.textContent = "Sin frutos recogidos";
            listaFrutos.appendChild(li);
        }
    }

        function renderCelda(indice) {
        const parcela = btnsParcela[indice];
        if (!parcela) 
            return;
        
        const celdaVista = parcela.querySelector('.celda-vista');
        const planta = granja.parcelas[indice];
        
        celdaVista.innerHTML = '';
        
        if (!planta) {
            parcela.style.backgroundColor = 'transparent';
            parcela.style.backgroundImage =  `url('${imagenesEstados['sinSemilla']}')`;
            parcela.style.backgroundSize = 'cover';
            parcela.style.backgroundPosition = 'center';
            return;
        }
        
        let imagenSrc = null;
        let esFruta = false;

        switch(planta.estado) {
            case 'plantada':
                imagenSrc = imagenesEstados['plantada'];
                break;
            case 'creciendo':
                imagenSrc = imagenesEstados['creciendo'];
                break;
            case 'madura':
                imagenSrc = imagenesSemillas[planta.nombre] || imagenesEstados['plantada'];
                esFruta = true;
                break;
            default:
                imagenSrc = imagenesEstados['sinSemilla'];
        }

        parcela.style.backgroundImage = 'none';
        parcela.style.backgroundColor = 'transparent';

        if (imagenSrc) {
            const img = document.createElement('img');
            img.src = imagenSrc;
            img.alt = planta.estado;
            img.className = 'img-planta';
            img.style.position = 'absolute';
            img.style.top = '0';
            img.style.left = '0';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = esFruta ? 'contain' : 'cover';
            img.style.zIndex = '5';
            
            celdaVista.appendChild(img);
        }
    }

    function renderTodasLasParcelas() {
        for (let i = 0; i < 16; i++) {
            renderCelda(i);
        }
    }

    function renderBotonesSemillas() {
        if(!contenedorSemillas) return;
        contenedorSemillas.innerHTML = '';
        
        granja.inventarioSemillas.forEach(sem => {
            if (sem.cantidad > 0) {
                const btn = document.createElement('button');
                btn.className = 'btn-semilla';
                btn.title = `${sem.nombre} (${sem.cantidad})`;
                
                const img = document.createElement('img');
                img.src = imagenesSemillas[sem.nombre] || '/recursos/pantalla_juego/calabaza.png';
                img.alt = sem.nombre;
                
                btn.appendChild(img);
                
                btn.addEventListener('click', () => {
                    contenedorSemillas.querySelectorAll('.btn-semilla').forEach(b => b.classList.remove('selected'));
                    semillaSeleccionada = sem.nombre;
                    btn.classList.add('selected');
                    
                    if (herramientaActiva !== 'azada') {
                        herramientaActiva = 'azada';
                        modoRiego = false;
                        if(btnAzada) 
                            btnAzada.classList.add('active');
                        if(btnHoz) 
                            btnHoz.classList.remove('active');
                        if(btnRegadera) 
                            btnRegadera.classList.remove('active');
                    }
                });
                contenedorSemillas.appendChild(btn);
            }
        });
    }

    function actualizarTodo() {
        renderInfoGranjero();
        renderInventarioSemillas();
        renderFrutos();
        renderBotonesSemillas();
        renderTodasLasParcelas();
    }

    if(btnAzada) {
        btnAzada.addEventListener('click', () => {
            herramientaActiva = 'azada';
            modoRiego = false;
            semillaSeleccionada = null;
            btnAzada.classList.add('active');
            if(btnHoz) 
                btnHoz.classList.remove('active');
            if(btnRegadera) 
                btnRegadera.classList.remove('active');
            if(contenedorSemillas) 
                contenedorSemillas.querySelectorAll('.btn-semilla').forEach(b => b.classList.remove('selected'));
        });
    }

    if(btnHoz) {
        btnHoz.addEventListener('click', () => {
            herramientaActiva = 'hoz';
            modoRiego = false;
            semillaSeleccionada = null;
            btnHoz.classList.add('active');
            if(btnAzada) 
                btnAzada.classList.remove('active');
            if(btnRegadera) 
                btnRegadera.classList.remove('active');
            if(contenedorSemillas) 
                contenedorSemillas.querySelectorAll('.btn-semilla').forEach(b => b.classList.remove('selected'));
        });
    }

    if(btnRegadera) {
        btnRegadera.addEventListener('click', () => {
            herramientaActiva = 'regadera';
            modoRiego = true;
            semillaSeleccionada = null;
            btnRegadera.classList.add('active');
            if(btnAzada) 
                btnAzada.classList.remove('active');
            if(btnHoz) 
                btnHoz.classList.remove('active');
            if(contenedorSemillas) 
                contenedorSemillas.querySelectorAll('.btn-semilla').forEach(b => b.classList.remove('selected'));
        });
    }

    btnsParcela.forEach(btn => {
        btn.addEventListener('click', () => {
            const indice = parseInt(btn.dataset.indice);
            const planta = granja.parcelas[indice];

            if (herramientaActiva === 'regadera' || modoRiego) {
                if (!planta) {
                    mostrarToast('error', 'No hay nada que regar aquí');
                    return;
                }
                const res = granja.regar(indice);
                if (res.ocup) {
                    renderCelda(indice);
                    actualizarTodo();
                    saveObject(granja);
                    mostrarToast('success', '¡Planta regada!');
                } else 
                    mostrarToast('error', granja.granjero.regadera.usos <= 0 ? 'Sin usos' : 'No se puede regar ahora');
                return;
            }

            if (herramientaActiva === 'hoz') {
                if (!planta) {
                    mostrarToast('error', 'No hay planta aquí');
                    return;
                }
                if (planta.estado === 'madura') {
                    const res = granja.recoger(indice);
                    if (res.ocup) {
                        renderCelda(indice);
                        actualizarTodo();
                        saveObject(granja);
                        mostrarToast('success', '¡Cosecha recogida!');
                    } else
                        mostrarToast('error', granja.granjero.hoz.usos <= 0 ? 'Sin usos' : 'Error al recoger');
                } else 
                    mostrarToast('error', 'La planta no está madura');
                return;
            }

            if (herramientaActiva === 'azada') {
                if (!semillaSeleccionada) {
                    mostrarToast('error', 'Selecciona una semilla primero');
                    return;
                }
                if (planta) {
                    mostrarToast('error', 'Ya hay algo plantado aquí');
                    return;
                }
                
                const res = granja.sembrar(indice, semillaSeleccionada);
                if (res.ocup) {
                    renderCelda(indice);
                    actualizarTodo();
                    saveObject(granja);
                    mostrarToast('success', '¡Semilla plantada!');
                } else 
                    mostrarToast('error', granja.granjero.azada.usos <= 0 ? 'Sin usos' : 'Error al sembrar');
                return;
            }

            if (planta && planta.estado === 'madura') {
                const res = granja.recoger(indice);
                if (res.ocup) {
                    renderCelda(indice);
                    actualizarTodo();
                    saveObject(granja);
                    mostrarToast('success', '¡Cosecha recogida!');
                }
            } else if (planta)
                mostrarToast('error', 'Planta no madura');
            else
                mostrarToast('info', 'Parcela vacía. Usa la azada.');
        });
    });

    const btnSave = document.querySelector('.btn-save');
    const btnCont = document.querySelector('.btn-cont');

    if(btnSave) {
        btnSave.addEventListener('click', () => {
            saveObject(granja);
            window.location.href = '../index.html';
        });
    }

    if(btnCont) {
        btnCont.addEventListener('click', () => {
            saveObject(granja);
            mostrarToast('success', 'Partida guardada');
        });
    }

    actualizarTodo();

    setInterval(() => {
        const cambiados = granja.actualizarEstados();
        if (cambiados.length > 0) {
            cambiados.forEach(i => renderCelda(i));
            saveObject(granja);
        }
    }, 1000);
});