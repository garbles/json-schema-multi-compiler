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
  export type BoolBaby = false;
`;
