import Granjero from "./Granjero";
import Planta from "./Planta";

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
            {nombre: 'Calabaza', cantidad: 10},
            {nombre: 'Alcachofa', cantidad: 10}
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
                ocup: false, mensaje: 'Esa parcela ya está ocupada.'
            };
 
        const semInv = this.#inventarioSemillas.find(s => s.nombre === nombreSemilla);
        if (!semInv || semInv.cantidad <= 0)
            return{
                ocup: false, mensaje: `No quedan semillas de ${nombreSemilla}.`
            };
 
        if (!this.#granjero.azada.usar())
            return{
                ocup: false, mensaje: 'La azada no tiene usos disponibles.'
            };
 
        const plantilla = this.#catalogo.find(p => p.nombre === nombreSemilla);
        const nueva = new Planta(plantilla.nombre, plantilla.tiempoMadur, plantilla.cantFrutos);
        nueva.sembrar();
 
        this.#parcelas[indiceParcela] = nueva;
        semInv.cantidad--;
 
        return{
            ocup: true, mensaje: `${nombreSemilla} sembrada en parcela ${indiceParcela}.`
        };
    }
 
    recoger(indiceParcela) {
        const planta = this.#parcelas[indiceParcela];
        if (!planta)
            return{
                ocup: false, mensaje: 'Esa parcela está vacía.'
            };
        if (planta.estado !== 'madura')
            return{
                ocup: false, mensaje: 'La planta aún no está madura.'
            };
        if (!this.#granjero.hoz.usar())
            return{
                ocup: false, mensaje: 'La hoz no tiene usos disponibles.'
            };
 
        const frutos = planta.recoger();
        const nombre = planta.nombre;
        this.#parcelas[indiceParcela] = null;
 
        this.#frutosRecogidos[nombre] = (this.#frutosRecogidos[nombre] || 0) + frutos;
        this.#granjero.ganarDinero(frutos * 2);
 
        return{
            ocup: true, mensaje: `${frutos} ${nombre} recogidas.`
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