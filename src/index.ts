type ArgumentsType<T> = T extends (...args: infer A) => any ? A : never;

type UnsubscribeHandle = () => void;

interface TypedEvents<Listener extends (...args: any[]) => void> {
  subscribe: (listener: Listener) => UnsubscribeHandle;
  emit: (...args: ArgumentsType<Listener>) => void;
}

// This overload has same signature as overloaded function, and ensures the initial fn signature will be choosen
// in priority instead of createEvents<T0> overload
export function createEvents<
  Listener extends (...args: any[]) => void
>(): TypedEvents<Listener>;

// Add some convenient type overloads
// can this be generalized and avoided?
export function createEvents<T0>(): TypedEvents<(arg0: T0) => void>;
export function createEvents<T0, T1>(): TypedEvents<
  (arg0: T0, arg1: T1) => void
>;
export function createEvents<T0, T1, T2>(): TypedEvents<
  (arg0: T0, arg1: T1, arg2: T2) => void
>;
export function createEvents<T0, T1, T2, T3>(): TypedEvents<
  (arg0: T0, arg1: T1, arg2: T2, arg3: T3) => void
>;
export function createEvents<T0, T1, T2, T3, T4>(): TypedEvents<
  (arg0: T0, arg1: T1, arg2: T2, arg3: T3, arg4: T4) => void
>;

export function createEvents<T0, T1, T2, T3, T4, T5>(): TypedEvents<
  (arg0: T0, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5) => void
>;

export function createEvents<
  Listener extends (...args: any[]) => void
>(): TypedEvents<Listener> {
  const listeners: Listener[] = [];
  return {
    subscribe: (listener: Listener): UnsubscribeHandle => {
      listeners.push(listener);
      return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      };
    },
    emit: (...args: ArgumentsType<Listener>) => {
      // take care of user trying to unsub inside a listener
      [...listeners].forEach(listener => {
        if (listeners.indexOf(listener) !== -1) {
          listener(...args);
        }
      });
    },
  };
}
