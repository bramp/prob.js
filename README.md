Prob.js
=============================================
Generate random numbers from different probability distributions.

by [Andrew Brampton](https://bramp.net) 2016

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
Prob.zipf(s, N)        // Zipf's distribution returning integers in range [1, N]
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

Internally Prob.js uses Mersenne Twister provided by [random-js](https://github.com/ckknight/random-js). This can be overriden by providing the `src` argument when generating a number. Src is expected to be a function that when called returns a signed integer uniformally in the range [-2^31,2^31).

For example
```js
// https://xkcd.com/221/
function xkcd_source() {
	return 4; // chosen by fair dice roll.
	          // guranteed to be random.
};

var r = Prob.exponential(1.0); // Create a distribution.

// Use the XKCD source
console.log( r(xkcd_source) );

// Or use a better source (supplied by random-js)
console.log( r(Random.engines.browserCrypto) );

// Or just use the default which happens to be Random.engines.mt19937().autoSeed()
console.log( r() );

```

Licence (Apache 2)
------------------
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
