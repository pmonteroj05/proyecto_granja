import Herramienta from "./Herramienta.js";
export default class Granjero{
    #nombre;
    #dinero;
    #energia;
    #azada;
    #hoz;
    #regadera;

    constructor(nombre, dinero, energia){
        this.#nombre = nombre;
        this.#dinero = dinero;
        this.#energia = energia;
        this.#azada = new Herramienta('Azada', 20, 100);
        this.#hoz = new Herramienta('Hoz', 20, 100);
        this.#regadera = new Herramienta('Regadera', 20, 100);
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

    get regadera(){
        return this.#regadera;
    }

    set energia(valor){
        this.#energia = valor;
    }

    ganarDinero(cantidad) {
        this.#dinero += cantidad;
    }

    perderDinero(cantidad) {
        this.#dinero -= cantidad;
    }

    ganarEnergia(cantidad){
        this.#energia += cantidad;
    }

    perderenergia(usos) {
        this.#energia -= usos;
    }
}