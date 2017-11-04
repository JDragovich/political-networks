'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getElectionResults = exports.sampleDistrict = exports.createDistricts = exports.mapFromObject = exports.createGraph = exports.applyInfluence = exports.influenceNodes = exports.createLiveNetwork = exports.pollElection = exports.liveElection = undefined;

var _populationClass = require('../classes/population.class.js');

var _districtClass = require('../classes/district.class.js');

var _nodeClass = require('../classes/node.class.js');

var _playerUtils = require('../player-utils/player-utils.js');

// returns a new set of edges for a new node
// creates a structure that can be strinigified
// use createLiveNetwork to create network in memory
function barbasiAlbert(nodes, node, edges) {

    nodes.forEach(function (currentNode) {

        var probability = currentNode.connections.length / edges.length * 2;

        if (Math.random() < probability || isNaN(probability)) {

            edges.push({
                nodes: [currentNode.name, node.name],
                strength: probability
            });

            currentNode.connections.push(node.name);
            node.connections.push(currentNode.name);
        }
    });
}

function createLiveNetwork(nodeMap) {

    // naive search for node by name
    function findNode(nodes, name) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].name === name) {
                return nodes[i];
            }
        }
    }

    // instantiate live nodes
    var liveNodes = nodeMap.map(function (node) {
        var newNode = new _nodeClass.Node(node.name, node.issues);

        return newNode;
    });

    liveNodes.forEach(function (node, index) {
        nodeMap[index].connections.forEach(function (connection) {
            node.connections.push(findNode(liveNodes, connection));
        });
    });

    return liveNodes;
}

function liveElection(candidate) {
    var newNode = {};

    newNode.name = candidate.name;
    newNode.votes = candidate.votes;
    newNode.issues = mapFromObject(candidate.issues);

    return newNode;
}

function createGraph(numNodes) {

    var people = [];
    var connections = [];
    var totalPoluation = 0;

    for (var i = 0; i < numNodes; i++) {
        var population = Math.floor(Math.random() * 100000);
        totalPoluation += population;

        var newNode = { //stuuf
            name: 'Interest Group ' + i,
            connections: [],
            issues: {
                foo: Math.random(),
                bar: Math.random(),
                scub: Math.random()
            }
        };

        barbasiAlbert(people, newNode, connections);

        people.push(newNode);
    }

    return {
        nodes: people,
        edges: connections,
        totalPoluation: totalPoluation
    };
}

function mapFromObject(object) {
    var mapArray = [];

    for (var prop in object) {
        if (object.hasOwnProperty(prop)) {
            mapArray.push([prop, object[prop]]);
        }
    }

    return new Map(mapArray);
}

