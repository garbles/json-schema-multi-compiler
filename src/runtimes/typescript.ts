type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR2<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

// prettier-ignore
export type XOR<A extends any[]> =
  A extends [infer T, infer U, ...infer Rest] ? XOR<[XOR2<T, U>, ...Rest]> :
  A extends [infer T] ? T :
  never;
