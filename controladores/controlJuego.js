import {loadObject} from "../controladores/gestorAlmac";
import {saveObject} from "../controladores/gestorAlmac";

import Granja from "../clases_objeto/Granja";
import Planta from "../clases_objeto/Planta";

document.addEventListener("DOMContentLoaded", () => {

    const granja = new Granja;
    granja = loadObject();

    const botonGuardar = document.querySelector(".btn-save");
    const sem = document.querySelector(".btn-semilla");
    const region = document.querySelectorAll(".region");
    const parcela = parseInt(region.document.querySelector("value"));
    const celda = document.querySelector(".celda-vista");
    let plantaSelec;

    const plantas = [];
    const parcelas = [];

    for(let i = 0; i < 16; i++){
        plantas.push(new Planta());
        parcelas.push(i);
    };

    function cambiar(){
        plantaSelec = plantas.at(parcelas.at(parcela));
        if(plantaSelec.estado() === "Plantada")
            celda.setProperty("background-image", "url('/recursos/pantalla_juego/plantada.jpg')");
        else if (plantaSelec.estado() === "En crecimiento")
            celda.setProperty("background-image", "url('/recursos/pantalla_juego/creciendo.jpg')");
        else if (plantaSelec.estado() === "Madura"){
            celda.setProperty("background-image", "url('/recursos/pantalla_juego/plantada.jpg')");
        }
    }

    if(sem != null){
        parcela = addEventListener("click", cambiar)
    }
    
    botonGuardar.addEventListener("click", () => {
    if (granja.valid) {
        saveObject(granja);
    } 
  })

})