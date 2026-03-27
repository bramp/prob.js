#!/usr/bin/env node
// Copyright 2016-2026 Andrew Brampton
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

import _ from 'lodash';
import util from 'util';
import Prob from '../dist/prob.js';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

var distributions = {
  uniform: {
    desc: 'Uniform distribution',
    args: [
      ['min', 0],
      ['max', 1],
    ],
  },
  normal: {
    desc: 'Normal distribution',
    args: [
      ['mean', 0],
      ['stddev', 1],
    ],
  },
  exponential: { desc: 'Exponential distribution', args: [['lambda', 1]] },
  lognormal: {
    desc: 'Lognormal distribution',
    args: [
      ['mean', 0],
      ['stddev', 1],
    ],
  },
  poisson: { desc: 'Poisson distribution', args: [['lambda', 1]] },
  zipf: {
    desc: "Zipf's distribution",
    args: [
      ['s', 1],
      ['n', 100],
    ],
  },
};

var y = yargs(hideBin(process.argv))
  .usage('Usage: $0 distribution [options]')
  .example('$0 normal --count 1000', 'Output 1000 normally distributed numbers')
  .option('count', {
    alias: 'c',
    describe: 'Number of random numbers to output',
    default: 10,
    type: 'number',
    global: true,
  })
  .option('verbose', {
    alias: 'v',
    describe: 'Print out additional information',
    default: false,
    type: 'boolean',
    global: true,
  })
  .help('help')
  .alias('help', 'h')
  .demand(1);

_.forEach(distributions, function (distribution, name) {
  var opts = {};
  _.forEach(distribution.args, function (value) {
    opts[value[0]] = {
      default: value[1],
      type: 'number',
    };
  });

  y = y.command(name, distribution.desc, opts);
});

var argv = y.strict().argv;

var dist = argv._[0];
var args = _.map(distributions[dist].args, function (arg) {
  return argv[arg[0]];
});

var f = Prob[dist].apply(this, args);
for (var i = 0; i < argv.count; i++) {
  console.log(f());
}

if (argv.verbose) {
  console.log(
    util.format('Expected min: %d max: %d mean: %d variance: %d', f.Min, f.Max, f.Mean, f.Variance)
  );
}
