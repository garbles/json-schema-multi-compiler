import { ASTNode } from "../../types";

export const input = {
  title: "One of",
  oneOf: [
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
      name: "OneOf0",
      node: {
        type: "object",
        properties: [
          { key: "name", value: { type: "string", minLength: 0, maxLength: 50, pattern: ".*" }, required: false },
        ],
      },
    },
    {
      name: "OneOf1",
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
    name: "OneOf",
    node: {
      type: "xor",
      items: [
        {
          type: "reference",
          name: "OneOf0",
        },
        {
          type: "reference",
          name: "OneOf1",
        },
      ],
    },
  },
};

export const tsOutput = `
  import * as Runtime from "json-schema-multi-compiler/build/runtimes/typescript";

  type OneOf0 = {
    name?: string;
  };

  type OneOf1 = {
    age?: number;
  };

  export type OneOf = Runtime.XOR<OneOf0, OneOf1>;
`;
