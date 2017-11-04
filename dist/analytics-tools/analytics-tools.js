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
//# sourceMappingURL=analytics-tools.js.map
