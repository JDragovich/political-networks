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
                total += Math.abs(this.element.issues.get(issue) - candidate.issues.get(issue));
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

function determineVoteShare(candidates, node) {

    var results = [];

    var differenceTotals = candidates.map(issueDifference, node);
    var totalDifference = differenceTotals.reduce(function (total, element) {
        return total + element;
    }, 0);

    var percentageRawDifference = differenceTotals.reduce(function (total, element) {
        return total + element / totalDifference;
    }, 0);

    var percentageDifference = differenceTotals.map(function (element) {
        return totalDifference / element;
    });

    // set the election total to 0
    results = candidates.map(function (e) {
        return { uuid: e.uuid, votes: 0 };
    });

    // caculate voter turnout based on min difference
    // using tanh for a sigmoid function, cause why not, i just need to make an idelogical difference into a proportion of 1
    var turnout = node.population * (1 - Math.tanh(Math.min.apply(Math, _toConsumableArray(differenceTotals))));
    turnout = node.population;
    // console.log(`Turnout for ${node.name} was ${Math.floor((1 - Math.tanh(Math.min(...differenceTotals))) * 100)}%`);
    // distribute voter turnout by share
    softmax(percentageDifference).forEach(function (candidate, index) {
        results[index].votes += Math.floor(turnout * candidate);
        //console.log(`candidate ${election[index].name} received ${Math.floor(turnout * candidate)} (${Math.floor(100 * candidate)}%) votes from ${node.name}`)
    });

    return results;
};

// simple campaign function where changes propogate through the network
// influence willbounce around with diminishing returns until its less than 0.001
function campaignOnNode(issue, target) {

    return function (node) {
        var amount = target - node.issues.get(issue);
        node.issues.set(issue, shiftAndClip(node.issues.get(issue), amount));
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
exports.issueDifference = issueDifference;
//# sourceMappingURL=player-utils.js.map
