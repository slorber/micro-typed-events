# micro-typed-events

[![NPM](https://img.shields.io/npm/dm/micro-typed-events.svg)](https://www.npmjs.com/package/micro-typed-events)
[![Build Status](https://travis-ci.com/slorber/micro-typed-events.svg?branch=master)](https://travis-ci.com/slorber/micro-typed-events)

```ts
const events = createEvents<number>();
const unsubscribe = events.subscribe(num => console.log(num));
events.emit(42);
events.emit(57);
unsubscribe();

events.emit(99); // not logged
events.emit('hey'); // not compiling
```

The smallest, most convenient, typesafe (with TS, but also works with normal JS), event emitter / pubsub system you'll ever need.

Unlike other event emitters, it does not use `on/off/once` methods but only a single subscribe method and returns an unsubscribe handle, which makes it more tiny, easier to type, more convenient to use with arrow functions.

The most minimal code you need for a typesafe pub/sub system, and **feature complete**, making suitable to include as a dependency on other libraries.

## Install

```bash
npm install --save micro-typed-events
// or
yarn add micro-typed-events
```

## Usage

**Simple typed events**

```ts
import { createEvents } from 'micro-typed-events';

const events = createEvents<number>();

const unsubscribe = events.subscribe(num => console.log(num));

events.emit(42);
events.emit('hey'); // Does not compile

unsubscribe();
```

---

**Object typed events**

```ts
import { createEvents } from 'micro-typed-events';

type EventType = { num: number; str: string };
const events = createEvents<EventType>();

const unsubscribe = events.subscribe(obj => console.log(obj));

events.emit({ num: 42, str: 'hello' });
events.emit({ num: 42, str: null }); // Does not compile

unsubscribe();
```

---

**Multiple-args typed events**

```ts
import { createEvents } from 'micro-typed-events';

const events = createEvents<number, string>();

const unsubscribe = events.subscribe((num, str) => console.log(num, str));

events.emit(42, 'hello');
events.emit('hello', 42); // Does not compile

unsubscribe();
```

---

**Advanced typing, dynamic args...**

```ts
import { createEvents } from 'micro-typed-events';

// Listener type is any void function
type ListenerType = (str: string, num: number, ...args: any[]) => void;

const events = createEvents<ListenerType>();

const unsubscribe = events.subscribe((str, num, ...args) =>
  console.log(str, num, ...args),
);

events.emit('hey', 1, 'blaa', 'whatever', 'you', 'want', 1, 2, 3);
events.emit(1, 'hey', 'blaa', 'whatever', 'you', 'want', 1, 2, 3); // Does not compile

unsubscribe();
```

---

**Vanilla JS**

```js
import { createEvents } from 'micro-typed-events';

const events = createEvents();

const unsubscribe = events.subscribe(num => console.log(num));

events.emit(42);
events.emit('hey'); // Does not fail, you should use typescript

unsubscribe();
```

## FAQ

**Should I create a single events object for all my events?**

No, you should rather create one per event-type. You could expose all your events as an object, like this:

```ts
export const ApiEvents = {
  requests: createEvents<Request>(),
  responses: createEvents<Response>(),
  errors: createEvents<Errors>(),
};
```

**Can I unsubscribe directly inside a listener**

Yes, listeners are able to unsubscribe themselves (or other listeners) without messing things up.

**Can I subscribe directly inside a listener**

Yes, but that listener will only be called on next emitted event.

**Can I embed this library in my library?**

Yes, this lib is very tiny. It exports ES and CJS modules. Here's the CJS output, I'll let you judge yourself if you can write something shorter:

```js
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function createEvents() {
    var listeners = [];
    return {
        subscribe: function (listener) {
            listeners.push(listener);
            return function () {
                var index = listeners.indexOf(listener);
                if (index > -1) {
                    listeners.splice(index, 1);
                }
            };
        },
        emit: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // take care of user trying to unsub inside a listener
            listeners.slice().forEach(function (listener) {
                if (listeners.indexOf(listener) > -1) {
                    listener.apply(void 0, args);
                }
            });
        },
    };
}

exports.createEvents = createEvents;
//# sourceMappingURL=index.js.map
```

## License

MIT © [slorber](https://github.com/slorber)

# Hire a freelance expert

Looking for a React/ReactNative freelance expert with more than 5 years production experience?
Contact me from my [website](https://sebastienlorber.com/) or with [Twitter](https://twitter.com/sebastienlorber).
