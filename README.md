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
===

The following distribution are available:

* `uniform(min, max)` Uniform distribution in range [min, max).
* `normal(μ, σ)` Normal distribution with mean and standard deviation.
* `exponential(λ)` Exponential distribution with lambda.
* `lognormal(μ, σ)` Log-normal distribution defined as ln(normal(μ, σ)).
* `zipf(s, N)` Zipf's distribution returning integers in range [1, N]

After generating a distribution, the following methods are available:
* `var r = exponential(1.0);`
* `r()` Generates a number within the distribution
* `r(src)` Generates a number using a `src` of random numbers. (See note later)
* `r.Min` The min value which could be returned (inclusive)
* `r.Max` The max value which could be returned (exclusive)
* `r.Mean` The expected mean for this distribution.
* `r.Variance` The expected variance for this distribution.

Random source
=============

Internally Prob.js uses Mersenne Twister provided by [random-js](https://github.com/ckknight/random-js). This can be overriden by providing the `src` argument when generating a number. Src is expected to be a function that when called returns a number uniformally in the range [0,1).

