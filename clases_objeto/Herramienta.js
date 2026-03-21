export default class Herramienta{
    #tipo;
    #precio;
    #usos;

    constructor(tipo, precio, usos){
        this.#tipo = tipo;
        this.#precio = precio;
        this.#usos = usos;
    }

    get tipo(){
        return this.#tipo;
    }
    
    get precio(){
        return this.#precio;
    }
    
    get usos(){
        return this.#usos;
    }

    get duracion(){
        return this.#usos--;
    }

    usar() {
        if (this.#usos <= 0) return false;
        this.#usos--;
        return true;
    }
}

