import { Uuid } from './uuid.class';

export class Candidate{
    constructor(name, player, issues){
        this.name = name;
        this.player = player;
        this.issues = new Map(issues.entries());
        this.running = false;
        this.polling = 0;
        this.uuid = Uuid.createUuid();
    }

}
