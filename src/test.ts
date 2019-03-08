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
  type ListenerType = (str: string, num: number, ...args: any[]) => void
  const events = createEvents<ListenerType>();
  const listener = jest.fn();
  events.subscribe(listener);
  events.emit('hey', 1, 'blaa', 'whatever', 'you', 'want', 1, 2, 3);
  expect(listener).toHaveBeenCalledWith('hey', 1, 'blaa', 'whatever', 'you', 'want', 1, 2, 3);
});
