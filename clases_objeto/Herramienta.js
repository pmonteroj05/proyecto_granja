export default class Herramienta{
    #tipo;
    #precio;
    #usos;
    #nivel;
    #usosMaxPorNivel;

    constructor(tipo, precio, usos, nivel = 1){
        this.#tipo = tipo;
        this.#precio = precio;
        this.#usos = usos * nivel;
        this.#nivel = nivel;
        this.#usosMaxPorNivel = usos;
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

    get nivel(){
        return this.#nivel;
    }
    
    get usosMax(){
        return this.#usosMaxPorNivel * this.#nivel;
    }

    usar() {
        if (this.#usos <= 0) 
            return false;
        this.#usos--;
        return true;
    }

    romper(){
        if(this.#usos <= 5)
            return true;
        else
            return false;
    }

    recuperar(){
        if(this.romper)
            this.#precio = 200;
    }

    recargarUsos(cantidad) {
        this.#usos = Math.min(this.#usos + cantidad, this.usosMax);
    }
 
    subirNivel() {
        this.#nivel++;
        this.#usos += this.#usosMaxPorNivel;
    }

    descomp() {
        return {
            tipo: this.#tipo,
            precio: this.#precio,
            usos: this.#usos,
            nivel: this.#nivel,
            usosMaxPorNivel: this.#usosMaxPorNivel
        };
    }
}