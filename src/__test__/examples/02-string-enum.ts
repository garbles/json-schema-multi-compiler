import { ASTNode } from "../../types";

export const input = {
  title: "String-Enum",
  type: "string",
  enum: ["a", "b", "c"],
};

export const parseOutput: ASTNode = {
  type: "module",
  declarations: [],
  root: {
    name: "StringEnum",
    node: {
      type: "or",
      items: [
        { type: "const", value: "a" },
        { type: "const", value: "b" },
        { type: "const", value: "c" },
      ],
    },
  },
};

export const tsOutput = `
  import * as Runtime from "json-schema-multi-compiler/build/runtimes/typescript";

  export type StringEnum = "a" | "b" | "c";
`;
