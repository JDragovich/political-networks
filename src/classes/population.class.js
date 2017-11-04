//population within a district
export class Population {
    
    constructor(population, element){
        this.population = population;
        this.element = element;
        this.issues = new Map();

        for(let key of element.issues.keys()){
            this.issues.set(key, this.issues.size);
        };

        this.element.population += population;
    }

    get topThreeIssues(){
        let topThree = this.issues.entries().sort(a,b => a[1]>b[1]).slice(0,2);

        return new Map(topThree);
    }

    addIssue(issue) {
        let entries = Array.from(this.issues.entries()).map(issue => [issue[0], issue[1]++]);

        entries.unshift([issue,0]);

        this.issues = new Map(entries);
    }

    promoteWithQueue(queue){
        let originalIssueOrder = Array.from(this.issues.keys()).reverse();

        for(let issue of originalIssueOrder){

            if(queue.some(e => e === issue)){

                console.log(`promoting ${issue}`);
                
                let jumps = queue.filter(e => e === issue).length;
                this.promoteIssue(issue, jumps);
                
                queue = queue.filter(e => e !== issue);
            }

        }
        
    }

    promoteIssue(issue, places = 1) {
        let oldPosition = this.issues.get(issue);
        let newPosition = oldPosition + places;

        this.issues.forEach(issue =>{
            if(issue >= newPosition && issue < oldPosition){
                return issue++;
            }
            else{
                return issue;
            }
        });

        this.issues.set(issue, newPosition);
    }
}