function influenceNodes(node) {
    node.changeMap = new Map(Array.from(node.issues.keys()).map(function (e) {
        return [e, 0];
    }));
    node.connections.forEach(function (connection) {
        /*
        for(let issue of node.issues.keys()){
            let modifier = node.population/connection.population < 100 ? node.population/connection.population : 100;
              let issueValue = connection.issues.get(issue) - ((connection.issues.get(issue) - node.issues.get(issue))/100) * modifier;
            connection.issues.set(issue,issueValue);
          }
        */

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = node.issues.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var issue = _step.value;

                if (connection.issues.get(issue) > node.issues.get(issue)) {
                    node.changeMap.set(issue, node.changeMap.get(issue) + .1);
                } else {
                    node.changeMap.set(issue, node.changeMap.get(issue) - .1);
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    });
};

function applyInfluence(node) {
    node.issues.forEach(function (value, key) {
        node.issues.set(key, (0, _playerUtils.shiftAndClip)(value, node.changeMap.get(key)));
    });
}

// create districts and link them to parent nodes.
function createDistricts(number, nodes) {
    var districts = [];
    for (var i = 0; i < number; i++) {
        districts.push(new _districtClass.District('District ' + i, nodes));
    }

    return districts;
}

function addIssue(issueName, issue, nodes, districts) {
    nodes.forEach(function (node) {
        node.issues.set(issueName, issue);
    });

    districts.forEach(function (district) {
        district.populations.forEach(function (population) {
            return poputation.addIssue(issue);
        });
    });
}

function pollElection(election) {
    var totalPopulation = election.districts.reduce(function (total, district) {
        return total + district.populations.reduce(function (current, population) {
            return current + population.population;
        }, 0);
    }, 0);

    var sampleSize = Math.round(totalPopulation / (1 + totalPopulation * Math.pow(0.05, 2)));

    var reality = getElectionResults(election);
    var realityArray = [];

    for (var uuid in reality) {
        if (reality.hasOwnProperty(uuid)) {
            realityArray.push({ uuid: uuid, votes: reality[uuid] });
        }
    }

    //returns the index of the array element that is the sume of the arithmetic sequence of the array elements.
    function findSample(array, sample) {
        var position = 0;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = array[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var element = _step2.value;

                position += element.votes;

                if (position >= sample) {
                    return element.uuid;
                }
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        return "none";
    }

    var samples = new Array(sampleSize).fill(0).map(function (e) {
        return Math.floor(Math.random() * totalPopulation);
    }).map(function (e) {
        return findSample(realityArray, e);
    }).reduce(function (current, uuid) {
        if (current[uuid]) {
            current[uuid]++;
        } else {
            current[uuid] = 1;
        }

        return current;
    }, {});
    console.log(samples);

    var _loop = function _loop(_uuid) {
        if (_uuid !== "none" && samples.hasOwnProperty(_uuid)) {
            console.log(_uuid !== null);
            election.candidates.find(function (e) {
                return e.uuid === _uuid;
            }).polling = samples[_uuid] / sampleSize;
        }
    };

    for (var _uuid in samples) {
        _loop(_uuid);
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

function sampleDistrict(district, candidates) {
    var totalPopulation = district.populations.reduce(function (current, population) {
        return current + population.population;
    }, 0);

    // Caluclate sample size with Slovin's formula
    // want it with 5% confidence interval
    var sampleSize = totalPopulation / (1 + totalPopulation * Math.pow(0.05, 2));

    //returns the index of the array element that is the sume of the arithmetic sequence of the array elements.
    function findSample(array, sample) {
        var position = 0;
        var index = 0;
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = array[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var element = _step3.value;

                position += element;

                if (position >= sample) {
                    return index;
                }

                index++;
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }

        return index;
    }

    var samplePosition = Math.round(Math.random() * totalPopulation);
    var sampleIndex = findSample(district.populations.map(function (e) {
        return e.population;
    }), samplePosition);
    var sample = district.populations[sampleIndex];

    var probabilityDistribution = (0, _playerUtils.softmax)(candidates.map(_playerUtils.issueDifference, sample)).map(function (e) {
        return 1 - e;
    });
    var candidateIndex = findSample(probabilityDistribution, Math.random());

    return candidates[candidateIndex].uuid;
}

function getElectionResults(election) {
    return election.districts.reduce(function (current, district) {
        var results = district.populations.map(function (e) {
            return (0, _playerUtils.determineVoteShare)(election.candidates, e);
        });

        return results.reduce(function (c, e) {
            e.forEach(function (d) {
                if (c[d.uuid]) {
                    c[d.uuid] += d.votes;
                } else {
                    c[d.uuid] = d.votes;
                }
            });

            return c;
        }, current);
    }, {});
}

exports.liveElection = liveElection;
exports.pollElection = pollElection;
exports.createLiveNetwork = createLiveNetwork;
exports.influenceNodes = influenceNodes;
exports.applyInfluence = applyInfluence;
exports.createGraph = createGraph;
exports.mapFromObject = mapFromObject;
exports.createDistricts = createDistricts;
exports.sampleDistrict = sampleDistrict;
exports.getElectionResults = getElectionResults;
//# sourceMappingURL=graph-utils.js.map
