import { deleteSave, loadObject } from "./gestorAlmac.js";
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

document.addEventListener('DOMContentLoaded', () => {

    const btnElim = document.querySelector('.btn-elim');
    const btnCont = document.querySelector('.btn-cont');

    btnCont.addEventListener('click', () => {
        if (!loadObject()) 
            mostrarToast('error', 'No existe ninguna partida guardada');
        else
            window.location.href = 'paginas/pantalla_juego.html';
    });

    btnElim.addEventListener('click', () => {
        if(!loadObject())
            mostrarToast('error', 'No existe ninguna partida guardada para poder elminar');
        else{
            deleteSave();
            mostrarToast('success', 'La partida ha sido eliminada');
        }
    });
});