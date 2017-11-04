import { Population } from '../classes/population.class.js';
import { District } from '../classes/district.class.js';
import { Node } from '../classes/node.class.js';

import { softmax, issueDifference, shiftAndClip, determineVoteShare } from '../player-utils/player-utils.js';


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
        let newNode = new Node(node.name, node.issues);

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

function createGraph(numNodes){

    let people = [];
    let connections= [];
    let totalPoluation = 0;

    for(let i=0; i<numNodes; i++){
        let population = Math.floor(Math.random()*100000);
        totalPoluation += population;

        let newNode = { //stuuf
            name:`Interest Group ${i}`,
            connections:[],
            issues:{
                foo:Math.random(),
                bar:Math.random(),
                scub:Math.random()
            }
        };

        barbasiAlbert(people, newNode, connections);

        people.push(newNode);
    }

    return {
        nodes:people,
        edges:connections,
        totalPoluation:totalPoluation
    }
}

function mapFromObject(object){
    let mapArray = [];

    for(let prop in object){
        if(object.hasOwnProperty(prop)){
            mapArray.push([prop,object[prop]]);
        }
    }

    return new Map(mapArray);
}

function influenceNodes(node){
    node.changeMap = new Map(Array.from(node.issues.keys()).map(e => [e,0]));
    node.connections.forEach((connection)=>{
        /*
        for(let issue of node.issues.keys()){
            let modifier = node.population/connection.population < 100 ? node.population/connection.population : 100;

            let issueValue = connection.issues.get(issue) - ((connection.issues.get(issue) - node.issues.get(issue))/100) * modifier;
            connection.issues.set(issue,issueValue);

        }
        */

        for(let issue of node.issues.keys()){
            if(connection.issues.get(issue) > node.issues.get(issue)){
                node.changeMap.set(issue, node.changeMap.get(issue) + .1);
            }
            else{
                node.changeMap.set(issue, node.changeMap.get(issue) - .1);
            }
        }
    });
};

function applyInfluence(node){
    node.issues.forEach((value, key)=>{
        node.issues.set(key, shiftAndClip(value, node.changeMap.get(key)));
    });
}

// create districts and link them to parent nodes.
function createDistricts(number, nodes) {
    let districts = [];
    for(let i = 0; i<number; i++){
        districts.push(new District(`District ${i}`, nodes));
    }

    return districts;
}

function addIssue(issueName, issue, nodes, districts){
    nodes.forEach(node=>{
        node.issues.set(issueName,issue);
    });

    districts.forEach(district=>{
        district.populations.forEach(population => poputation.addIssue(issue));
    })
}

function pollElection(election){
    let totalPopulation = election.districts.reduce((total, district)=>{
        return total + district.populations.reduce((current, population) => current + population.population ,0);
    },0);

    let sampleSize = Math.round(totalPopulation / (1 + totalPopulation * Math.pow(0.05, 2)));

    let reality = getElectionResults(election);
    let realityArray = [];

    for(let uuid in reality){
        if(reality.hasOwnProperty(uuid)){
            realityArray.push({uuid:uuid, votes:reality[uuid]});
        }
    }

    //returns the index of the array element that is the sume of the arithmetic sequence of the array elements.
    function findSample(array, sample){
        let position = 0;
        for(let element of array){
            position += element.votes;

            if(position >= sample){
                return element.uuid;
            }

        }

        return "none";
    }

    let samples = new Array(sampleSize).fill(0)
                                       .map(e => Math.floor(Math.random() * totalPopulation))
                                       .map(e => findSample(realityArray,e))
                                       .reduce((current,uuid) => {
                                            if(current[uuid]){
                                                current[uuid]++;
                                            }
                                            else{
                                                current[uuid] = 1;
                                            }
                                            
                                            return current;
                                        }, {});
                                        console.log(samples);
    for(let uuid in samples){
        if(uuid !== "none" && samples.hasOwnProperty(uuid)){
            console.log(uuid !== null);
            election.candidates.find(e => e.uuid === uuid).polling = (samples[uuid]/sampleSize);
        }
    }
    /*
    let samples =  new Array(sampleSize).fill(0)
                                        .map(e => Math.floor(Math.random() * election.districts.length))
                                        .map(e => {
                                            return sampleDistrict(election.districts[e], election.candidates);
                                        })
                                        .reduce((current,uuid) => {
                                            if(current[uuid]){
                                                current[uuid]++;
                                            }
                                            else{
                                                current[uuid] = 1;
                                            }
                                            
                                            return current;
                                        }, {});

    for(let uuid in samples){
        if(samples.hasOwnProperty(uuid)){
            console.log(uuid);
            election.candidates.find(e => e.uuid === uuid).polling = (samples[uuid]/sampleSize);
        }
    }
    */
}

function sampleDistrict(district, candidates){
    let totalPopulation = district.populations.reduce((current, population) => current + population.population ,0);

    // Caluclate sample size with Slovin's formula
    // want it with 5% confidence interval
    let sampleSize = totalPopulation / (1 + totalPopulation * Math.pow(0.05, 2));

    //returns the index of the array element that is the sume of the arithmetic sequence of the array elements.
    function findSample(array, sample){
        let position = 0;
        let index = 0;
        for(let element of array){
            position += element;

            if(position >= sample){
                return index;
            }

            index++;
        }

        return index;
    }

    let samplePosition = Math.round(Math.random() * totalPopulation);
    let sampleIndex = findSample(district.populations.map(e => e.population), samplePosition);
    let sample = district.populations[sampleIndex];

    let probabilityDistribution = softmax(candidates.map(issueDifference,sample)).map(e => 1 - e);
    let candidateIndex = findSample(probabilityDistribution, Math.random());

    return candidates[candidateIndex].uuid;

}

function getElectionResults(election){
    return election.districts.reduce((current, district) => {
        let results = district.populations.map(e => determineVoteShare(election.candidates,e))

        return results.reduce((c,e)=>{
            e.forEach(d => {
                if(c[d.uuid]){
                    c[d.uuid] += d.votes;
                }
                else{
                    c[d.uuid] = d.votes;
                }
            });

            return c;
        },current)
    }, {});
}

export { liveElection, 
         pollElection, 
         createLiveNetwork, 
         influenceNodes, 
         applyInfluence, 
         createGraph, 
         mapFromObject, 
         createDistricts, 
         sampleDistrict, 
         getElectionResults };
