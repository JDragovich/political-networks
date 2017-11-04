'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getCurrentPlayer = exports.generateCandidates = exports.addCandidate = exports.nextTurn = exports.test = exports.newGameState = undefined;

var _graphUtils = require('../graph-utils/graph-utils.js');

var graphUtils = _interopRequireWildcard(_graphUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function test(arg) {
    return 'this si what I passed to the function: ' + arg;
}

// generate a new game state
function newGameState(numNodes, numDistricts, numPlayers) {
    var gameState = {};

    var graph = graphUtils.createGraph(numNodes);

    gameState.nodes = graphUtils.createLiveNetwork(graph.nodes);
    gameState.districts = graphUtils.createDistricts(numDistricts, gameState.nodes);
    gameState.players = [];
    gameState.week = 0;
    gameState.nextElection = 12;
    gameState.chanceOfEvent = .001;
    gameState.currentPlayerIndex = 0;

    for (var i = 0; i < numPlayers; i++) {
        gameState.players.push({
            name: 'player ' + i,
            money: 10000,
            type: 'human'
        });
    }

    return gameState;
}

// progress the game by one week
function nextWeek(gameState) {

    if (gameState.chanceOfEvent > Math.random()) {
        // add an issue here.
    }

    gameState.nodes.forEach(graphUtils.influenceNodes);

    gameState.week++;
    if (gameState.week === gameState.nextElection) {}

    return gameState;
}

function nextTurn(gameState) {
    console.log("clicked");
    if (gameState.currentPlayerIndex === gameState.players.length - 1) {
        nextWeek(gameState);
        gameState.currentPlayerIndex = 0;
    } else {
        gameState.currentPlayerIndex++;
    }

    return gameState;
}

function addCandidate(district, candidate) {
    district.candidates.push(candidate);
}

function generateCandidates(palyer, district, number) {
    var seeds = new Array(number).fill(0).map(function (e) {
        return Math.floor(Math.random());
    });

    return seeds.map(function (seed, index) {
        var issues = new Map(district.populations[seed].node.issues.entries);

        return new Candidate('candidate ' + index, player, issues);
    });
}

function getCurrentPlayer(game) {
    console.log(game);
    return game.players[game.currentPlayerIndex];
}

exports.newGameState = newGameState;
exports.test = test;
exports.nextTurn = nextTurn;
exports.addCandidate = addCandidate;
exports.generateCandidates = generateCandidates;
exports.getCurrentPlayer = getCurrentPlayer;
//# sourceMappingURL=game.js.map
