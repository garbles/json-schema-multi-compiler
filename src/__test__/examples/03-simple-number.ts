import { ASTNode } from "../../types";

export const input = {
  title: "simple number",
  type: "number",
};

export const parseOutput: ASTNode = {
  type: "module",
  declarations: [],
  root: {
    name: "SimpleNumber",
    node: {
      type: "number",
      maximum: { value: 2 ** 53 - 1, exclusive: false },
      minimum: { value: -(2 ** 53) + 1, exclusive: false },
    },
  },
};

export const tsOutput = `
  import * as Runtime from "json-schema-multi-compiler/build/runtimes/typescript";

  export type SimpleNumber = number;
`;
