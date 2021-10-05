import { ASTNode } from "../../types";

export const input = {
  title: "Non-homogenous Array",
  type: "array",
  minItems: 0,
  maxItems: 10,
  items: [
    {
      type: "string",
      maxLength: 50,
    },
    {
      type: "number",
      maximum: 10,
      minimum: 0,
    },
  ],
};

export const parseOutput: ASTNode = {
  type: "module",
  declarations: [],
  root: {
    name: "NonHomogenousArray",
    node: {
      type: "array",
      minItems: 0,
      maxItems: 10,
      uniqueItems: false,
      items: {
        type: "or",
        items: [
          {
            type: "string",
            minLength: 0,
            maxLength: 50,
            pattern: ".*",
          },
          {
            type: "number",
            minimum: {
              value: 0,
              exclusive: false,
            },
            maximum: {
              value: 10,
              exclusive: false,
            },
          },
        ],
      },
    },
  },
};

export const tsOutput = `
  export type NonHomogenousArray = Array<string | number>;
`;
