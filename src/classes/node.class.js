import {Uuid} from './uuid.class.js';

// a graph node representing the views of a particular population
export class Node {
    constructor(name, issues){
        this.name = name;
        this.issues = new Map();
        this.connections = [];
        this.population = 0;
        this.uuid = Uuid.createUuid();

        for(let issue in issues){
            if(issues.hasOwnProperty(issue)){
                this.issues.set(issue,issues[issue]);
            }
        }
    }

    get getTopFiveIssues(){
        if( this.issues.size > 5){
            return new Map(Array.from(this.issues.entries()).slice(0,5));
        }
        else{
            return this.issues;
        }
    }
}
