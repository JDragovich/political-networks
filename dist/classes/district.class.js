'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.District = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _populationClass = require('./population.class.js');

var _candidateClass = require('./candidate.class.js');

var _uuidClass = require('./uuid.class.js');

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
        this.promoteQueue = [];

        this.latestPolling = null;
    }

    _createClass(District, [{
        key: 'promoteFromQueue',
        value: function promoteFromQueue() {
            var _this = this;

            this.populations.forEach(function (e) {
                e.promoteWithQueue(_this.promoteQueue);
            });
        }
    }, {
        key: 'addCandidate',
        value: function addCandidate(player, candidate) {

            if (this.candidates.find(function (e) {
                return e.name === candidate.name;
            })) {
                console.log("player already has a candidate in the race!");
                return;
            }
            this.candidates.push(candidate);
        }
    }]);

    return District;
}();
//# sourceMappingURL=district.class.js.map
