import { ASTNode } from "../../types";

export const input = {
  title: "Object without properties",
  type: "object",
};

export const parseOutput: ASTNode = {
  type: "module",
  declarations: [
    {
      name: "ObjectWithoutProperties0",
      node: {
        type: "object",
        properties: [],
      },
    },
  ],

  root: {
    name: "ObjectWithoutProperties",
    node: {
      type: "reference",
      name: "ObjectWithoutProperties0",
    },
  },
};

export const tsOutput = `
  import * as Runtime from "json-schema-multi-compiler/build/runtimes/typescript";

  type ObjectWithoutProperties0 = {};

  export type ObjectWithoutProperties = ObjectWithoutProperties0;
`;
