import { ASTNode } from "../../types";

export const input = {
  title: "number    enum",
  type: "number",
  enum: [-1, 10, 50.5],
};

export const parseOutput: ASTNode = {
  type: "module",
  declarations: [],
  root: {
    name: "NumberEnum",
    node: {
      type: "or",
      items: [
        { type: "const", value: -1 },
        { type: "const", value: 10 },
        { type: "const", value: 50.5 },
      ],
    },
  },
};

export const tsOutput = `
  import * as Runtime from "json-schema-multi-compiler/build/runtimes/typescript";

  export type NumberEnum = -1 | 10 | 50.5;
`;
