/* Prob.js 1.0.6 (c) 2016 Google, Inc. License: Apache 2.0 */
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
(function() {
  'use strict';

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = typeof self == 'object' && self.self === self && self ||
  typeof global == 'object' && global.global === global && global ||
  this;

  var Prob = {};

  // Export the Prob object for **Node.js**, with backwards-compatibility for
  // their old module API. If we're in the browser, add `Prob` as a global object.
  // (`nodeType` is checked to ensure that `module` and `exports` are not HTML elements.)
  if (typeof exports !== 'undefined' && !exports.nodeType) {
    if (typeof module !== 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = Prob;
    }
    exports.Prob = Prob;
  } else {
    root.Prob = Prob;
  }

  // Taken from http://stackoverflow.com/a/15313435/88646
  function assert(condition, message) {
    if (!condition) {
      message = message || 'Assertion failed';
      if (typeof Error !== 'undefined') {
        throw new Error(message);
      }
      throw message; // Fallback
    }
  }

  // TODO Remove the dependency on Random JS
  var Random = root.Random ||
              (typeof require === 'function' ? require('random-js') : null);
  if (Random === null) {
    throw 'random-js is required https://github.com/ckknight/random-js';
  }

  var mt = Random.engines.mt19937().autoSeed(); // Fallback generator when one isn't specified
  var rand01 = Random.real(0, 1, false); // [0,1)
  var rand11 = Random.real(-1, 1, true); // [-1,1]

  Prob.Type = {
    UNKNOWN: 0,
    CONTINUOUS: 1,
    DISCRETE: 2,
  };

  // Returns floats uniformly distributed between min (inclusive) and max (exclusive).
  Prob.uniform = function(min, max) {
    min = typeof min !== 'undefined' ? min : 0.0;
    max = typeof max !== 'undefined' ? max : 1.0;

    var range = (max - min);
    var f = function(rand) {
      return min + rand01(rand || mt) * range;
    };
    f.Min = min;
    f.Max = max;
    f.Mean = min + range / 2;
    f.Variance = ((max - min) * (max - min)) / 12;
    f.Type = Prob.Type.CONTINUOUS;
    return f;
  };

  // Returns floats random chosen from a normal disribution.
  Prob.normal = function(mean, sd) {
    mean = typeof mean !== 'undefined' ? mean : 0.0;
    sd = typeof sd !== 'undefined' ? sd : 1.0;

    var y1 = null;
    var y2 = null;
    var f = function(rand) {
      if (y2 !== null) {
        y1 = y2;
        y2 = null;
        return y1 * sd + mean;
      }
      var x1;
      var x2;
      var w;

      do {
        x1 = rand11(rand || mt);
        x2 = rand11(rand || mt);
        w = x1 * x1 + x2 * x2;
      } while (w >= 1.0 || w === 0.0);

      w = Math.sqrt((-2.0 * Math.log(w)) / w);
      y1 = x1 * w;
      y2 = x2 * w;
      return y1 * sd + mean;
    };
    f.Min = Number.NEGATIVE_INFINITY;
    f.Max = Number.POSITIVE_INFINITY;
    f.Mean = mean;
    f.Variance = sd * sd;
    f.Type = Prob.Type.CONTINUOUS;
    return f;
  };

  // Returns floats random chosen from a exponential disribution.
  Prob.exponential = function(lambda) {
    lambda = typeof lambda !== 'undefined' ? lambda : 1.0;
    var mean = 1 / lambda;

    var f = function(rand) {
      return -1 * Math.log(rand01(rand || mt)) * mean;
    };
    f.Min = 0;
    f.Max = Number.POSITIVE_INFINITY;
    f.Mean = mean;
    f.Variance = Math.pow(lambda, -2);
    f.Type = Prob.Type.CONTINUOUS;
    return f;
  };

  // Returns floats random chosen from a lognormal disribution.
  Prob.lognormal = function(mu, sigma) {
    mu = typeof mu !== 'undefined' ? mu : 0;
    sigma = typeof sigma !== 'undefined' ? sigma : 1.0;

    var nf = Prob.normal(mu, sigma);
    var f = function(rand) {
      return Math.exp(nf(rand));
    };

    f.Min = 0;
    f.Max = Number.POSITIVE_INFINITY;
    f.Mean = Math.exp(mu + ((sigma * sigma) / 2));
    f.Variance = (Math.exp(sigma * sigma) - 1) *
                  Math.exp(2 * mu + sigma * sigma);
    f.Type = Prob.Type.CONTINUOUS;
    return f;
  };

  // Returns int random chosen from a poisson disribution.
  Prob.poisson = function(lambda) {
    lambda = typeof lambda !== 'undefined' ? lambda : 1;

    // Knuth's algorithm
    var L = Math.exp(-lambda);

    var f = function(rand) {
      var k = 0;
      var p = 1;
      while (true) {
        p = p * rand01(rand || mt); // BUG: This should be [0,1] not [0,1)
        if (p <= L) {
          break;
        }
        k++;
      }
      return k;
    };
    f.Min = 0;
    f.Max = Number.POSITIVE_INFINITY;
    f.Mean = lambda;
    f.Variance = lambda;
    f.Type = Prob.Type.DISCRETE;
    return f;
  };

  function binarySearch(arr, needle) {
    var high = arr.length;
    var low = -1;

    while (high - low > 1) {
      var mid = Math.floor(low + (high - low) / 2);
      if (arr[mid] < needle) {
        low = mid;
      } else {
        high = mid;
      }
    }

    return high;
  }

  // Returns integers random chosen from a zipf disribution.
  Prob.zipf = function(s, N) {
    // We use a inverse CDF approach. We calculate the CDF for
    // the zipf function, then generate a uniform random number in the range [0,1).
    // A binary search of the CDF used to find the value which maps to that random number.
    //
    s = typeof s !== 'undefined' ? s : 1;
    N = typeof N !== 'undefined' ? N : 100;

    assert(N >= 1, 'N must be >= 1');

    // TODO Consider moving the cdf generating code into a seperate function

    var sum = 0.0;
    for (var i = 1; i <= N; i++) {
      sum = sum + 1.0 / Math.pow(i, s);
    }

    var cdf = [0];
    var sumProb = 0;
    for (i = 1; i <= N; i++) {
      sumProb += 1.0 / (sum * Math.pow(i, s));
      cdf[i] = sumProb;
    }

    var f = function(rand) {
      return binarySearch(cdf, rand01(rand || mt));
    };

    f.Min = 1;
    f.Max = N + 1;
    f.Mean = null;     // TODO
    f.Variance = null; // TODO
    f.Type = Prob.Type.DISCRETE;
    return f;
  };

  if (typeof define === 'function' && define.amd) {
    define('prob', [], function() {
      return Prob;
    });
  }

}());
