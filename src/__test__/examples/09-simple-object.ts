import { ASTNode } from "../../types";

export const input = {
  title: "Simple Object",
  type: "object",
  properties: {
    firstName: {
      type: "string",
      maxLength: 50,
    },
    lastName: {
      type: "string",
      maxLength: 50,
    },
  },
  required: ["firstName"],
};

export const parseOutput: ASTNode = {
  type: "module",
  declarations: [
    {
      name: "SimpleObject0",
      node: {
        type: "object",
        properties: [
          { key: "firstName", value: { type: "string", minLength: 0, maxLength: 50, pattern: ".*" }, required: true },
          { key: "lastName", value: { type: "string", minLength: 0, maxLength: 50, pattern: ".*" }, required: false },
        ],
      },
    },
  ],
  root: {
    name: "SimpleObject",
    node: {
      type: "reference",
      name: "SimpleObject0",
    },
  },
};

export const tsOutput = `
  type SimpleObject0 = {
    firstName: string;
    lastName?: string;
  };

  export type SimpleObject = SimpleObject0;
`;
