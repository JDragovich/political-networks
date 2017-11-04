(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _graphUtils = require('./src/graph-utils/graph-utils.js');

var graphUtils = _interopRequireWildcard(_graphUtils);

var _analyticsTools = require('./src/analytics-tools/analytics-tools.js');

var analyticsTools = _interopRequireWildcard(_analyticsTools);

var _playerUtils = require('./src/player-utils/player-utils.js');

var playerUtils = _interopRequireWildcard(_playerUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var electionRaw = [{
    name: "moderate",
    issues: {
        foo: .5,
        bar: .5,
        scub: .5
    },
    votes: 0
}, {
    name: "extreme",
    issues: {
        foo: 1,
        bar: 1,
        scub: 1
    },
    votes: 0
}, {
    name: "extreme otherway",
    issues: {
        foo: 0,
        bar: 0,
        scub: 0
    },
    votes: 0
}, {
    name: "moderate 2",
    issues: {
        foo: 0.5,
        bar: 0.5,
        scub: 0.55
    },
    votes: 0
}, {
    name: "Leans skub",
    issues: {
        foo: 0.5,
        bar: 0.5,
        scub: 0.85
    },
    votes: 0
}, {
    name: "pro-Scub",
    issues: {
        foo: 0.5,
        bar: 0.5,
        scub: 1
    },
    votes: 0
}];

var graph = graphUtils.createGraph(1000);
var liveNetwork = graphUtils.createLiveNetwork(graph.nodes);
var districts = graphUtils.createDistricts(10, liveNetwork);
console.log(liveNetwork);

var population1 = graphUtils.createLiveNetwork(graph.nodes);
var population2 = graphUtils.createLiveNetwork(graph.nodes);
var population3 = graphUtils.createLiveNetwork(graph.nodes);
var population4 = graphUtils.createLiveNetwork(graph.nodes);
var population5 = graphUtils.createLiveNetwork(graph.nodes);
var population6 = graphUtils.createLiveNetwork(graph.nodes);

var candidates1 = electionRaw.map(graphUtils.liveElection);
var candidates2 = electionRaw.map(graphUtils.liveElection);
var candidates3 = electionRaw.map(graphUtils.liveElection);
var candidates4 = electionRaw.map(graphUtils.liveElection);
var candidates5 = electionRaw.map(graphUtils.liveElection);
var candidates6 = electionRaw.map(graphUtils.liveElection);

// collect elections for graphing
var elections = [];

console.log("%c Raw population: election with bare network", 'background: #222; color: #bada55');
var electionTotals1 = population1.map(function (element) {
    element.population = 1000;return element;
}).reduce(playerUtils.determineVoteShare, candidates1);

console.log(electionTotals1);
elections.push({
    histogram: analyticsTools.histogramHashmapToArray(population1.reduce(analyticsTools.sortNodes, analyticsTools.createRange(100))).sort(function (a, b) {
        return a.key > b.key;
    }),
    electionTotals: [{
        key: "Raw population: election with bare network",
        values: electionTotals1
    }]
});

console.log("%c Raw population: election with bare network after campaigning on a single node", 'background: #222; color: #bada55');

var selectedNode1 = Math.floor(Math.random() * population4.length);

playerUtils.campaignOnNode("scub", 1)(population4[selectedNode1]);

var electionTotals4 = population4.map(function (element) {
    element.population = 1000;return element;
}).reduce(playerUtils.determineVoteShare, candidates4);

console.log(electionTotals4);
elections.push({
    histogram: analyticsTools.histogramHashmapToArray(population4.reduce(analyticsTools.sortNodes, analyticsTools.createRange(100))).sort(function (a, b) {
        return a.key > b.key;
    }),
    electionTotals: [{
        key: "Raw population: election with bare network after campaigning on a single node",
        values: electionTotals4
    }]
});

console.log("%c after 10 weeks of node influencing one another", 'background: #222; color: #bada55');

for (var j = 0; j < 10; j++) {
    population2.forEach(graphUtils.influenceNodes);
    population2.forEach(graphUtils.applyInfluence);
}

var electionTotals2 = population2.map(function (element) {
    element.population = 1000;return element;
}).reduce(playerUtils.determineVoteShare, candidates2);

console.log(electionTotals2);

elections.push({
    histogram: analyticsTools.histogramHashmapToArray(population2.reduce(analyticsTools.sortNodes, analyticsTools.createRange(100))).sort(function (a, b) {
        return a.key > b.key;
    }),
    electionTotals: [{
        key: "after 10 weeks of node influencing one another",
        values: electionTotals2
    }]
});

console.log("%c after 10 weeks of campaigning on the top 50% random nodes ", 'background: #222; color: #bada55');

var top25 = population3.sort(function (a, b) {
    return a.connections.length > b.connections.length;
}).slice(0, Math.floor(population3.length / 2));

for (var _j = 0; _j < 10; _j++) {
    top25.forEach(playerUtils.campaignOnNode("scub", .2));
    population3.forEach(graphUtils.influenceNodes);
    population3.forEach(graphUtils.applyInfluence);
}

var electionTotals3 = population3.map(function (element) {
    element.population = 1000;return element;
}).reduce(playerUtils.determineVoteShare, candidates3);

console.log(electionTotals3);
elections.push({
    histogram: analyticsTools.histogramHashmapToArray(population3.reduce(analyticsTools.sortNodes, analyticsTools.createRange(100))).sort(function (a, b) {
        return a.key > b.key;
    }),
    electionTotals: [{
        key: "after 3 weeks of campaigning on the top 50% random nodes. here is a change I made!",
        values: electionTotals3
    }]
});

console.log("%c after 10 weeks of influencing when 25% of the nodes are scub extreamists", 'background: #222; color: #bada55');

var skubExtreamists = population5.slice(0, Math.floor(population5.length / 2));
skubExtreamists.forEach(function (node) {
    node.issues.scub = 1;
});

for (var _j2 = 0; _j2 < 10; _j2++) {
    population5.forEach(graphUtils.influenceNodes);
    population5.forEach(graphUtils.applyInfluence);
}

var electionTotals5 = population5.map(function (element) {
    element.population = 1000;return element;
}).reduce(playerUtils.determineVoteShare, candidates5);

console.log(electionTotals5);
elections.push({
    histogram: analyticsTools.histogramHashmapToArray(population5.reduce(analyticsTools.sortNodes, analyticsTools.createRange(100))).sort(function (a, b) {
        return a.key > b.key;
    }),
    electionTotals: [{
        key: "after 3 weeks of influencing when 50% of the nodes are scub extremists.",
        values: electionTotals5
    }]
});

console.log("%c campaign on nodes that already agree with scub", 'background: #222; color: #bada55');

var skubSupporters = population6.filter(function (node) {
    return node.issues.get('scub') > .75;
});
console.log('there are ' + skubSupporters.length + ' node that already support Skub');

for (var _j3 = 0; _j3 < 10; _j3++) {
    skubSupporters.forEach(playerUtils.campaignOnNode("scub", .2));
    population6.forEach(graphUtils.influenceNodes);
    population6.forEach(graphUtils.applyInfluence);
}

var electionTotals6 = population6.map(function (element) {
    element.population = 1000;return element;
}).reduce(playerUtils.determineVoteShare, candidates6);

console.log(electionTotals6);
elections.push({
    histogram: analyticsTools.histogramHashmapToArray(population6.reduce(analyticsTools.sortNodes, analyticsTools.createRange(100))).sort(function (a, b) {
        return a.key > b.key;
    }),
    electionTotals: [{
        key: "Campaign on nodes that already agree with scub",
        values: electionTotals6
    }]
});

var histogram = analyticsTools.histogramHashmapToArray(population3.reduce(analyticsTools.sortNodes, analyticsTools.createRange(100))).sort(function (a, b) {
    return a.key > b.key;
});

nv.addGraph(function () {
    var chart = nv.models.discreteBarChart().x(function (d) {
        return d.name;
    }).y(function (d) {
        return d.votes;
    }).staggerLabels(true).tooltips(false).showValues(true);

    var histogramChart = nv.models.historicalBarChart().x(function (d) {
        return d.key;
    }).y(function (d) {
        return d.value;
    }).forceX([0, 1]);

    var graphs = d3.select('#graph-container').selectAll("svg").data(elections).enter().append("div");

    graphs.append("H1").datum(function (d) {
        return d.electionTotals;
    }).text(function (d) {
        return d[0].key;
    });

    graphs.append("svg").attr("height", 200).datum(function (d) {
        return d.electionTotals;
    }).call(chart);

    graphs.append("svg").attr("height", 200).datum(function (d) {
        return [{
            key: d.electionTotals.key,
            values: d.histogram
        }];
    }).call(histogramChart);

    nv.utils.windowResize(chart.update);
    nv.utils.windowResize(histogramChart.update);

    return chart;
});

},{"./src/analytics-tools/analytics-tools.js":2,"./src/graph-utils/graph-utils.js":7,"./src/player-utils/player-utils.js":8}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
function createRange(split) {
    var newMap = new Map();

    for (var i = 0; i <= 1; i += 1 / split) {
        newMap.set(i.toFixed(Math.log10(split)), 0);
    }

    return newMap;
}

function histogramHashmapToArray(bins) {
    var binArray = [];

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = bins.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var bin = _step.value;

            binArray.push({
                key: bin,
                keyString: bin.toString(),
                value: bins.get(bin)
            });
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

    return binArray;
}

//make a distribution of nodes based on average of issues
function sortNodes(bins, node) {
    var total = 0;
    var numIssues = 0;
    var decimalPlaces = Math.log10(bins.size);

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = node.issues.keys()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var issue = _step2.value;

            total += node.issues.get(issue);
            numIssues++;
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

    var binNumber = (total / numIssues).toFixed(decimalPlaces);

    if (bins.has(binNumber)) {
        bins.set(binNumber, bins.get(binNumber) + 1);
    } else {
        bins.set(binNumber, 1);
    }

    return bins;
}

exports.createRange = createRange;
exports.histogramHashmapToArray = histogramHashmapToArray;
exports.sortNodes = sortNodes;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Candidate = exports.Candidate = function Candidate(name, player, issues) {
    _classCallCheck(this, Candidate);

    this.name = name;
    this.player = player;
    this.issues = issues;
};

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.District = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _populationClass = require('./population.class.js');

var _candidateClass = require('./candidate.class.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// a district with
var District = exports.District = function () {
    function District(name, nodes) {
        _classCallCheck(this, District);

        this.name = name;

        this.populations = nodes.map(function (element) {
            var population = Math.ceil(Math.random() * 100);

            return new _populationClass.Population(population, element);
        });

        this.candidates = [];
    }

    _createClass(District, [{
        key: 'addCandidate',
        value: function addCandidate(player, candidate) {
            console.log(candidate);
            this.candidates.push(new _candidateClass.Candidate(candidate.name, player, candidate.issues));
        }
    }]);

    return District;
}();

},{"./candidate.class.js":3,"./population.class.js":6}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// a graph node representing the views of a particular population
var Node = exports.Node = function () {
    function Node(name, issues) {
        _classCallCheck(this, Node);

        this.name = name;
        this.issues = new Map();
        this.connections = [];
        this.population = 0;

        for (var issue in issues) {
            if (issues.hasOwnProperty(issue)) {
                this.issues.set(issue, issues[issue]);
            }
        }
    }

    _createClass(Node, [{
        key: "getTopFiveIssues",
        get: function get() {
            if (this.issues.size > 5) {
                return new Map(Array.from(this.issues.entries()).slice(0, 5));
            } else {
                return this.issues;
            }
        }
    }]);

    return Node;
}();

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//population within a district
var Population = exports.Population = function () {
    function Population(population, element) {
        _classCallCheck(this, Population);

        this.population = population;
        this.element = element;
        this.issues = new Map();

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = element.issues.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var key = _step.value;

                this.issues.set(key, this.issues.size);
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

        ;

        this.element.population += population;
    }

    _createClass(Population, [{
        key: "addIssue",
        value: function addIssue(issue) {
            var entries = Array.from(this.issues.entries()).map(function (issue) {
                return [issue[0], issue[1]++];
            });

            entries.unshift([issue, 0]);

            this.issues = new Map(entries);
        }
    }, {
        key: "promoteIssue",
        value: function promoteIssue(issue) {
            var places = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

            var oldPosition = this.issues.get(issue);
            var newPosition = oldPosition + places;

            this.issues.forEach(function (issue) {
                if (issue >= newPosition && issue < oldPosition) {
                    return issue++;
                } else {
                    return issue;
                }
            });

            this.issues.set(issue, newPosition);
        }
    }, {
        key: "topThreeIssues",
        get: function get() {
            var topThree = this.issues.entries().sort(a, function (b) {
                return a[1] > b[1];
            }).slice(0, 2);

            return new Map(topThree);
        }
    }]);

    return Population;
}();

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createDistricts = exports.mapFromObject = exports.createGraph = exports.applyInfluence = exports.influenceNodes = exports.createLiveNetwork = exports.liveElection = undefined;

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

function pollDistrict(district) {
    var totalPopulation = district.populations.reduce(function (current, population) {
        return current + population.population;
    }, 0);

    // Caluclate sample size with Slovin's formula
    // want it with 5% confidence interval
    var sampleSize = totalPopulation / (1 + totalPopulation * Math.pow(0.05, 2));

    var samples = [];

    //returns the index of the array element that is the sume of the arithmetic sequence of the array elements.
    function findSample(array, sample) {
        var position = 0;
        var index = 0;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = array[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                element = _step2.value;

                position += element;

                if (position >= sample) {
                    return index;
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
    }

    for (var i; i <= sampleSize; i++) {
        var samplePosition = Math.round(Math.random() * totalPopulation);
        var sampleIndex = findSample(district.populations.map(function (e) {
            return e.population;
        }), samplePosition);
        var sample = district.populations[sampleIndex];

        var probabilityDistribution = softmax(district.candidates.map(_playerUtils.issueDifference));
        var candidateIndex = findSample(probabilityDistribution, Math.random());

        samples.push(district.candidates[candidateIndex]);
    }

    return samples;
}

exports.liveElection = liveElection;
exports.createLiveNetwork = createLiveNetwork;
exports.influenceNodes = influenceNodes;
exports.applyInfluence = applyInfluence;
exports.createGraph = createGraph;
exports.mapFromObject = mapFromObject;
exports.createDistricts = createDistricts;

},{"../classes/district.class.js":4,"../classes/node.class.js":5,"../classes/population.class.js":6,"../player-utils/player-utils.js":8}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// lifted softmax function
function softmax(arr) {
    return arr.map(function (value, index) {
        return Math.exp(value) / arr.map(function (y /*value*/) {
            return Math.exp(y);
        }).reduce(function (a, b) {
            return a + b;
        });
    });
}

function issueDifference(candidate) {
    var total = 0;
    var issues = this.issues.size > 5 ? this.getTopFiveIssues : this.issues;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = this.issues.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var issue = _step.value;

            if (this.issues.has(issue) && candidate.issues.has(issue)) {
                total += Math.abs(this.issues.get(issue) - candidate.issues.get(issue));
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

    return total;
}

function determineVoteShare(election, node) {

    var differenceTotals = election.map(issueDifference, node);

    var totalDifference = differenceTotals.reduce(function (total, element) {
        return total + element;
    }, 0);

    var percentageRawDifference = differenceTotals.reduce(function (total, element) {
        return total + element / totalDifference;
    }, 0);

    var percentageDifference = differenceTotals.map(function (element) {
        return totalDifference / element;
    });

    // caculate voter turnout based on min difference
    // using tanh for a sigmoid function, cause why not, i just need to make an idelogical difference into a proportion of 1
    var turnout = node.population * (1 - Math.tanh(Math.min.apply(Math, _toConsumableArray(differenceTotals))));

    // console.log(`Turnout for ${node.name} was ${Math.floor((1 - Math.tanh(Math.min(...differenceTotals))) * 100)}%`);
    // distribute voter turnout by share
    softmax(percentageDifference).forEach(function (candidate, index) {
        election[index].votes += Math.floor(turnout * candidate);
        //console.log(`candidate ${election[index].name} received ${Math.floor(turnout * candidate)} (${Math.floor(100 * candidate)}%) votes from ${node.name}`)
    });

    return election;
};

// simple campaign function where changes propogate through the network
// influence willbounce around with diminishing returns until its less than 0.001
function campaignOnNode(issue, amount) {

    return function (node) {
        node.issues.set(issue, shiftAndClip(node.issues.get(issue), amount));

        // console.log(`campaigning on node ${node.name} by ${amount}. Now ${node.issues.get(issue)}`);

        var newAmount = amount / 2;

        if (newAmount > 0.1) {
            node.connections.forEach(campaignOnNode(issue, newAmount));
        }
    };
}

// change node issue vlaues but clips values between 0 and 1
function shiftAndClip(base, shift) {
    base += shift;

    if (base > 1) {
        base = 1;
    }

    if (base < 0) {
        base = 0;
    }

    return base;
}

exports.shiftAndClip = shiftAndClip;
exports.campaignOnNode = campaignOnNode;
exports.determineVoteShare = determineVoteShare;
exports.softmax = softmax;

},{}]},{},[1])//# sourceMappingURL=build.js.map
