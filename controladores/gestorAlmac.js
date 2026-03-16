import Granja from "../clases_objeto/Granja";

export const saveObject = function (item) {
    localStorage.setItem("granja", JSON.stringify(item));
}

export const loadObject = function () {
    return Object.assign(new Granja, JSON.parse(localStorage.getItem("granja")));
}