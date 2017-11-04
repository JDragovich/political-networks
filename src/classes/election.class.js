import { Uuid } from './uuid.class';

export class Election {
    constructor(){
        this.uuid = Uuid.createUuid();
        this.districts = [];
        this.candidates = [];
        this.moves = [];
    }
}
