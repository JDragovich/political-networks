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
        key: "promoteWithQueue",
        value: function promoteWithQueue(queue) {
            var _this = this;

            var originalIssueOrder = Array.from(this.issues.keys()).reverse();

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                var _loop = function _loop() {
                    var issue = _step2.value;


                    if (queue.some(function (e) {
                        return e === issue;
                    })) {

                        console.log("promoting " + issue);

                        var jumps = queue.filter(function (e) {
                            return e === issue;
                        }).length;
                        _this.promoteIssue(issue, jumps);

                        queue = queue.filter(function (e) {
                            return e !== issue;
                        });
                    }
                };

                for (var _iterator2 = originalIssueOrder[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    _loop();
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
//# sourceMappingURL=population.class.js.map
