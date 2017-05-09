// returns a new set of edges for a new node
function barbasiAlbert(nodes, node, edges){

    nodes.forEach((currentNode)=>{

        let probability = currentNode.connections.length / edges.length * 2;

        if(Math.random() < probability || isNaN(probability)){
            edges.push({
                nodes:[currentNode, node],
                strength: probability
            });

            currentNode.connections.push(node);
            node.connections.push(currentNode);

        }

    });


}

// lifted softmax function
function softmax(arr) {
    return arr.map(function(value,index) {
      return Math.exp(value) / arr.map( function(y /*value*/){ return Math.exp(y) } ).reduce( function(a,b){ return a+b })
    })
}

function determineVoteShare(node,election){

    let differenceTotals = election.map(( current)=>{
        let total = 0;

        for(issue in node.issues){
            if(node.issues.hasOwnProperty(issue) && current.issues.hasOwnProperty(issue)){
                total += Math.abs(node.issues[issue] - current.issues[issue]);
            }
        }

        return total;
    });

    let totalDifference = differenceTotals.reduce((total,element)=>{
        return total + element
    },0);

    let percentageRawDifference = differenceTotals.reduce((total,element)=>{
        return total +  element/totalDifference
    },0);

    let percentageDifference = differenceTotals.map((element)=>{
        return totalDifference/element
    });

    // caculate voter turnout based on min difference
    // using tanh for a sigmoid function, cause why not, i just need to make an idelogical difference into a proportion of 1
    let turnout = node.population * (1 - Math.tanh(Math.min(...differenceTotals)));

    // console.log(`Turnout for ${node.name} was ${Math.floor((1 - Math.tanh(Math.min(...differenceTotals))) * 100)}%`);
    // distribute voter turnout by share
    softmax(percentageDifference).forEach((candidate, index)=>{
        election[index].votes += Math.floor(turnout * candidate);
        //console.log(`candidate ${election[index].name} received ${Math.floor(turnout * candidate)} (${Math.floor(100 * candidate)}%) votes from ${node.name}`)
    });

    return election;
};

function influenceNodes(node){
    node.connections.forEach((connection)=>{

        for(issue in node.issues){
            if(node.issues.hasOwnProperty(issue) && connection.issues.hasOwnProperty(issue)){

                if(!isNaN(connection.issues[issue]) && !isNaN(node.issues[issue])){
                    let modifier = node.population/connection.population < 100 ? node.population/connection.population : 100;

                    connection.issues[issue] -= ((connection.issues[issue] - node.issues[issue])/100) * modifier;


                }

            }

        }
    });
};

//make a distribution of nodes based on average of issues
function sortNodes(bins, node){
    let total = 0;
    let numIssues = 0;

    for(issue in node.issues){
        if(node.issues.hasOwnProperty(issue)){
            total += node.issues[issue];
            numIssues++;
        }
    }

    let binNumber = (total/numIssues).toFixed(1);

    if(bins[binNumber]){
        bins[binNumber]++
    }
    else{
        bins[binNumber] = 1
    }

    return bins;
}

let people = [];
let connections= [];
let totalPoluation = 0;

for(let i=0; i<1000; i++){
    let population = Math.floor(Math.random()*100000);
    totalPoluation += population;

    let newNode = {
        name:`Interest Group ${i}`,
        connections:[],
        population:population,
        issues:{
            foo:Math.random(),
            bar:Math.random(),
            scub:Math.random()
        }
    };

    barbasiAlbert(people, newNode, connections);

    people.push(newNode);
}

console.log(people.length);
console.log(connections.length);
console.log(totalPoluation);

let electionRaw = [
    {
        name:"moderate",
        issues:{
            foo:.5,
            bar:.5,
            scub:.5
        },
        votes:0
    },
    {
        name:"extreme",
        issues:{
            foo:1,
            bar:1,
            scub:1
        },
        votes:0
    },
    {
        name:"extreme otherway",
        issues:{
            foo:0,
            bar:0,
            scub:0
        },
        votes:0
    }
    ,
    {
        name:"moderate 2",
        issues:{
            foo:0.4,
            bar:0.6,
            scub:0.3
        },
        votes:0
    }
]

for(let j = 0; j < 1000; j++){
    people.forEach(influenceNodes);
}

let electionTotals = people.reduce((election,currentNode)=>{
    return determineVoteShare(currentNode,election)
},electionRaw);

console.log(electionTotals);
console.log(electionTotals.reduce((total, candidate)=>{
    return total + candidate.votes;
},0));

let histogram = people.reduce(sortNodes,{});
console.log(histogram);
