'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Node = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuidClass = require('./uuid.class.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// a graph node representing the views of a particular population
var Node = exports.Node = function () {
    function Node(name, issues) {
        _classCallCheck(this, Node);

        this.name = name;
        this.issues = new Map();
        this.connections = [];
        this.population = 0;
        this.uuid = _uuidClass.Uuid.createUuid();

        for (var issue in issues) {
            if (issues.hasOwnProperty(issue)) {
                this.issues.set(issue, issues[issue]);
            }
        }
    }

    _createClass(Node, [{
        key: 'getTopFiveIssues',
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
//# sourceMappingURL=node.class.js.map
