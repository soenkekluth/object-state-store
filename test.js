import { serial as test } from 'ava';
import store from './';

test.beforeEach(t => {
  t.context.store = new store({ hans: 'wurst' });
});

test('.set() and .get()', t => {
  t.context.store.set({ peter: 'pan' });
  // t.context.store.set('baz.boo', true);
  t.is(t.context.store.get('peter'), 'pan');
  // t.is(t.context.store.get('baz.boo'), true);
});


test('.set() with object and .get()', t => {
  t.context.store.set({
    foo1: 'bar1',
    foo2: 'bar2',
    baz: {
      boo: 'foo',
      foo: {
        bar: 'baz'
      }
    }
  });
  t.is(t.context.store.get('foo1'), 'bar1');
  t.is(t.context.store.get('foo2'), 'bar2');
  t.deepEqual(t.context.store.get('baz'), {
    boo: 'foo',
    foo: {
      bar: 'baz'
    }
  });
  t.is(t.context.store.get('baz.boo'), 'foo');
  t.deepEqual(t.context.store.get('baz.foo'), {bar: 'baz'});
  t.is(t.context.store.get('baz.foo.bar'), 'baz');
});
// test('.has()', t => {
//   t.context.store.set('foo', '🦄');
//   t.context.store.set('baz.boo', '🦄');
//   t.true(t.context.store.has('foo'));
//   t.true(t.context.store.has('baz.boo'));
//   t.false(t.context.store.has('missing'));
// });
// test('.delete()', t => {
//   t.context.store.set('foo', 'bar');
//   t.context.store.set('baz.boo', true);
//   t.context.store.set('baz.foo.bar', 'baz');
//   t.context.store.delete('foo');
//   t.not(t.context.store.get('foo'), 'bar');
//   t.context.store.delete('baz.boo');
//   t.not(t.context.store.get('baz.boo'), true);
//   t.context.store.delete('baz.foo');
//   t.not(t.context.store.get('baz.foo'), {bar: 'baz'});
//   t.context.store.set('foo.bar.baz', {awesome: 'icecream'});
//   t.context.store.set('foo.bar.zoo', {awesome: 'redpanda'});
//   t.context.store.delete('foo.bar.baz');
//   t.is(t.context.store.get('foo.bar.zoo.awesome'), 'redpanda');
// });
// test('.clear()', t => {
//   t.context.store.set('foo', 'bar');
//   t.context.store.set('foo1', 'bar1');
//   t.context.store.set('baz.boo', true);
//   t.context.store.clear();
//   t.is(t.context.store.size, 0);
// });
// test('.all', t => {
//   t.context.store.set('foo', 'bar');
//   t.context.store.set('baz.boo', true);
//   t.is(t.context.store.all.foo, 'bar');
//   t.deepEqual(t.context.store.all.baz, {boo: true});
// });
// test('.size', t => {
//   t.context.store.set('foo', 'bar');
//   t.is(t.context.store.size, 1);
// });
// test('.path', t => {
//   t.context.store.set('foo', 'bar');
//   t.true(fs.existsSync(t.context.store.path));
// });
// test('use default value', t => {
//   const conf = new Configstore('configstore-test', {foo: 'bar'});
//   t.is(conf.get('foo'), 'bar');
// });
// test('support global namespace path option', t => {
//   const conf = new Configstore('configstore-test', {}, {globalConfigPath: true});
//   const regex = /configstore-test(\/|\\)config.json$/;
//   t.true(regex.test(conf.path));
// });
// test('ensure `.all` is always an object', t => {
//   fs.unlinkSync(configstorePath);
//   t.notThrows(() => t.context.store.get('foo'));
// });
