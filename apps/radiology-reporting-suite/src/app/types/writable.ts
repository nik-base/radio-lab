// Referred from https://stackoverflow.com/a/73626355
export type Writable<T> =
  // check for things that are objects but don't need changing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends ((...args: any[]) => any) | Date | RegExp
    ? T
    : T extends ReadonlyMap<infer K, infer V> // maps
      ? Map<Writable<K>, Writable<V>> // make key and values writable
      : T extends ReadonlySet<infer U> // sets
        ? Set<Writable<U>> // make elements writable
        : T extends ReadonlyArray<unknown> // is an array or tuple?
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents
            `${bigint}` extends `${keyof T & any}` // is tuple
            ? { -readonly [K in keyof T]: Writable<T[K]> }
            : Writable<T[number]>[] // is regular array
          : T extends object // is regular object
            ? { -readonly [K in keyof T]: Writable<T[K]> }
            : T; // is primitive or literal value
