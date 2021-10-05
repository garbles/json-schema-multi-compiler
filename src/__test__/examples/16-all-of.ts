import { ASTNode } from "../../types";

export const input = {
  title: "AllOf",
  allOf: [
    {
      type: "object",
      properties: {
        name: { type: "string", maxLength: 50 },
      },
    },
    {
      type: "object",
      properties: {
        age: { type: "number", minimum: 0, maximum: 100 },
      },
    },
  ],
};

export const parseOutput: ASTNode = {
  type: "module",
  declarations: [
    {
      name: "AllOf0",
      node: {
        type: "object",
        properties: [
          { key: "name", value: { type: "string", minLength: 0, maxLength: 50, pattern: ".*" }, required: false },
        ],
      },
    },
    {
      name: "AllOf1",
      node: {
        type: "object",
        properties: [
          {
            key: "age",
            value: {
              type: "number",
              minimum: { value: 0, exclusive: false },
              maximum: { value: 100, exclusive: false },
            },
            required: false,
          },
        ],
      },
    },
  ],
  root: {
    name: "AllOf",
    node: {
      type: "and",
      items: [
        {
          type: "reference",
          name: "AllOf0",
        },
        {
          type: "reference",
          name: "AllOf1",
        },
      ],
    },
  },
};

export const tsOutput = `
  type AllOf0 = {
    name?: string;
  };

  type AllOf1 = {
    age?: number;
  };

  export type AllOf = AllOf0 & AllOf1;
`;
