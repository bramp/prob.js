Prob.js ![bower](https://img.shields.io/bower/v/prob.js.svg) [![npm](https://img.shields.io/npm/v/prob.js.svg)](https://www.npmjs.com/package/prob.js) [![LICENSE](https://img.shields.io/npm/l/prob.js.svg)](https://raw.githubusercontent.com/bramp/prob.js/master/LICENSE)
=======
by [Andrew Brampton](https://bramp.net) 2016

Generate random numbers from different probability distributions. [Demo](https://bramp.github.io/prob.js/).


Use
---

**Bower**:
```shell
bower install prob.js
```

```html
<script src="bower_components/random/lib/random.min.js" type="text/javascript" ></script>
<script src="bower_components/prob.js/dist/prob-min.js" type="text/javascript" ></script>
```

**Node.js**:
```shell
npm install prob.js
```

```js
var Prob = require('prob.js');
```

**Example**:
```js
var r = Prob.normal(0, 1.0); // μ = 0, σ = 1.0 
r(); // Returns a random number from this distribution
r(); // Returns another random number
r(); // and again
```

API
---

The following distribution are available:

```js
Prob.uniform(min, max) // Uniform distribution in range [min, max).
Prob.normal(μ, σ)      // Normal distribution with mean and standard deviation.
Prob.exponential(λ)    // Exponential distribution with lambda.
Prob.lognormal(μ, σ)   // Log-normal distribution defined as ln(normal(μ, σ)).
Prob.poisson(λ)        // Poisson distribution returning integers >= 0.
Prob.zipf(s, N)        // Zipf's distribution returning integers in range [1, N].
```

After generating a distribution, the following methods are available:

```js
var r = Prob.exponential(1.0); // Create a distribution.
r()        // Generates a number within the distribution.
r(src)     // Generates a number using a `src` of random numbers. (See note below.)
r.Min      // The min random number which could be returned by `r()` (inclusive).
r.Max      // The max random number which could be returned by `r()` (exclusive).
r.Mean     // The expected mean for this distribution.
r.Variance // The expected variance for this distribution.
```

Random source
-------------

Internally Prob.js uses Mersenne Twister provided by [random-js](https://github.com/ckknight/random-js). This can be overridden by providing the `src` argument when generating a number. `src` is expected to be a function that when called returns a signed integer uniformly in the range [-2^31,2^31).

For example:

```js
// https://xkcd.com/221/
function xkcd_source() {
	return 4; // chosen by fair dice roll.
	          // guaranteed to be random.
};

var r = Prob.exponential(1.0); // Create a distribution.

// Use the XKCD source
console.log( r(xkcd_source) );

// Or use a better source (supplied by random-js)
console.log( r(Random.engines.browserCrypto) );

// Or just use the default which happens to be Random.engines.mt19937().autoSeed()
console.log( r() );
```

How to release
--------------

```shell
make clean && make   # Build and test once
mversion patch       # Bump version number (v1.2.3 | major | minor | patch)
make clean && make   # Be extra sure after the version bump it continues to work

git add -f bower.json package.json dist/{prob-min.js,prob-min.js.map,prob.js}
VERSION=v`mversion | tail -n 1 | cut -d ' ' -f 2`
git commit -m "Releasing version $VERSION"
git tag $VERSION
git push origin
git push origin --tags

npm publish          # Publish to npm (publishing to bower is not needed)
```

Licence (Apache 2)
------------------
*This is not an official Google product (experimental or otherwise), it is
just code that happens to be owned by Google.*

```
Copyright 2016 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
