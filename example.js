import store from './src/index';
import { objToDot } from './src/utils';

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

const state = store(initialState);

state.subscribe('update', (e)=>{
  console.log('update', e.payload);
})

console.log('GET');
console.log(state.get('hans'));
console.log(state.get('nested'));
console.log(state.get('nested.seppel'));
console.log(state.get('nested.fred.name'));
console.log('SET');
state.set('nested.fred.name', 'HASS');
console.log(state.get('nested.fred.name'));

console.log('####################################');
// console.log(objToDot(initialState));
console.log(state.toJSON());

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


console.log(newStore.toJSON());
