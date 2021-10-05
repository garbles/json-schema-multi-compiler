import { ASTNode } from "../../types";

export const input = {
  title: "string all of with unknown",
  allOf: [{ type: "string" }, { maxLength: 50 }],
};

export const parseOutput: ASTNode = {
  type: "module",
  declarations: [],
  root: {
    name: "StringAllOfWithUnknown",
    node: {
      type: "and",
      items: [
        {
          type: "string",
          minLength: 0,
          maxLength: 2 ** 53 - 1,
          pattern: ".*",
        },
        {
          type: "unknown",
        },
      ],
    },
  },
};

export const tsOutput = `
  export type StringAllOfWithUnknown = string & unknown;
`;
