import { ASTNode } from "../../types";

export const input = {
  title: "bool baby",
  type: "boolean",
  const: false,
};

export const parseOutput: ASTNode = {
  type: "module",
  declarations: [],
  root: {
    name: "BoolBaby",
    node: {
      type: "const",
      value: false,
    },
  },
};

export const tsOutput = `
  import * as Runtime from "json-schema-multi-compiler/build/runtimes/typescript";

  export type BoolBaby = false;
`;
