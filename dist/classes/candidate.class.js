'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Candidate = undefined;

var _uuid = require('./uuid.class');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Candidate = exports.Candidate = function Candidate(name, player, issues) {
    _classCallCheck(this, Candidate);

    this.name = name;
    this.player = player;
    this.issues = new Map(issues.entries());
    this.running = false;
    this.polling = 0;
    this.uuid = _uuid.Uuid.createUuid();
};
//# sourceMappingURL=candidate.class.js.map
