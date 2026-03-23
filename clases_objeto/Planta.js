export default class Planta{
    #nombre;
    #tiempoMadur;   
    #cantFrutos;
    #fechaSiembra;   
    #estado;        
 
    constructor(nombre, tiempoMadur, cantFrutos) {
        this.#nombre = nombre;
        this.#tiempoMadur = tiempoMadur;
        this.#cantFrutos = cantFrutos;
        this.#fechaSiembra = null;
        this.#estado = 'inicial';
    }
 
    get nombre(){
        return this.#nombre;
    }

    get cantFrutos(){
        return this.#cantFrutos; 
    }

    get estado(){
        return this.#estado;
    }
    
    get tiempoMadur(){
        return this.#tiempoMadur;
    }
    
    get fechaSiembra(){ 
        return this.#fechaSiembra; 
    }

    sembrar() {
        if (this.#estado !== 'inicial') return false;
        this.#fechaSiembra = Date.now();
        this.#estado = 'plantada';
        return true;
    }

    actualizarEstado() {
        if (this.#estado === 'inicial' || this.#estado === 'madura') return;
        const transcurrido = (Date.now() - this.#fechaSiembra) / 1000;
        if (transcurrido >= this.#tiempoMadur)
            this.#estado = 'madura';
        else if (transcurrido >= this.#tiempoMadur / 2)
            this.#estado = 'creciendo';
    }

    recoger() {
        if (this.#estado !== 'madura') return 0;
        const frutos = this.#cantFrutos;
        this.#estado = 'inicial';
        this.#fechaSiembra = null;
        return frutos;
    }
}