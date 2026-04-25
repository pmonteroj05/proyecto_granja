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

    restaurarFecha(timestamp) {
        this.#fechaSiembra = timestamp;
    }

    forzarEstado(estado) {
        this.#estado = estado;
    }

    actualizarEstado() {
        if (this.#estado === 'inicial' || this.#estado === 'madura') 
            return;
        const transcurrido = (Date.now() - this.#fechaSiembra) / 1000;
        if (transcurrido >= this.#tiempoMadur)
            this.#estado = 'madura';
        else if (transcurrido >= this.#tiempoMadur / 2)
            this.#estado = 'creciendo';
    }

    sembrar() {
        if (this.#estado !== 'inicial') 
            return false;
        this.#fechaSiembra = Date.now();
        this.#estado = 'plantada';
        return true;
    }

    regar() {
    if (this.#estado === 'inicial' || this.#estado === 'madura')
        return false;
    const reduccion = this.#tiempoMadur * 0.1;
    this.#fechaSiembra -= reduccion * 1000;
    return true;
    }


    recoger() {
        if (this.#estado !== 'madura') 
            return 0;
        const frutos = this.#cantFrutos;
        this.#estado = 'inicial';
        this.#fechaSiembra = null;
        return frutos;
    }
}