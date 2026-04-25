import Granjero from "./Granjero.js";
import Planta from "./Planta.js"

export default class Granja{
    #granjero;
    #catalogo;            
    #inventarioSemillas;  
    #parcelas;            
    #frutosRecogidos;
    #tipoCultivo;
    #semillaInicial;       
 
    constructor(granjero, catalogo = [], tipoCultivo = null, semillaInicial = null) {
        this.#granjero = granjero;
        this.#catalogo = catalogo;
        this.#tipoCultivo = tipoCultivo;
        this.#semillaInicial = semillaInicial;
        this.#inventarioSemillas = catalogo.map(p => ({
            nombre: p.nombre,
            cantidad: (p.nombre === semillaInicial) ? 10 : 0
        }));
 
        this.#parcelas = Array(16).fill(null);
        this.#frutosRecogidos = {};
    }
 
    get granjero(){
        return this.#granjero;
    }

    set granjero(g){
        this.#granjero = g;
    }
    
    get catalogo(){
        return this.#catalogo;
    }

    set catalogo(c){
        this.#catalogo = c;
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

    get tipoCultivo(){
        return this.#tipoCultivo;
    }

    get semillaInicial(){
        return this.#semillaInicial;
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
 
        this.#granjero.perderenergia(1);
        return{
            ocup: true
        };
    }

    regar(indiceParcela) {
        const planta = this.#parcelas[indiceParcela];
        if (!planta)
            return{
                ocup: false 
            };

        if (planta.estado === 'inicial' || planta.estado === 'madura')
            return{
                ocup: false
            };

        if (!this.#granjero.regadera.usar())
            return {
                ocup: false
            };

        const nivel = this.#granjero.regadera.nivel;
        planta.regar(nivel);
        this.#granjero.perderenergia(1);
        return{
            ocup: true
        };
    }

    sumsem(nombreSemilla, cantidad = 1){
        const semInv = this.#inventarioSemillas.find(s => s.nombre === nombreSemilla);
        if (semInv)
            semInv.cantidad += cantidad;
        else
            this.#inventarioSemillas.push({nombre: nombreSemilla, cantidad});
    }

    añadirAlCatalogo(planta) {
        const existe = this.#catalogo.find(p => p.nombre === planta.nombre);
        if (!existe) 
            this.#catalogo.push(planta);
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
        if (!this.#granjero.hoz.usar()){
            return{
                ocup: false
            };
        }
        const frutos = planta.recoger();
        const nombre = planta.nombre;
        this.#parcelas[indiceParcela] = null;
 
        this.#frutosRecogidos[nombre] = (this.#frutosRecogidos[nombre] || 0) + frutos;
        this.#granjero.ganarDinero(frutos * 2);
        this.#granjero.perderenergia(1);
        return{
            ocup: true
        };
    }
 
    actualizarEstados() {
        const cambiados = [];
        this.#parcelas.forEach((planta, i) => {
            if (!planta) 
                return;
            const antes = planta.estado;
            planta.actualizarEstado();
            if (planta.estado !== antes)
                cambiados.push(i);
        });
        return cambiados;
    }
}