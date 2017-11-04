'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Election = undefined;

var _uuid = require('./uuid.class');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Election = exports.Election = function Election() {
    _classCallCheck(this, Election);

    this.uuid = _uuid.Uuid.createUuid();
    this.districts = [];
    this.candidates = [];
    this.moves = [];
};
//# sourceMappingURL=election.class.js.map
