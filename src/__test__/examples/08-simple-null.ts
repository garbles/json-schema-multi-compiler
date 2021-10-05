import { ASTNode } from "../../types";

export const input = {
  title: "null town",
  type: "null",
};

export const parseOutput: ASTNode = {
  type: "module",
  declarations: [],
  root: {
    name: "NullTown",
    node: {
      type: "null",
    },
  },
};

export const tsOutput = `
  import * as Runtime from "json-schema-multi-compiler/build/runtimes/typescript";

  export type NullTown = null;
`;
