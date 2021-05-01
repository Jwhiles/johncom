---
title: You can't change a promise
date: 2021-04-30
tags:
  - javascript
  - programming
---
# You can't change a promise

I've recently understood JavaScript promises and thus realised
I hadn't understood them the past few years that I have spent
as a 'professional' JavaScript developer.

I'm unsure whether I now understand promises as well as the average
JavaScript developer, or if the average JavaScript developer doesn't
understand promises. Figuring that out is left as an exercise for the reader.

## What did I 'understand'?

What I've understood is that promises are immutable.
I think I already 'knew' this - but did not understand the implications of it.

So what does it mean for a promise to be 'immutable'.
It means it cannot be changed. An example of this in JavaScript
is the humble string. You can never change a string.

```javascript
const myString = "hello";

console.log(myString.split("e")); // ['h', 'llo']

console.log(myString); // 'hello'
```

I can call methods on my string that will return a something new and different,
but they don't change the string that I had to begin with.
The same is not true for most other JavaScript entities.

Take an array, for example.

```javascript
const myArray = [1, 2, 3, 4];

myArray.push(5);

console.log(myArray); // [1,2,3,4,5]
```

I can push new elements to my array, and the original array changes. It is
'mutable'.

## Promises again

So, as I said before. Promises _are immutable_. But if you use them
in the way that I have generally used them you might never have noticed this.

Typically when we use promises we do things like this.

```javascript
makeRequest()
  .then(data => doSomethingWithData(data))
  .catch(err => doSomethingWithError(err));

// or in a more up to date way

try {
  const data = await makeRequest();
  doSomethingWithData(data);
} catch (err) {
  doSomethingWithError(err);
}
```

It's quite rare that we hold onto our original promise and
interact with it multiple times, so whether `.then` and `.catch`
mutate the original promise is largely irrelevant to us.

But the fact remains that `.catch` and `.then` do not mutate the original
promise. Both return a new promise. So what are the implications of that?

### Firstly a bug

There's a bug you can very easily introduce! Take a look at this

```javascript
const myPromise = makeRequest()

myPromise.catch(err => doSomethingWithError(err))

myPromise.then(data => doSomethingWithData(data))
```

Do you see the issue?

We are trying to catch errors that might be thrown when making a request for
data, but calling `.catch` creates a new promise. Because we then call `.then`
on the original promise, our attempts to catch the error is in vain.

What we really need to write was this

```javascript
const myPromise = makeRequest();

const myCaughtPromise = myPromise.catch(err => doSomethingWithError(err));

myCaughtPromise.then(data => doSomethingWithData(data));
```

### Secondly, an opportunity

If calling `.then` makes a new promise, and does not change the original promise
this means that we are not constrained in how many promises we can create.
From one original promise we can make as many promises as we want. Hundreds.
Thousands.

But why?

Perhaps we want to wait for our promise to resolve in different places, for different
reasons. And perhaps in these places we want to transform our data in different
ways. We may find ourselves in the awkward position of trying to control various
combinations of transformed and non-transformed data through our code base.

We would need to make sure that each .then is returning the data in a
format that the next .then in the chain can handle. And if we want to
get the data transformed in two different formats we might end up
doing something like this.

```javascript
makeRequest()
  .then(data => {
    const transformedData = transform(data)
    return { data, transformedData
  }})
  .then(({ data, transformedData }) => {
    const differentlyTransformedData = transformDataDifferently(data)
    return { data, transformedData, differentlyTransformedData }
  })
  .then(/* etc */)
```

Hideous.

Instead, because promises are immutable, we can just chain `.then`
on the original promise several times.

```javascript
const request = makeRequest()

request.then(data => transform(data))

request.then(data => transformDataDifferently(data))

// etc
```

Slightly less hideous!

So In summary, despite having 'knowing' that promises were immutable, I
sort of believed and acted like they were mutable. I thought that calling
`.then` on a promise was changing that promise and then returning it.
This is not actually the case.
You can await or .then a promise as many times as you like without
making any change to the original promise.

This might be quite obvious to other people who've worked with
promises, but is something that I had somehow missed entirely. When
I realised that promises work like this it felt like a minor
revelation.

Ok.
