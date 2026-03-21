import Granja from "../clases_objeto/Granja.js";
import Planta from "../clases_objeto/Planta.js";
 
const carga = "granja";

function compHerram(h){
    return {
        tipo: h.tipo, precio: h.precio, usos: h.usos
    };
}
 
function compGranjero(g) {
    return {
        nombre: g.nombre,
        dinero: g.dinero,
        energia: g.energia,
        azada: compHerram(g.azada),
        hoz: compHerram(g.hoz)
    };
}
 
function compPlanta(p){
    return {
        nombre: p.nombre,
        tiempoMadur: p.tiempoMadur,
        cantFrutos: p.cantFrutos,
        estado: p.estado
    };
}
 
function compGranja(granja){
    return{
        granjero: compGranjero(granja.granjero),
        inventarioSemillas: granja.inventarioSemillas,
        parcelas: granja.parcelas.map(p => p ? compPlanta(p) : null),
        frutosRecogidos: granja.frutosRecogidos
    };
}

function descompGranja(obj){
    const g = new Granja();

    const usosConsumidosAzada = 20 - obj.granjero.azada.usos;

    for (let i = 0; i < usosConsumidosAzada; i++) 
        g.granjero.azada.usar();

    const usosConsumidosHoz = 20 - obj.granjero.hoz.usos;
    
    for (let i = 0; i < usosConsumidosHoz; i++) 
        g.granjero.hoz.usar();
    
    const diferenciaDinero = obj.granjero.dinero - g.granjero.dinero;
    
    if (diferenciaDinero !== 0) 
        g.granjero.ganarDinero(diferenciaDinero);
 
    obj.inventarioSemillas.forEach(semGuardada => {
        const semActual = g.inventarioSemillas.find(s => s.nombre === semGuardada.nombre);
        if (semActual) semActual.cantidad = semGuardada.cantidad;
    });
 
    obj.parcelas.forEach((pObj, i) => {
        if (!pObj) return;
        const planta = new Planta(pObj.nombre, pObj.tiempoMadur, pObj.cantFrutos);
        if (pObj.estado !== 'inicial') planta.sembrar();
        g.parcelas[i] = planta;
    });
 
    Object.assign(g.frutosRecogidos, obj.frutosRecogidos);
    return g;
}


export function saveObject(granja) {
    localStorage.setItem(carga, JSON.stringify(compGranja(granja)));
}
 
export function loadObject() {
    const libre = localStorage.getItem(carga);
    if (!libre) return new Granja();
    return descompGranja(JSON.parse(libre));
}