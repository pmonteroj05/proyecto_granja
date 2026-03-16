export default class Planta{
    #nombre;
    #numSemilla;
    #tiempoMadur;
    #fechaCultivo;
    #tiempoRecog;
    #cantFrutos;
    #idParcela;

    constructor(nombre, tiempoMadur, tiempoRecog, cantFrutos){
        this.#nombre = nombre;
        this.#numSemilla = 150;
        this.#tiempoMadur = tiempoMadur;
        this.#fechaCultivo = fechaCultivo;
        this.#tiempoRecog = tiempoRecog;
        this.#cantFrutos = cantFrutos;
    }

    get tiempoRest(){
        return this.#tiempoMadur - this.#tiempoRecog;
    }

    get estado(){
        if(this.tiempoRest === this.#fechaCultivo)
            return "Plantada";
        else if (this.#tiempoMadur != 0)
            return "En crecimiento";
        else if (this.#tiempoRecog != 0)
            return "Madura";
        else
            return "Inicial";
    }
}