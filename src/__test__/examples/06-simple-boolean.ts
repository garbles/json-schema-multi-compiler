import { ASTNode } from "../../types";

export const input = {
  title: "bool baby",
  type: "boolean",
};

export const parseOutput: ASTNode = {
  type: "module",
  declarations: [],
  root: {
    name: "BoolBaby",
    node: {
      type: "boolean",
    },
  },
};

export const tsOutput = `
  export type BoolBaby = boolean;
`;
