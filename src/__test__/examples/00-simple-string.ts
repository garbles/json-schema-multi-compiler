import { ASTNode } from "../../types";

export const input = {
  title: "Simple String",
  type: "string",
};

export const parseOutput: ASTNode = {
  type: "module",
  declarations: [],
  root: { name: "SimpleString", node: { type: "string", minLength: 0, maxLength: 2 ** 53 - 1, pattern: ".*" } },
};

export const tsOutput = `
  import * as Runtime from "json-schema-multi-compiler/build/runtimes/typescript";

  export type SimpleString = string;
`;
