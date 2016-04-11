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
  var mt = Random.engines.mt19937().autoSeed();

  function drawHistogram(div, r, options) {
    var layout = {
      showlegend: false,
      margin: {
        t: 20,
        b: 40
      },
      'xaxis': {
        range: options.xrange
      }
    };
    var config = {
      displayModeBar: false
    };

    var nbinsx = options.nbinsx;
    var xmin = options.xrange[0];
    var xmax = options.xrange[1];
    var xrange = xmax - xmin;
    var x = [];
    var bins = [];
    var pdf = [];
    for (var i = 0; i < nbinsx; i++) {
      x.push(xmin + xrange * i / nbinsx);
      bins.push(0.0);
    }
    var data = [{
      x: x,
      y: pdf, // (could also be bins)
      type: 'bar'
    }];

    var count = 0;

    var drawMore = function() {
      var i;
      var iterations = count * 1.1 + 1; // Allow for a slow ramp up
      for (i = 0; i < iterations; i++) {
        var j = r(mt);
        if (j >= xmin && j <= xmax) {
          bins[ Math.floor((j - xmin) * nbinsx / xrange) ]++;
        }
        count++;
      }

      var binWidth = xrange / nbinsx;
      for (i = 0; i < nbinsx; i++) {
        pdf[i] = bins[i] / count / binWidth;
      }

      Plotly.newPlot(div, data, layout, config);

      if (count < 1000000) {
        // TODO Perhaps change 10ms to something viable per browser
        setTimeout(drawMore, 10);
      }
    };

    // Use setTimeout so we don't block the UI thread, and can redraw the graphs as we go.
    setTimeout(drawMore, 0);
  }

  drawHistogram('normal', Prob.normal(), {  // μ = 0, σ = 1.0
    nbinsx: 120,
    xrange: [-3, 3]
  });
  drawHistogram('uniform', Prob.uniform(), {  // min = 0, max = 1.0
    nbinsx: 100,
    xrange: [0, 1]
  });
  drawHistogram('exponential', Prob.exponential(), {  // λ = 1.0
    nbinsx: 120,
    xrange: [0, 5]
  });
  drawHistogram('lognormal', Prob.lognormal(), { // μ = 0, σ = 1.0
    nbinsx: 120,
    xrange: [0, 5]
  });
  drawHistogram('poisson', Prob.poisson(4), { // λ = 1.0
    nbinsx: 16,
    xrange: [0, 16]
  });
  drawHistogram('zipf', Prob.zipf(), { // s = 1, N = 100
    nbinsx: 101,
    xrange: [0, 101]
  });
}());
