[![Build Status](https://travis-ci.org/soenkekluth/object-state-store.svg?branch=master)](https://travis-ci.org/soenkekluth/object-state-store)

# object-state-store

> observable stateful object store



## Usage

```js
const store = require('object-state-store').store;
// es6
import { store } from 'object-state-store';

// create a Store instance with an initial state
const myStore = store({foo: 'bar'});

console.log(myStore.get('foo'));
//=> 'bar'

myStore.set('awesome', true);
console.log(myStore.get('awesome'));
//=> true

// Use dot-notation to access nested properties
myStore.set('bar.baz', true);
console.log(myStore.get('bar'));
//=> {baz: true}

myStore.delete('awesome');
console.log(myStore.get('awesome'));
//=> undefined
```


## API

### store([state])

Returns a new instance.

#### state

Type: `Object`

### Instance

You can use dot-notation in a `key` to access nested properties.

### .set(key, value)

Set an item.

### .set(object)

Set multiple items at once.

### .get(key)

Get an item.

### .has(key)

Check if an item exists.

### .delete(key)

Delete an item.

### .size

Get the item count.

### .subscribe(key, handler)

Subscribe to changes on an object. You can use dot-notation here also

### .clone()

Create a clone of the store instance

### .cloneState()

Create a clone of the state

### .getState()

Get the current state.

### .getLastState()

Get the last state.

### .toJSON()

Get the sored data as JSON.

## License

MIT
