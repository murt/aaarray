# ![AAArray](https://raw.githubusercontent.com/murt/aaarray/assets/logo.png)

### Typed Async / Await Arrays

[![NPM](https://img.shields.io/npm/v/aaarray?style=for-the-badge)](https://npmjs.com/package/aaarray)
[![License](https://img.shields.io/npm/l/aaarray?color=blue&style=for-the-badge)](./LICENSE)
[![Status](https://img.shields.io/github/workflow/status/murt/aaarray/CI?style=for-the-badge)](https://github.com/murt/aaarray/actions?query=workflow%3ACI)
[![Coverage](https://img.shields.io/coveralls/github/murt/aaarray?style=for-the-badge)](https://coveralls.io/github/murt/aaarray)
[![Maintainability](https://img.shields.io/codeclimate/maintainability/murt/aaarray?style=for-the-badge)](https://codeclimate.com/github/murt/aaarray)

Have you ever wanted to write something like this?

```javascript
await [1, 2, 3]
.map(n => (await fetch(`https://example.com/${n}`)).json())
.filter(r => checkAsync(r));
```

Well you still kind of can but it's not... pretty.

```javascript
Promise.all([1, 2, 3]
.map(n => fetch(`https://example.com/${n}`)))
.then(results => Promise.all(results.map(res => res.json())))
.then(results => Promise.all(results.map(r => checkAsync(r))))
.then(results => results.filter(Boolean));
```

What if you also wanted to reduce, or forEach, or flat, or any other array method? It can get pretty complicated with a lot of boiler plate to make sure that your async array operations run how you expect.

This is where **AAArray** (pronounced *eh-eh-array*) comes in - with a single wrapper function you can create an array that handles both async and sync callbacks in the exact same manner as normal arrays, completely chainable too!

```javascript
import AA from "aaarray";

await AA([1, 2, 3])
.map(n => (await fetch(`https://example.com/${n}`).json()))
.filter(r => checkAsync(r));
```

## How?

`AAArray` keeps an internal array and a queue of actions to run when told to resolve. `AAArray` is a `PromiseLike` that will resolve with a normal, ie. non-`AAArray`, value.

There is a neat syntactical trick that is used here: `await` will *automatically* put in a call to `then` thus allowing us to leave off any "promisy" looking syntax. Of course if you are in an environment where `async`/`await` is not available just use `then` as you would on a normal `Promise` to get the result of the AAArray.

## (Im)mutable

The internal array that an AAArray instance uses to keep the running valuation is immutable in the sense that it is reassigned with each stage of the chain. For all intents and purposes consider AAArray instances as immutable.

However many of the methods in the `Array` API can directly mutate or otherwise alter the array while still returning something else. For example `pop()` will alter the array by removing the first element but the method also *returns* that first element.

## Serial Alternatives

Introducing async support to some array methods meant that the iterator could be run in parallel. However, there may be instances where a developer wants to wait for each iteration to finish in order before proceeding to the next one. Each method therefore has a serial alternative, suffixed with `Serial`, that performs the operation in serial instead. 

*Note that `reduce` and `reduceRight` are serial only methods as a parallel accumulator is a horrid sepulcra of race conditions.*

## Additional Methods

While the full `Array` API is present I have also added some additional methods that helped fill the gap between the synchronous API and the chainable async nature of `AAArray`.

### `get`

Gets the value at a given index.

```javascript
await AA([1,2,3]).get(0)
```

Functionally identical to the following:

```javascript
(await AA([1,2,3]))[0]
```

### `each` / `eachSerial`

Iterates over the values in array without mutating them, returns the AAArray as opposed to `forEach` which resolves with `void`.

```javascript
await AA([1,2,3]).each(n => console.log(n))
```

## Typescript

This project is written in Typescript and will correctly type each stage in a chain. For example if you run a map that changes the type this will be reflected immediately in the next callback you use in the chain.

```typescript
// Simple type change
await AA([1, 2, 3])
.map((n: number) => n.toString())
.forEach((s: string) => console.log(s));

// Automatically understands union types as well
await AA([1,2,3])
.map((n: number) => n % 2 ? n.toString() : n)
.forEach((v: string | number) => console.log(s))
```

If you encounter any issues with this please let me know as I find the type system fascinating and will forsake all other issues to investigate it.

In addition, Typescript complains about directly bound methods being passed as callbacks to normal Array methods that don't fully satisfy the callback API expected - for example if you wanted to log each item in a `forEach` with `console.log.bind(console)`. This is possible with AAArray for no other reason than because I wanted it.
