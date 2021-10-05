import { ASTNode } from "../../types";

export const input = {
  title: "Simple Array",
  type: "array",
  maxItems: 100,
  items: {
    type: "string",
    maxLength: 50,
  },
};

export const parseOutput: ASTNode = {
  type: "module",
  declarations: [],
  root: {
    name: "SimpleArray",
    node: {
      type: "array",
      minItems: 0,
      maxItems: 100,
      uniqueItems: false,
      items: {
        type: "string",
        minLength: 0,
        maxLength: 50,
        pattern: ".*",
      },
    },
  },
};

export const tsOutput = `
  export type SimpleArray = Array<string>;
`;
