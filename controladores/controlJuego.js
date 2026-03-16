import {loadObject} from "../controladores/gestorAlmac";
import Granja from "../clases_objeto/Granja";
import Planta from "../clases_objeto/Planta";

document.addEventListener("DOMContentLoaded", () => {

    const granja = loadObject();

    const sem = document.querySelector(".btn-semilla");
    const region = document.querySelectorAll(".region");

    let selecc;


    const plantas = [];

    for(let i = 0; i < 16; i++){
        plantas.push(new Planta());
    };

    function cambiar(){
        plantas.at(document.querySelector(""))
    }

    if(sem != null){
        const parcela = addEventListener("click", cambiar)
    }



})