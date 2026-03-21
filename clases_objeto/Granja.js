import Granjero from "./Granjero.js";
import Planta from "./Planta.js"

export default class Granja{
    #granjero;
    #catalogo;            
    #inventarioSemillas;  
    #parcelas;            
    #frutosRecogidos;     
 
    constructor() {
        this.#granjero = new Granjero('Jacinto');
 
        this.#catalogo = [
            new Planta('Calabaza', 30, 5),
            new Planta('Alcachofa', 50, 8)
        ];
 
        this.#inventarioSemillas = [
            {nombre: 'Calabaza', cantidad: 100},
            {nombre: 'Alcachofa', cantidad: 100}
        ];
 
        this.#parcelas = Array(16).fill(null);
        this.#frutosRecogidos = {};
    }
 
    get granjero(){
        return this.#granjero;
    }
    
    get catalogo(){
        return this.#catalogo;
    }
    
    get inventarioSemillas(){
        return this.#inventarioSemillas;
    }
    
    get parcelas(){
        return this.#parcelas;
    }
    
    get frutosRecogidos(){
        return this.#frutosRecogidos;
    }
 
    sembrar(indiceParcela, nombreSemilla) {
        if (this.#parcelas[indiceParcela] !== null)
            return{
                ocup: false
            };
 
        const semInv = this.#inventarioSemillas.find(s => s.nombre === nombreSemilla);
        if (!semInv || semInv.cantidad <= 0)
            return{
                ocup: false
            };
 
        if (!this.#granjero.azada.usar())
            return{
                ocup: false
            };
 
        const plantilla = this.#catalogo.find(p => p.nombre === nombreSemilla);
        const nueva = new Planta(plantilla.nombre, plantilla.tiempoMadur, plantilla.cantFrutos);
        nueva.sembrar();
 
        this.#parcelas[indiceParcela] = nueva;
        semInv.cantidad--;
 
        return{
            ocup: true
        };
    }
 
    recoger(indiceParcela) {
        const planta = this.#parcelas[indiceParcela];
        if (!planta)
            return{
                ocup: false
            };
        if (planta.estado !== 'madura')
            return{
                ocup: false
            };
        if (!this.#granjero.hoz.usar())
            return{
                ocup: false
            };
 
        const frutos = planta.recoger();
        const nombre = planta.nombre;
        this.#parcelas[indiceParcela] = null;
 
        this.#frutosRecogidos[nombre] = (this.#frutosRecogidos[nombre] || 0) + frutos;
        this.#granjero.ganarDinero(frutos * 2);
 
        return{
            ocup: true
        };
    }
 
    actualizarEstados() {
        const cambiados = [];
        this.#parcelas.forEach((planta, i) => {
            if (!planta) return;
            const antes = planta.estado;
            planta.actualizarEstado();
            if (planta.estado !== antes) cambiados.push(i);
        });
        return cambiados;
    }
}