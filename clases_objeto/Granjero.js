import Herramienta from "./Herramienta.js";
export default class Granjero{
    
    #nombre;
    #dinero;
    #energia;
    #azada;
    #hoz;

    constructor(nombre){
        this.#nombre = nombre;
        this.#dinero = 100;
        this.#energia = 100;
        this.#azada = new Herramienta('Azada', 20, 100);
        this.#hoz = new Herramienta('Hoz', 20, 100);
    }

    get nombre(){
        return this.#nombre;
    }

    get dinero(){
        return this.#dinero;
    }
    
    get energia(){
        return this.#energia;
    }
    
    get azada(){
        return this.#azada;
    }
    
    get hoz(){
        return this.#hoz;
    }

    ganarDinero(cantidad) {
        this.#dinero += cantidad;
    }

    perderenergia(usos) {
        this.#energia -= usos;
    }
}