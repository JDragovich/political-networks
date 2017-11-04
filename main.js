import * as graphUtils from './src/graph-utils/graph-utils.js' ;
import * as analyticsTools from './src/analytics-tools/analytics-tools.js';
import * as playerUtils from './src/player-utils/player-utils.js';

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

let graph = graphUtils.createGraph(1000);
let liveNetwork = graphUtils.createLiveNetwork(graph.nodes);
let districts = graphUtils.createDistricts(10,liveNetwork);
console.log(liveNetwork);



let population1 = graphUtils.createLiveNetwork(graph.nodes);
let population2 = graphUtils.createLiveNetwork(graph.nodes);
let population3 = graphUtils.createLiveNetwork(graph.nodes);
let population4 = graphUtils.createLiveNetwork(graph.nodes);
let population5 = graphUtils.createLiveNetwork(graph.nodes);
let population6 = graphUtils.createLiveNetwork(graph.nodes);

let candidates1 = electionRaw.map(graphUtils.liveElection);
let candidates2 = electionRaw.map(graphUtils.liveElection);
let candidates3 = electionRaw.map(graphUtils.liveElection);
let candidates4 = electionRaw.map(graphUtils.liveElection);
let candidates5 = electionRaw.map(graphUtils.liveElection);
let candidates6 = electionRaw.map(graphUtils.liveElection);

// collect elections for graphing
let elections = [];

console.log("%c Raw population: election with bare network", 'background: #222; color: #bada55');
let electionTotals1 = population1.map(element => {element.population = 1000; return element;}).reduce(playerUtils.determineVoteShare,candidates1);

console.log(electionTotals1);
elections.push({
    histogram:analyticsTools.histogramHashmapToArray(population1.reduce(analyticsTools.sortNodes,analyticsTools.createRange(100))).sort((a,b)=> a.key>b.key ),
    electionTotals:[{
        key:"Raw population: election with bare network",
        values:electionTotals1
    }]
});

console.log("%c Raw population: election with bare network after campaigning on a single node", 'background: #222; color: #bada55');

let selectedNode1 = Math.floor(Math.random() * population4.length);

playerUtils.campaignOnNode("scub", 1)(population4[selectedNode1]);

let electionTotals4 = population4.map(element => {element.population = 1000; return element;}).reduce(playerUtils.determineVoteShare,candidates4);

console.log(electionTotals4);
elections.push({
    histogram:analyticsTools.histogramHashmapToArray(population4.reduce(analyticsTools.sortNodes,analyticsTools.createRange(100))).sort((a,b)=> a.key>b.key ),
    electionTotals:[{
        key:"Raw population: election with bare network after campaigning on a single node",
        values:electionTotals4
    }]
});

console.log("%c after 10 weeks of node influencing one another", 'background: #222; color: #bada55');

for(let j = 0; j < 10; j++){
    population2.forEach(graphUtils.influenceNodes);
    population2.forEach(graphUtils.applyInfluence);
}

let electionTotals2 = population2.map(element => {element.population = 1000; return element;}).reduce(playerUtils.determineVoteShare,candidates2);

console.log(electionTotals2);

elections.push({
    histogram:analyticsTools.histogramHashmapToArray(population2.reduce(analyticsTools.sortNodes,analyticsTools.createRange(100))).sort((a,b)=> a.key>b.key ),
    electionTotals:[{
        key:"after 10 weeks of node influencing one another",
        values:electionTotals2
    }]
});


console.log("%c after 10 weeks of campaigning on the top 50% random nodes ", 'background: #222; color: #bada55');

let top25 = population3.sort((a,b)=> a.connections.length > b.connections.length).slice(0,Math.floor(population3.length/2));

for(let j = 0; j < 10; j++){
    top25.forEach(playerUtils.campaignOnNode("scub", .2));
    population3.forEach(graphUtils.influenceNodes);
    population3.forEach(graphUtils.applyInfluence);
}

let electionTotals3 = population3.map(element => {element.population = 1000; return element;}).reduce(playerUtils.determineVoteShare,candidates3);

console.log(electionTotals3);
elections.push({
    histogram:analyticsTools.histogramHashmapToArray(population3.reduce(analyticsTools.sortNodes,analyticsTools.createRange(100))).sort((a,b)=> a.key>b.key ),
    electionTotals:[{
        key:"after 3 weeks of campaigning on the top 50% random nodes. here is a change I made!",
        values:electionTotals3
    }]
});

console.log("%c after 10 weeks of influencing when 25% of the nodes are scub extreamists", 'background: #222; color: #bada55');

let skubExtreamists = population5.slice(0,Math.floor(population5.length / 2));
skubExtreamists.forEach((node)=>{
    node.issues.scub = 1;
});

for(let j = 0; j < 10; j++){
    population5.forEach(graphUtils.influenceNodes);
    population5.forEach(graphUtils.applyInfluence);
}

let electionTotals5 = population5.map(element => {element.population = 1000; return element;}).reduce(playerUtils.determineVoteShare,candidates5);

console.log(electionTotals5);
elections.push({
    histogram:analyticsTools.histogramHashmapToArray(population5.reduce(analyticsTools.sortNodes,analyticsTools.createRange(100))).sort((a,b)=> a.key>b.key ),
    electionTotals:[{
        key:"after 3 weeks of influencing when 50% of the nodes are scub extremists.",
        values:electionTotals5
    }]
});

console.log("%c campaign on nodes that already agree with scub", 'background: #222; color: #bada55');

let skubSupporters = population6.filter( node => node.issues.get('scub') > .75);
console.log(`there are ${skubSupporters.length} node that already support Skub`);

for(let j = 0; j < 10; j++){
    skubSupporters.forEach(playerUtils.campaignOnNode("scub", .2));
    population6.forEach(graphUtils.influenceNodes);
    population6.forEach(graphUtils.applyInfluence);
}

let electionTotals6 = population6.map(element => {element.population = 1000; return element;}).reduce(playerUtils.determineVoteShare,candidates6);

console.log(electionTotals6);
elections.push({
    histogram:analyticsTools.histogramHashmapToArray(population6.reduce(analyticsTools.sortNodes,analyticsTools.createRange(100))).sort((a,b)=> a.key>b.key ),
    electionTotals:[{
        key:"Campaign on nodes that already agree with scub",
        values:electionTotals6
    }]
});


let histogram = analyticsTools.histogramHashmapToArray(population3.reduce(analyticsTools.sortNodes,analyticsTools.createRange(100))).sort((a,b)=> a.key>b.key );

nv.addGraph(function() {
  var chart = nv.models.discreteBarChart()
                       .x(function(d) { return d.name })
                       .y(function(d) { return d.votes })
                       .staggerLabels(true)
                       .tooltips(false)
                       .showValues(true)
                       ;

let histogramChart = nv.models.historicalBarChart()
                              .x(function(d) { return d.key })
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
