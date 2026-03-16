import Herramienta from "./Herramienta";
export default class Granjero{
    
    #nombre;
    #dinero;
    #energia;
    #herramienta1;
    #herramienta2;

    constructor(nombre){
        this.#nombre = nombre;
        this.#dinero = 100;
        this.#energia = 100;
        this.#herramienta1 = new Herramienta('Azada', 20, 20);
        this.#herramienta2 = new Herramienta('Hoz', 20, 20);
    }
}