const URL_XML = "../datos/tienda.xml";

export const filtrosXPath = {
    todos: "//semilla",
    vegetal: "//semilla[tipo='Vegetal']",
    frutal: "//semilla[tipo='Frutal']",
    premium: "//semilla[tipo='Premium']",
    "precio-asc": "//semilla",
    "precio-desc": "//semilla",
    "tiempo-asc": "//semilla",
    "tiempo-desc": "//semilla",
    "benef-asc": "//semilla",
    "benef-desc": "//semilla"
};

async function obtenerXML() {
    const response = await fetch(URL_XML);
    const text = await response.text();
    return new DOMParser().parseFromString(text, "text/xml");
}
 
function evaluarXPath(xmlDoc, xpath) {
    return xmlDoc.evaluate(xpath, xmlDoc, null, XPathResult.ANY_TYPE, null);
}
 
export async function cargarSem(xpath) {
    const xmlDoc = await obtenerXML();
    const result = evaluarXPath(xmlDoc, xpath);
 
    let node;
    const semillas = [];
    while ((node = result.iterateNext())) {
        semillas.push({
            nombre: node.querySelector("nombre").textContent.trim(),
            tipo: node.querySelector("tipo").textContent.trim(),
            precio: parseFloat(node.querySelector("precio").textContent),
            tiempoCrec: parseFloat(node.querySelector("tiempoCrec").textContent),
            beneficio: parseFloat(node.querySelector("beneficio").textContent)
        });
    }
    return semillas;
}

export async function cargarHerNivel(codigoNivel) {
    const xmlDoc = await obtenerXML();
    const xpath = `//herramienta[nivel/@codigo='${codigoNivel}']`;
    const result = evaluarXPath(xmlDoc, xpath);
 
    let node;
    const herramientas = [];
    while ((node = result.iterateNext())) {
        herramientas.push({
            denominacion: node.querySelector("denominacion").textContent.trim(),
            coste: parseFloat(node.querySelector("coste").textContent),
            usos: parseFloat(node.querySelector("usos").textContent),
            nivel: node.querySelector("nivel").textContent.trim(),
            accion: node.querySelector("accion").textContent.trim()
        });
    }
    return herramientas;
}
 

export function aplicarOrden(semillas, filtro) {
    const s = [...semillas];
    const criterios = {
        "precio-asc": (a, b) => a.precio - b.precio,
        "precio-desc": (a, b) => b.precio - a.precio,
        "tiempo-asc": (a, b) => a.tiempoCrec - b.tiempoCrec,
        "tiempo-desc": (a, b) => b.tiempoCrec - a.tiempoCrec,
        "benef-asc": (a, b) => a.beneficio - b.beneficio,
        "benef-desc": (a, b) => b.beneficio - a.beneficio
    };

    if (criterios[filtro])
        s.sort(criterios[filtro]);
    return s;
}

export function filtrarTipo(semillas, tipoCultivo) {
    if (tipoCultivo === 'v') 
        return semillas.filter(s => s.tipo === 'Vegetal');
    if (tipoCultivo === 'f')
        return semillas.filter(s => s.tipo === 'Frutal');
    return semillas.filter(s => s.tipo === 'Vegetal' || s.tipo === 'Frutal');
}