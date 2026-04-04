// Setup globals for tests
const Random = require('random-js');
const Prob = require('../dist/prob.js');

global.Random = Random;
global.Prob = Prob;
global.QUnit = require('qunit');
