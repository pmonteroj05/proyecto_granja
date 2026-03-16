import Granjero from "./Granjero";
import Planta from "./Planta";

export default class Granja{
    #granjero;
    #planta1;
    #planta2;

    constructor(){
        this.#granjero = new Granjero('Jacinto');
        this.#planta1 = new Planta ('Calabaza', 10, 15, 20);
        this.#planta2 = new Planta ('Alcachofa', 15, 20, 25);
    }
    
}