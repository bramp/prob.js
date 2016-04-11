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

var SEED = 0;
var TRIALS = 1000000;
var MEAN_ERR = 10000/TRIALS;
var VAR_ERR = 100000/TRIALS;

function nearlyEqual(assert, actual, expected, err, msg) {
	msg += " " + actual.toFixed(3) + " ~= " + expected.toFixed(3) + " +/- " + err;
	assert.ok( ((expected - err) < actual) && (actual < (expected + err)), msg ); 
}

function checkMinMax(assert, f, min, max) {
	assert.equal(f.Min, min, "Correct min");
	assert.equal(f.Max, max, "Correct max");
}

function checkEstimators(assert, f, mean, variance) {
	assert.equal(f.Mean, mean, "Correct mean");
	assert.equal(f.Variance, variance, "Correct variance");
}

function checkResults(assert, f, trials) {
	trials = trials || TRIALS;
	var mt = Random.engines.mt19937().seed(SEED);

	var sum = 0, sum2 = 0;
	for (var i = 0; i < trials; i++) {
		var value = f(mt);
		sum += value;
		sum2 += value * value;

		if( value < f.Min || value >= f.Max) {
			assert.ok(false, "Value outside of range: " + value + " != [" + f.Min + "," + f.Max + ")");
		}
	}

	var mean = sum / trials;
	var variance = (sum2 - (sum*sum) / trials) / trials;

	if (f.Mean !== null) {
		nearlyEqual(assert, mean, f.Mean, MEAN_ERR, "Generated mean within range");
	}
	if (f.Variance !== null) {
		nearlyEqual(assert, variance, f.Variance, VAR_ERR, "Generated variance within range");
	}
}

QUnit.module("Distributions");

QUnit.test( "uniform", function(assert) {
	var f = Prob.uniform(1, 3);

	checkMinMax(assert, f, 1, 3);
	checkEstimators(assert, f, 2, 1/3);
	checkResults(assert, f);
});

QUnit.test( "normal", function(assert) {
	var f = Prob.normal(2, 3);

	checkMinMax(assert, f, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
	checkEstimators(assert, f, 2, 9);
	checkResults(assert, f);
});


QUnit.test( "exponential", function(assert) {
	var f = Prob.exponential(3/2);

	checkMinMax(assert, f, 0, Number.POSITIVE_INFINITY);
	checkEstimators(assert, f, 2/3, 4/9);
	checkResults(assert, f);
});

QUnit.test( "lognormal", function(assert) {
	var f = Prob.lognormal(0, 0.5);

	mean = Math.exp( 0.125 );
	variance = (Math.exp(0.25) - 1) * Math.exp(0.25);

	checkMinMax(assert, f, 0, Number.POSITIVE_INFINITY);
	checkEstimators(assert, f, mean, variance);
	checkResults(assert, f);
});

QUnit.test( "poisson", function(assert) {
	var f = Prob.poisson(2);

	checkMinMax(assert, f, 0, Number.POSITIVE_INFINITY);
	checkEstimators(assert, f, 2, 2);
	checkResults(assert, f);
});

QUnit.test( "zipf", function(assert) {
	var f = Prob.zipf(1, 10);

	checkMinMax(assert, f, 1, 11);
	//checkEstimators(assert, f, mean, variance);
	checkResults(assert, f);
});

QUnit.module("API");

function checkFunction(assert, name, func) {
	var f = func();
	assert.ok(typeof f === 'function', name + " returns a default generator function");
	assert.ok(typeof f() === 'number', name + " generated a random number");
}

QUnit.test( "defaults", function(assert) {
	// Tests we can create each distribution with default args, and can generate atleast one number.
	checkFunction(assert, 'uniform', Prob.uniform);
	checkFunction(assert, 'normal', Prob.normal);
	checkFunction(assert, 'exponential', Prob.exponential);
	checkFunction(assert, 'lognormal', Prob.lognormal);
	checkFunction(assert, 'poisson', Prob.poisson);
	checkFunction(assert, 'zipf', Prob.zipf);

});

// TODO Check zipf binary search works as expected, search for 0, 1.0, etc

QUnit.test( "zipf args", function(assert) {
	assert.throws(function() {
		Prob.zipf(1, 0);
	}, "throws with illegal 'N' argument");

	assert.throws(function() {
		Prob.zipf(1, -1);
	}, "throws with illegal 'N' argument");
});

QUnit.test( "source", function(assert) {
	var xkcd_source = function() {
		return 4; // chosen by fair dice roll.
		          // guranteed to be random.
	};

	var r = Prob.uniform();
	var x = r(xkcd_source);
	var y = r(xkcd_source);
	var z = r(xkcd_source);

	assert.ok(typeof x === "number", "XKCD random source supplys a number");
	assert.ok(x === y && y == z, "XKCD random source works");

	x = r(Random.engines.nativeMath);
	assert.ok(typeof x === "number", "Other random js source supplys a number");
});

