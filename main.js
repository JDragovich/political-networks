// returns a new set of edges for a new node
// creates a structure that can be strinigified
// use createLiveNetwork to create network in memory
function barbasiAlbert(nodes, node, edges){

    nodes.forEach((currentNode)=>{

        let probability = currentNode.connections.length / edges.length * 2;

        if(Math.random() < probability || isNaN(probability)){
            edges.push({
                nodes:[currentNode.name, node.name],
                strength: probability
            });

            currentNode.connections.push(node.name);
            node.connections.push(currentNode.name);


        }

    });


}

function createLiveNetwork(nodeMap){

    // naive search for node by name
    function findNode(nodes, name){
        for(let i=0; i < nodes.length; i++){
            if(nodes[i].name === name){
                return nodes[i];
            }
        }
    }

    // instantiate live nodes
    let liveNodes = nodeMap.map((node)=>{
        let newNode = {};

        newNode.name = node.name;
        newNode.population = node.population;

        newNode.issues = new Map();

        for(let issue in node.issues){
            if(node.issues.hasOwnProperty(issue)){
                newNode.issues.set(issue,node.issues[issue]);
            }
        }

        newNode.connections = [];

        return newNode;
    });

    liveNodes.forEach((node, index)=>{
        nodeMap[index].connections.forEach((connection)=>{
            node.connections.push(findNode(liveNodes,connection));
        });
    });

    return liveNodes;

}

function liveElection(candidate){
    let newNode = {};

    newNode.name = candidate.name;
    newNode.votes = candidate.votes;
    newNode.issues = mapFromObject(candidate.issues);

    return newNode;
}

// lifted softmax function
function softmax(arr) {
    return arr.map(function(value,index) {
      return Math.exp(value) / arr.map( function(y /*value*/){ return Math.exp(y) } ).reduce( function(a,b){ return a+b })
    })
}

