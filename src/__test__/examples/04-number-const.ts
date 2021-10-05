import { ASTNode } from "../../types";

export const input = {
  title: "integer const",
  type: "integer",
  const: 123,
};

export const parseOutput: ASTNode = {
  type: "module",
  declarations: [],
  root: { name: "IntegerConst", node: { type: "const", value: 123 } },
};

export const tsOutput = `
  import * as Runtime from "json-schema-multi-compiler/build/runtimes/typescript";

  export type IntegerConst = 123;
`;
