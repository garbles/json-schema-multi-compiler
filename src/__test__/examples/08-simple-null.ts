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
  export type NullTown = null;
`;
