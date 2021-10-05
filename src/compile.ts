import { JSONSchema7 } from "json-schema";
import { parse } from "./parse";
import { transform } from "./transform";
import { Transformer } from "./types";

type Options = {
  cwd: string;
};

const defaultOptions: Options = {
  cwd: process.cwd(),
};

export function compile(schema: JSONSchema7, transformers: [], options?: Options): Promise<[]>; // prettier-ignore
export function compile<T>(schema: JSONSchema7, transformers: [Transformer<T>], options?: Options): Promise<[T]>; // prettier-ignore
export function compile<T, U>(schema: JSONSchema7, transformers: [Transformer<T>, Transformer<U>], options?: Options): Promise<[T, U]>; // prettier-ignore
export function compile<T, U, V>(schema: JSONSchema7, transformers: [Transformer<T>, Transformer<U>, Transformer<V>], options?: Options): Promise<[T, U, V]>; // prettier-ignore
export function compile<T, U, V, W>(schema: JSONSchema7, transformers: [Transformer<T>, Transformer<U>, Transformer<V>, Transformer<W>], options?: Options): Promise<[T, U, V, W]>; // prettier-ignore
export function compile<T, U, V, W, X>(schema: JSONSchema7, transformers: [Transformer<T>, Transformer<U>, Transformer<V>, Transformer<W>, Transformer<X>], options?: Options): Promise<[T, U, V, W, X]>; // prettier-ignore
export function compile<T, U, V, W, X, Y>(schema: JSONSchema7, transformers: [Transformer<T>, Transformer<U>, Transformer<V>, Transformer<W>, Transformer<X>, Transformer<Y>], options?: Options): Promise<[T, U, V, W, X, Y]>; // prettier-ignore
export function compile<T, U, V, W, X, Y, Z>(schema: JSONSchema7, transformers: [Transformer<T>, Transformer<U>, Transformer<V>, Transformer<W>, Transformer<X>, Transformer<Y>, Transformer<Z>], options?: Options): Promise<[T, U, V, W, X, Y, Z]>; // prettier-ignore
export async function compile(
  schema: JSONSchema7,
  transformers: Transformer<any>[],
  options = defaultOptions
): Promise<any[]> {
  if (transformers.length === 0) {
    return [];
  }

  const ast = await parse(schema, options);
  const proms = transformers.map((transformer) => transform(ast, transformer));

  return Promise.all(proms);
}
