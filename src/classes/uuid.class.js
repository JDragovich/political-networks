export class Uuid {
    constructor(){}

    static createUuid(){ 
        return new Array(15).fill(0).map(e => Math.ceil(Math.random() * 16).toString(16)).join("");
    }
}
