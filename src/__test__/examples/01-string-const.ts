import { ASTNode } from "../../types";

export const input = {
  title: "string const",
  type: "string",
  const: "potato",
};

export const parseOutput: ASTNode = {
  type: "module",
  declarations: [],
  root: { name: "StringConst", node: { type: "const", value: "potato" } },
};

export const tsOutput = `
  import * as Runtime from "json-schema-multi-compiler/build/runtimes/typescript";

  export type StringConst = "potato";
`;
