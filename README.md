# micro-typed-events

[![NPM](https://img.shields.io/npm/dm/micro-typed-events.svg)](https://www.npmjs.com/package/micro-typed-events) 
[![Build Status](https://travis-ci.com/slorber/micro-typed-events.svg?branch=master)](https://travis-ci.com/slorber/micro-typed-events)




The smallest, most convenient, typesafe (with TS, but also works with normal JS), event emitter / pubsub system you'll ever need.

Unlike other event emitters, it does not use `on/off/once` methods but only a single subscribe method and returns an unsubscribe handle, which makes it more tiny, easier to type, more convenient to use with arrow functions.

The most minimal code you need for a typesafe pub/sub system, and feature complete, making **suitable to include as a dependency on other libraries**.

## Install

```bash
npm install --save micro-typed-events
// or
yarn add micro-typed-events
```

## Usage

```ts
import { createEvents } from "micro-typed-events";

const numberEvents = createEvents<number>();

const unsubscribe = numberEvents.subscribe(num => console.log(num));

numberEvents.emit(42);
numberEvents.emit("hey"); // Does not compile

unsubscribe();
```


## License

MIT © [slorber](https://github.com/slorber)

# Hire a freelance expert

Looking for a React/ReactNative freelance expert with more than 5 years production experience?
Contact me from my [website](https://sebastienlorber.com/) or with [Twitter](https://twitter.com/sebastienlorber).
