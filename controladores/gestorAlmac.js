import Granja from "../clases_objeto/Granja.js";
import Planta from "../clases_objeto/Planta.js";
import Granjero from "../clases_objeto/Granjero.js";
import Herramienta from "../clases_objeto/Herramienta.js";
 
const carga = "granja";
 
function descompGranja(granja){
    return{
        granjero: {
            nombre: granja.granjero.nombre,
            dinero: granja.granjero.dinero,
            energia: granja.granjero.energia,
            azada: granja.granjero.azada.descomp(),
            hoz: granja.granjero.hoz.descomp(),
            regadera: granja.granjero.regadera.descomp(),
        },
        catalogo: granja.catalogo,
        tipoCultivo: granja.tipoCultivo,
        semillaInicial: granja.semillaInicial,
        inventarioSemillas: granja.inventarioSemillas,
        parcelas: granja.parcelas.map(p => p ? {
            nombre: p.nombre,
            tiempoMadur: p.tiempoMadur,
            cantFrutos: p.cantFrutos,
            estado: p.estado,
            fechaSiembra: p.fechaSiembra
        } : null),
        frutosRecogidos: granja.frutosRecogidos
    };
}

function compHerram(obj) {
    const h = new Herramienta(obj.tipo, obj.precio, obj.usosMaxPorNivel ?? 10, 1);
    for (let i = 1; i < (obj.nivel ?? 1); i++)
        h.subirNivel();

    const desgaste = h.usosMax - obj.usos;
    
    for (let i = 0; i < desgaste; i++) 
        h.usar();
    
    return h;
}
 
function compGranjero(obj) {
    const g = new Granjero(obj.nombre, obj.dinero, obj.energia);
    
    for (let i = 1; i < (obj.azada.nivel ?? 1); i++)
        g.azada.subirNivel();
    for (let i = 0; i < g.azada.usosMax - obj.azada.usos; i++) 
        g.azada.usar();

    for (let i = 1; i < (obj.hoz.nivel ?? 1); i++)
        g.hoz.subirNivel();
    for (let i = 0; i < g.hoz.usosMax - obj.hoz.usos; i++) 
        g.hoz.usar();

    for (let i = 1; i < (obj.regadera.nivel ?? 1); i++)
        g.regadera.subirNivel();
    for (let i = 0; i < g.regadera.usosMax - obj.regadera.usos; i++) 
        g.regadera.usar();
  
    return g;
}
 
function compGranja(obj) {
    const granjero = compGranjero(obj.granjero);
    const g = new Granja(granjero, obj.catalogo || [], obj.tipoCultivo || 'm', obj.semillaInicial);

    obj.inventarioSemillas.forEach(sem => {
        const actual = g.inventarioSemillas.find(s => s.nombre === sem.nombre);
        if (actual)
            actual.cantidad = sem.cantidad;
        else
            g.sumsem(sem.nombre, sem.cantidad);
    });
 
    obj.parcelas.forEach((pObj, i) => {
        if (!pObj) 
            return;

        const p = new Planta(pObj.nombre, pObj.tiempoMadur, pObj.cantFrutos);
        
        if (pObj.estado !== 'inicial') {
            p.sembrar();
            if (pObj.fechaSiembra) 
                p.restaurarFecha(pObj.fechaSiembra);
            
            if (pObj.estado === 'madura' || pObj.estado === 'creciendo')
                p.forzarEstado(pObj.estado);    
        }

        g.parcelas[i] = p;
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