// Setup globals for tests (minified)
const Random = require('random-js');
const Prob = require('../dist/prob-min.js');

global.Random = Random;
global.Prob = Prob;
global.QUnit = require('qunit');
