export default class Planta{
    #semilla;
    #tiempoMadur;
    #fechaCultivo;
    #tiempoRecog;
    #cantFrutos;
    #idParcela;

    constructor(semilla, tiempoMadur, fechaCultivo, tiempoRecog, cantFrutos, idParcela){
        this.#semilla = semilla;
        this.#tiempoMadur = tiempoMadur;
        this.#fechaCultivo = fechaCultivo;
        this.#tiempoRecog = tiempoRecog;
        this.#cantFrutos = cantFrutos;
        this.#idParcela = idParcela;
    }

    get tiempoRest(){
        return this.#tiempoMadur - this.#fechaCultivo;
    }

    get estado(){
        if(this.tiempoRest === this.#fechaCultivo)
            return "Plantada";
        else if (this.#tiempoMadur != 0)
            return "En crecimiento";
        else if (this.#tiempoRecog != 0)
            return "Madura";
        else
            return "Podrida";
    }
}