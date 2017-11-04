import { Population } from './population.class.js';
import { Candidate } from './candidate.class.js';
import { Uuid } from './uuid.class.js';

// a district with
export class District {
    constructor(name, nodes){
        this.name = name;

        this.populations = nodes.map(element => {
            let population = Math.ceil(Math.random() * 100);

            return new Population(population,element);
        });

        this.candidates = [];
        this.promoteQueue = [];

        this.latestPolling = null;
    }

    promoteFromQueue(){
        this.populations.forEach(e => {
            e.promoteWithQueue(this.promoteQueue);
        });
    }

    addCandidate(player, candidate){

        if(this.candidates.find(e => e.name === candidate.name)){
            console.log("player already has a candidate in the race!");
            return;
        }
        this.candidates.push( candidate );
    }
}
