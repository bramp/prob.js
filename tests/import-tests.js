// Copyright 2016 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////////
//
// Test various imports we support.
// Can only be run from within qunit command line.
// 

var FILE = '../dist/prob-min';

function checkIsValid(assert, Prob) {
	assert.strictEqual(typeof Prob, 'object', 'Prob exists and is a object');
	if (Prob) {
		assert.strictEqual(typeof Prob.uniform, 'function', 'Prob.uniform exists and is a function');
	}
}

QUnit.module("Modules");

// Test that NodeJS can load this module
QUnit.test( "node", function(assert) {
	var p = require(FILE);
	checkIsValid(assert, p);
});

// Test that requirejs (AMD) can load this module
QUnit.test( "amd", function(assert) {
	var requirejs = require('requirejs');
	requirejs.config({
		baseUrl: __dirname,
	    nodeRequire: null,
	    paths: {
	        'prob': FILE
	    }
	});

	var p = requirejs('prob');
	checkIsValid(assert, p);

/*  // Async version:
	stop();
	requirejs(['prob'], function (Prob) {
	    checkIsValid(assert, Prob);
	    start();
	}, function(err) {
		assert.ok(false, "requirejs failed " + err);
		start();
	});
*/
});

// TODO Create a global test
/*
QUnit.test( "global", function(assert) {

});
*/