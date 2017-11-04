"use strict";

var _graphUtils = require("src/graph-utils/graph-utils");

var graphUtils = _interopRequireWildcard(_graphUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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

function determineVoteShare(node, election) {

    var differenceTotals = election.map(function (current) {
        var total = 0;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = node.issues.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _issue = _step.value;

                if (node.issues.has(_issue) && current.issues.has(_issue)) {
                    total += Math.abs(node.issues.get(_issue) - current.issues.get(_issue));
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
    });

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

function influenceNodes(node) {
    node.connections.forEach(function (connection) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {

            for (var _iterator2 = node.issues.keys()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                issue = _step2.value;

                var modifier = node.population / connection.population < 100 ? node.population / connection.population : 100;

                var issueValue = connection.issues.get(issue) - (connection.issues.get(issue) - node.issues.get(issue)) / 100 * modifier;
                connection.issues.set(issue, issueValue);
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
    });
};

// simple campaign function where changes propogate through the network
// influence willbounce around with diminishing returns until its less than 0.001
function campaignOnNode(issue, amount) {

    return function (node) {
        shiftAndClip(node.issues.get(issue), amount);

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

//make a distribution of nodes based on average of issues
function sortNodes(bins, node) {
    var total = 0;
    var numIssues = 0;
    var decimalPlaces = Math.log10(bins.size);

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = node.issues.keys()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            issue = _step3.value;

            total += node.issues.get(issue);
            numIssues++;
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

    var binNumber = (total / numIssues).toFixed(decimalPlaces);

    if (bins.has(binNumber)) {
        bins.set(binNumber, bins.get(binNumber) + 1);
    } else {
        bins.set(binNumber, 1);
    }

    return bins;
}

function createRange(split) {
    var newMap = new Map();

    for (var i = 0; i <= 1; i += 1 / split) {
        newMap.set(i.toFixed(Math.log10(split)), 0);
    }

    return newMap;
}

function histogramHashmapToArray(bins) {
    var binArray = [];

    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
        for (var _iterator4 = bins.keys()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var bin = _step4.value;

            binArray.push({
                key: bin,
                keyString: bin.toString(),
                value: bins.get(bin)
            });
        }
    } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
            }
        } finally {
            if (_didIteratorError4) {
                throw _iteratorError4;
            }
        }
    }

    return binArray;
}

function mapFromObject(object) {
    var mapArray = [];

    for (prop in object) {
        if (object.hasOwnProperty(prop)) {
            mapArray.push([prop, object[prop]]);
        }
    }

    return new Map(mapArray);
}

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

var population1 = createLiveNetwork(graph.nodes);
var population2 = createLiveNetwork(graph.nodes);
var population3 = createLiveNetwork(graph.nodes);
var population4 = createLiveNetwork(graph.nodes);
var population5 = createLiveNetwork(graph.nodes);

var candidates1 = electionRaw.map(liveElection);
var candidates2 = electionRaw.map(liveElection);
var candidates3 = electionRaw.map(liveElection);
var candidates4 = electionRaw.map(liveElection);
var candidates5 = electionRaw.map(liveElection);

// collect elections for graphing
var elections = [];

console.log("%c Raw population: election with bare network", 'background: #222; color: #bada55');

var electionTotals1 = population1.reduce(function (election, currentNode) {
    return determineVoteShare(currentNode, election);
}, candidates1);

console.log(electionTotals1);
elections.push({
    histogram: histogramHashmapToArray(population1.reduce(sortNodes, createRange(100))).sort(function (a, b) {
        return a.key > b.key;
    }),
    electionTotals: [{
        key: "Raw population: election with bare network",
        values: electionTotals1
    }]
});

console.log("%c Raw population: election with bare network after campaigning on a single node", 'background: #222; color: #bada55');

var selectedNode1 = Math.floor(Math.random() * population4.length);

campaignOnNode("scub", 1)(population4[selectedNode1]);

var electionTotals4 = population4.reduce(function (election, currentNode) {
    return determineVoteShare(currentNode, election);
}, candidates4);

console.log(electionTotals4);
elections.push({
    histogram: histogramHashmapToArray(population4.reduce(sortNodes, createRange(100))).sort(function (a, b) {
        return a.key > b.key;
    }),
    electionTotals: [{
        key: "Raw population: election with bare network after campaigning on a single node",
        values: electionTotals4
    }]
});

console.log("%c after 10 weeks of node influencing one another", 'background: #222; color: #bada55');

for (var j = 0; j < 10; j++) {
    population2.forEach(influenceNodes);
}

var electionTotals2 = population2.reduce(function (election, currentNode) {
    return determineVoteShare(currentNode, election);
}, candidates2);

console.log(electionTotals2);

elections.push({
    histogram: histogramHashmapToArray(population2.reduce(sortNodes, createRange(100))).sort(function (a, b) {
        return a.key > b.key;
    }),
    electionTotals: [{
        key: "after 10 weeks of node influencing one another",
        values: electionTotals2
    }]
});

console.log("%c after 10 weeks of campaigning on the top 25% random nodes", 'background: #222; color: #bada55');

var top25 = population3.sort(function (a, b) {
    return a.connections.length > b.connections.length;
}).slice(0, Math.floor(population3.length / 2));

for (var _j = 0; _j < 10; _j++) {
    top25.forEach(campaignOnNode("scub", 1));
    population3.forEach(influenceNodes);
}

var electionTotals3 = population3.reduce(function (election, currentNode) {
    return determineVoteShare(currentNode, election);
}, candidates3);

console.log(electionTotals3);
elections.push({
    histogram: histogramHashmapToArray(population3.reduce(sortNodes, createRange(100))).sort(function (a, b) {
        return a.key > b.key;
    }),
    electionTotals: [{
        key: "after 10 weeks of campaigning on the top 50% random nodes",
        values: electionTotals3
    }]
});

console.log("%c after 10 weeks of influencing when 25% of the nodes are scub extreamists", 'background: #222; color: #bada55');

var skubExtreamists = population5.slice(0, Math.floor(population5.length / 2));
skubExtreamists.forEach(function (node) {
    node.issues.scub = 1;
});

for (var _j2 = 0; _j2 < 10; _j2++) {
    population5.forEach(influenceNodes);
}

var electionTotals5 = population5.reduce(function (election, currentNode) {
    return determineVoteShare(currentNode, election);
}, candidates5);

console.log(electionTotals5);
elections.push({
    histogram: histogramHashmapToArray(population5.reduce(sortNodes, createRange(100))).sort(function (a, b) {
        return a.key > b.key;
    }),
    electionTotals: [{
        key: "after 10 weeks of influencing when 50% of the nodes are scub extremists",
        values: electionTotals5
    }]
});

var histogram = histogramHashmapToArray(population3.reduce(sortNodes, createRange(100))).sort(function (a, b) {
    return a.key > b.key;
});

nv.addGraph(function () {
    var chart = nv.models.discreteBarChart().x(function (d) {
        return d.name;
    }) //Specify the data accessors.
    .y(function (d) {
        return d.votes;
    }).staggerLabels(true) //Too many bars and not enough room? Try staggering labels.
    .tooltips(false) //Don't show tooltips
    .showValues(true) //...instead, show the bar value right on top of each bar.
    //.transitionDuration(350)
    ;

    var histogramChart = nv.models.historicalBarChart().x(function (d) {
        return d.key;
    }) //Specify the data accessors.
    .y(function (d) {
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
//# sourceMappingURL=main.js.map
