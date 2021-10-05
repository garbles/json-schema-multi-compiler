import { ASTNode } from "../../types";

export const input = {
  title: "Array with no items",
  type: "array",
  uniqueItems: true,
};

export const parseOutput: ASTNode = {
  type: "module",
  declarations: [],
  root: {
    name: "ArrayWithNoItems",
    node: {
      type: "array",
      minItems: 0,
      maxItems: 2 ** 32,
      uniqueItems: true,
      items: {
        type: "unknown",
      },
    },
  },
};

export const tsOutput = `
  export type ArrayWithNoItems = Array<unknown>;
`;