function determineVoteShare(node,election){

    let differenceTotals = election.map((current)=>{
        let total = 0;

        for(let issue of node.issues.keys()){
            if(node.issues.has(issue) && current.issues.has(issue)){
                total += Math.abs(node.issues.get(issue) - current.issues.get(issue));
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

        for(issue of node.issues.keys()){
            let modifier = node.population/connection.population < 100 ? node.population/connection.population : 100;

            let issueValue = connection.issues.get(issue) - ((connection.issues.get(issue) - node.issues.get(issue))/100) * modifier;
            connection.issues.set(issue,issueValue);

        }
    });
};

// simple campaign function where changes propogate through the network
// influence willbounce around with diminishing returns until its less than 0.001
function campaignOnNode(issue, amount){

    return function(node){
        shiftAndClip(node.issues.get(issue), amount);

        // console.log(`campaigning on node ${node.name} by ${amount}. Now ${node.issues.get(issue)}`);

        let newAmount = amount / 2;

        if(newAmount > 0.1){
            node.connections.forEach(campaignOnNode(issue, newAmount));
        }
    }

}

// change node issue vlaues but clips values between 0 and 1
function shiftAndClip(base, shift){
    base += shift;

    if(base > 1){
        base = 1;
    }

    if( base < 0){
        base = 0;
    }

    return base;
}

//make a distribution of nodes based on average of issues
function sortNodes(bins, node){
    let total = 0;
    let numIssues = 0;
    let decimalPlaces = Math.log10(bins.size);


    for(issue of node.issues.keys()){
        total += node.issues.get(issue);
        numIssues++;
    }

    let binNumber = (total/numIssues).toFixed(decimalPlaces);

    if(bins.has(binNumber)){
        bins.set(binNumber,bins.get(binNumber) + 1);
    }
    else{
        bins.set(binNumber, 1);
    }

    return bins;
}

function createRange(split){
    let newMap = new Map();

    for(let i =0; i<=1; i+= 1/split){
        newMap.set(i.toFixed(Math.log10(split)), 0);
    }

    return newMap;
}

function histogramHashmapToArray(bins){
    let binArray = [];

    for(let bin of bins.keys()){
        binArray.push({
            key:bin,
            keyString:bin.toString(),
            value:bins.get(bin)
        })
    }

    return binArray;
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

console.log(totalPoluation);

function mapFromObject(object){
    let mapArray = [];

    for(prop in object){
        if(object.hasOwnProperty(prop)){
            mapArray.push([prop,object[prop]]);
        }
    }

    return new Map(mapArray);
}

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
    },
    {
        name:"moderate 2",
        issues:{
            foo:0.5,
            bar:0.5,
            scub:0.55
        },
        votes:0
    },
    {
        name:"Leans skub",
        issues:{
            foo:0.5,
            bar:0.5,
            scub:0.85
        },
        votes:0
    },
    {
        name:"pro-Scub",
        issues:{
            foo:0.5,
            bar:0.5,
            scub:1
        },
        votes:0
    }
];
console.log(electionRaw.map(liveElection));
let population1 = createLiveNetwork(people);
let population2 = createLiveNetwork(people);
let population3 = createLiveNetwork(people);
let population4 = createLiveNetwork(people);
let population5 = createLiveNetwork(people);

let candidates1 = electionRaw.map(liveElection);
let candidates2 = electionRaw.map(liveElection);
let candidates3 = electionRaw.map(liveElection);
let candidates4 = electionRaw.map(liveElection);
let candidates5 = electionRaw.map(liveElection);

// collect elections for graphing
let elections = [];

console.log("%c Raw population: election with bare network", 'background: #222; color: #bada55');

let electionTotals1 = population1.reduce((election,currentNode)=>{
    return determineVoteShare(currentNode,election)
},candidates1);

console.log(electionTotals1);
elections.push({
    histogram:histogramHashmapToArray(population1.reduce(sortNodes,createRange(100))).sort((a,b)=> a.key>b.key ),
    electionTotals:[{
        key:"Raw population: election with bare network",
        values:electionTotals1
    }]
});

console.log("%c Raw population: election with bare network after campaigning on a single node", 'background: #222; color: #bada55');

let selectedNode1 = Math.floor(Math.random() * population4.length);

campaignOnNode("scub", 1)(population4[selectedNode1]);

let electionTotals4 = population4.reduce((election,currentNode)=>{
    return determineVoteShare(currentNode,election)
},candidates4);

console.log(electionTotals4);
elections.push({
    histogram:histogramHashmapToArray(population4.reduce(sortNodes,createRange(100))).sort((a,b)=> a.key>b.key ),
    electionTotals:[{
        key:"Raw population: election with bare network after campaigning on a single node",
        values:electionTotals4
    }]
});

console.log("%c after 10 weeks of node influencing one another", 'background: #222; color: #bada55');

for(let j = 0; j < 10; j++){
    population2.forEach(influenceNodes);
}

let electionTotals2 = population2.reduce((election,currentNode)=>{
    return determineVoteShare(currentNode,election);
},candidates2);

console.log(electionTotals2);

elections.push({
    histogram:histogramHashmapToArray(population2.reduce(sortNodes,createRange(100))).sort((a,b)=> a.key>b.key ),
    electionTotals:[{
        key:"after 10 weeks of node influencing one another",
        values:electionTotals2
    }]
});


console.log("%c after 10 weeks of campaigning on the top 25% random nodes", 'background: #222; color: #bada55');

let top25 = population3.sort((a,b)=> a.connections.length > b.connections.length).slice(0,Math.floor(population3.length/2));

for(let j = 0; j < 10; j++){
    top25.forEach(campaignOnNode("scub", 1));
    population3.forEach(influenceNodes);
}

let electionTotals3 = population3.reduce((election,currentNode)=>{
    return determineVoteShare(currentNode,election);
},candidates3);

console.log(electionTotals3);
elections.push({
    histogram:histogramHashmapToArray(population3.reduce(sortNodes,createRange(100))).sort((a,b)=> a.key>b.key ),
    electionTotals:[{
        key:"after 10 weeks of campaigning on the top 50% random nodes",
        values:electionTotals3
    }]
});

console.log("%c after 10 weeks of influencing when 25% of the nodes are scub extreamists", 'background: #222; color: #bada55');

let skubExtreamists = population5.slice(0,Math.floor(population5.length / 2));
skubExtreamists.forEach((node)=>{
    node.issues.scub = 1;
});

for(let j = 0; j < 10; j++){
    population5.forEach(influenceNodes);
}

let electionTotals5 = population5.reduce((election,currentNode)=>{
    return determineVoteShare(currentNode,election);
},candidates5);

console.log(electionTotals5);
elections.push({
    histogram:histogramHashmapToArray(population5.reduce(sortNodes,createRange(100))).sort((a,b)=> a.key>b.key ),
    electionTotals:[{
        key:"after 10 weeks of influencing when 50% of the nodes are scub extremists",
        values:electionTotals5
    }]
});


let histogram = histogramHashmapToArray(population3.reduce(sortNodes,createRange(100))).sort((a,b)=> a.key>b.key );

nv.addGraph(function() {
  var chart = nv.models.discreteBarChart()
      .x(function(d) { return d.name })    //Specify the data accessors.
      .y(function(d) { return d.votes })
      .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
      .tooltips(false)        //Don't show tooltips
      .showValues(true)       //...instead, show the bar value right on top of each bar.
      //.transitionDuration(350)
      ;

let histogramChart = nv.models.historicalBarChart()
                .x(function(d) { return d.key })    //Specify the data accessors.
                .y(function(d) { return d.value })
                .forceX([0,1]);

let graphs = d3.select('#graph-container')
        .selectAll("svg")
      .data(elections)
      .enter()
      .append("div");

graphs.append("H1")
      .datum(function(d){
          return d.electionTotals
      })
      .text(function(d){
          return d[0].key;
      });

graphs.append("svg")
        .attr("height",200)
        .datum(function(d){
            return d.electionTotals
        })
      .call(chart);

graphs.append("svg")
    .attr("height",200)
    .datum(function(d){
        return[{
            key:d.electionTotals.key,
            values:d.histogram
        }]
    })
    .call(histogramChart);

  nv.utils.windowResize(chart.update);
  nv.utils.windowResize(histogramChart.update);

  return chart;
});
