import { createEvents } from './index';

test('basic usecase', () => {
  const events = createEvents<string>();

  const listener1 = jest.fn();
  const unsub1 = events.subscribe(listener1);

  const listener2 = jest.fn();
  const unsub2 = events.subscribe(listener2);

  events.emit('a');
  unsub1();
  events.emit('b');
  unsub2();
  events.emit('c');
  events.emit('d');

  expect(listener1).toHaveBeenCalledTimes(1);
  expect(listener1.mock.calls[0]).toEqual(['a']);

  expect(listener2).toHaveBeenCalledTimes(2);
  expect(listener2.mock.calls[0]).toEqual(['a']);
  expect(listener2.mock.calls[1]).toEqual(['b']);
});


test('unsub 2 times is no-op', () => {
  const events = createEvents<string>();
  const listener1 = jest.fn();
  const unsub1 = events.subscribe(listener1);

  events.emit('a');
  unsub1();
  unsub1();
  events.emit('b');

  expect(listener1).toHaveBeenCalledTimes(1);
  expect(listener1.mock.calls[0]).toEqual(['a']);
});

test('unsub inside listener does not mess things up', () => {
  const events = createEvents<string>();
  const listener1 = jest.fn();
  const listener2 = jest.fn();
  const listener3 = jest.fn();

  let unsub1: any;
  let unsub2: any;
  let unsub3: any;
  let unsubSelf: any;

  let unsubCallCount = 0;
  const unsubListener = jest.fn(() => {
    unsubCallCount++;
    if (unsubCallCount === 1) {
      unsub1();
      unsub3();
    } else if (unsubCallCount === 2) {
      unsubSelf();
    } else if (unsubCallCount === 3) {
      unsub2(); // Should never happen because unsubListener has been unsubscribed
    }
  });

  unsub1 = events.subscribe(listener1);
  unsubSelf = events.subscribe(unsubListener);
  unsub2 = events.subscribe(listener2);
  unsub3 = events.subscribe(listener3);

  events.emit('a');
  events.emit('b');
  events.emit('c');
  events.emit('d');
  events.emit('e');

  expect(unsubListener).toHaveBeenCalledTimes(2);
  expect(unsubListener.mock.calls[0]).toEqual(['a']);
  expect(unsubListener.mock.calls[1]).toEqual(['b']);

  expect(listener1).toHaveBeenCalledTimes(1);
  expect(listener1.mock.calls[0]).toEqual(['a']);

  expect(listener2).toHaveBeenCalledTimes(5);
  expect(listener2.mock.calls[0]).toEqual(['a']);
  expect(listener2.mock.calls[1]).toEqual(['b']);
  expect(listener2.mock.calls[2]).toEqual(['c']);
  expect(listener2.mock.calls[3]).toEqual(['d']);
  expect(listener2.mock.calls[4]).toEqual(['e']);

  // Should not have been called because unsub ran just before
  expect(listener3).toHaveBeenCalledTimes(0);
});

test('multiple args usecase', () => {
  const events = createEvents<string, number>();
  const listener = jest.fn();
  events.subscribe(listener);
  events.emit('a', 1);
  expect(listener).toHaveBeenCalledWith('a', 1);
});

test('object arg usecase', () => {
  const events = createEvents<{ num: number; str: string }>();
  const listener = jest.fn();
  events.subscribe(listener);
  events.emit({ str: 'a', num: 1 });
  expect(listener).toHaveBeenCalledWith({ str: 'a', num: 1 });
});

test('some complex listener type usecase', () => {
  type ListenerType = (str: string, num: number, ...args: any[]) => void;
  const events = createEvents<ListenerType>();
  const listener = jest.fn();
  events.subscribe(listener);
  events.emit('hey', 1, 'blaa', 'whatever', 'you', 'want', 1, 2, 3);
  expect(listener).toHaveBeenCalledWith(
    'hey',
    1,
    'blaa',
    'whatever',
    'you',
    'want',
    1,
    2,
    3,
  );
});
