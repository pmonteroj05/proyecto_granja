import Granja from "../clases_objeto/Granja.js";
import Planta from "../clases_objeto/Planta.js";
import Granjero from "../clases_objeto/Granjero.js";
import Herramienta from "../clases_objeto/Herramienta.js";
 
const carga = "granja";

function descompHerram(h){
    return h.descomp();
}
 
function descompGranjero(g) {
    return {
        nombre: g.nombre,
        dinero: g.dinero,
        energia: g.energia,
        azada: descompHerram(g.azada),
        hoz: descompHerram(g.hoz),
        regadera: descompHerram(g.regadera)
    };
}
 
function descompPlanta(p){
    return {
        nombre: p.nombre,
        tiempoMadur: p.tiempoMadur,
        cantFrutos: p.cantFrutos,
        estado: p.estado,
        fechaSiembra: p.fechaSiembra
    };
}
 
function descompGranja(granja){
    return{
        granjero: descompGranjero(granja.granjero),
        catalogo: granja.catalogo,
        tipoCultivo: granja.tipoCultivo,
        inventarioSemillas: granja.inventarioSemillas,
        parcelas: granja.parcelas.map(p => p ? descompPlanta(p) : null),
        frutosRecogidos: granja.frutosRecogidos
    };
}

function compHerram(obj) {
    const h = new Herramienta(obj.tipo, obj.precio, obj.usosMaxPorNivel ?? 100, obj.nivel ?? 1);
    const usosMax = h.usosMax;
    const diferencia = obj.usos - usosMax;
    if (diferencia < 0) {
        const desgaste = usosMax - obj.usos;
        for (let i = 0; i < desgaste; i++) 
            h.usar();
    }
    return h;
}
 
function compGranjero(obj) {
    const g = new Granjero(obj.nombre, obj.dinero, obj.energia);
    const azadaGuardada = compHerram(obj.azada);
    const hozGuardada = compHerram(obj.hoz);
    const regadGuardada = compHerram(obj.regadera);
 
    const desgasteAzada = 100 - obj.azada.usos;
    for (let i = 0; i < desgasteAzada; i++) 
        g.azada.usar();
 
    const desgasteHoz = 100 - obj.hoz.usos;
    for (let i = 0; i < desgasteHoz; i++) 
        g.hoz.usar();

    const desgasteRegadera = 100 - obj.regadera.usos;
    for (let i = 0; i < desgasteRegadera; i++) 
        g.regadera.usar();
 
    if (obj.azada.nivel > 1)
        for (let i = 1; i < obj.azada.nivel; i++) 
            g.azada.subirNivel();

    if (obj.hoz.nivel > 1)
        for (let i = 1; i < obj.hoz.nivel; i++) 
            g.hoz.subirNivel();

    if (obj.regadera.nivel > 1)
        for (let i = 1; i < obj.regadera.nivel; i++) 
            g.regadera.subirNivel();
 
    return g;
}
 
function compGranja(obj) {
    const granjero = compGranjero(obj.granjero);
    const g = new Granja(granjero, obj.catalogo || [], obj.tipoCultivo || 'm');

    obj.inventarioSemillas.forEach(semGuardada => {
        const semActual = g.inventarioSemillas.find(s => s.nombre === semGuardada.nombre);
        if (semActual)
            semActual.cantidad = semGuardada.cantidad;
        else
            g.sumsem(semGuardada.nombre, semGuardada.cantidad);
    });
 
    
    obj.parcelas.forEach((pObj, i) => {
        if (!pObj) 
            return;

        const planta = new Planta(pObj.nombre, pObj.tiempoMadur, pObj.cantFrutos);
        
        if (pObj.estado !== 'inicial') {
            planta.sembrar();
            if (pObj.fechaSiembra) 
                planta.restaurarFecha(pObj.fechaSiembra);
            
            if (pObj.estado === 'madura' || pObj.estado === 'creciendo')
                planta.forzarEstado(pObj.estado);
            
        }
        g.parcelas[i] = planta;
    });
 
    Object.assign(g.frutosRecogidos, obj.frutosRecogidos);
 
    return g;
}


export function saveObject(granja) {
    localStorage.setItem(carga, JSON.stringify(descompGranja(granja)));
}
 
export function loadObject() {
    const libre = localStorage.getItem(carga);
    if (!libre) 
        return null;
    return compGranja(JSON.parse(libre));
}

export function deleteSave() {
    localStorage.removeItem(carga);
}