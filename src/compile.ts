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

export const compile = async <T>(
  schema: JSONSchema7,
  transformer: Transformer<T>,
  options = defaultOptions
): Promise<T> => {
  const ast = await parse(schema, options);
  return transform(ast, transformer);
};
