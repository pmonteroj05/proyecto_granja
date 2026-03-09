export default class Herramienta{
    #tipo;
    #precio;
    #usos;

    constructor(tipo, precio, usos){
        this.#tipo = tipo;
        this.#precio = precio;
        this.#usos = usos;
    }

    get duracion(){
        return this.#usos--;
    }
}

