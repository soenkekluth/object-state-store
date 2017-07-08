var store = require('./dist/ost').store;
var {objToDot} = require('./lib/utils');

const initialState = {

  hans: 'hans',
  nested: {
    seppel: 'seppel',
    fred: {
      name: 'fred',
      test: 'test'
    }
  }

};

const mainStore = store(initialState);

mainStore.subscribe('update', (e)=>{
  console.log('update', e.payload);
})

console.log('GET');
console.log(mainStore.get('hans'));
console.log(mainStore.get('nested'));
console.log(mainStore.get('nested.seppel'));
console.log(mainStore.get('nested.fred.name'));
console.log('SET');
mainStore.set('nested.fred.name', 'HASS');
console.log(mainStore.get('nested.fred.name'));

console.log('####################################');
// console.log(objToDot(initialState));
console.log(mainStore.toJSON());

const newStore = store({
  user: {
    name: 'peter',
    surname: 'pan',
    friends: ['hans', 'paul', 'peter']
  }
});


newStore.set({ peter: 'pan' });

newStore.set({
    foo1: 'bar1',
    foo2: 'bar2',
    baz: {
      boo: 'foo',
      foo: {
        bar: 'baz'
      }
    }
  });


newStore.set('user.surname', 'panic');





const aStore = store({
  name: 'lalql',
  active: false,
  details: {
    some: 'thing'
  }
});


mainStore.set('aStore', aStore);


aStore.subscribe('name', (e) => {
  console.log('hiiiier');
 console.log(e);
});

mainStore.set('aStore.name', 'mystore');
// newStore.set('name', 'mystore');

// console.log(newStore.toJSON());
