import * as graphUtils from '../graph-utils/graph-utils.js';

function test(arg){
    return `this si what I passed to the function: ${arg}`;
}

// generate a new game state
function newGameState(numNodes, numDistricts , numPlayers){
    let gameState = {};

    let graph = graphUtils.createGraph(numNodes);

    gameState.nodes = graphUtils.createLiveNetwork(graph.nodes);
    gameState.districts = graphUtils.createDistricts(numDistricts, gameState.nodes);
    gameState.players = [];
    gameState.week = 0;
    gameState.nextElection = 12;
    gameState.chanceOfEvent = .001;
    gameState.currentPlayerIndex = 0;


    for(let i=0; i<numPlayers; i++){
        gameState.players.push({
            name: `player ${i}`,
            money:10000,
            type:'human'
        });
    }

    return gameState;

}

// progress the game by one week
function nextWeek(gameState){

    if(gameState.chanceOfEvent > Math.random()){
        // add an issue here.
    }

    gameState.nodes.forEach(graphUtils.influenceNodes);

    gameState.week++;
    if(gameState.week === gameState.nextElection){

    }

    return gameState;
}

function nextTurn(gameState){
    console.log("clicked");
    if( gameState.currentPlayerIndex === gameState.players.length - 1){
        nextWeek(gameState);
        gameState.currentPlayerIndex = 0;
    }
    else{
        gameState.currentPlayerIndex++;
    }

    return gameState;
}

function addCandidate(district, candidate){
    district.candidates.push(candidate);
}

function generateCandidates(palyer,district,number){
    let seeds = new Array(number).fill(0).map(e=>Math.floor(Math.random()));

    return seeds.map((seed,index)=>{
        let issues = new Map(district.populations[seed].node.issues.entries)

        return new Candidate(`candidate ${index}`, player, issues);
    });
}

function getCurrentPlayer(game){
    console.log(game);
    return game.players[game.currentPlayerIndex];
}



export { newGameState, test, nextTurn, addCandidate, generateCandidates, getCurrentPlayer };
