import { ASTNode } from "../../types";

const name = {
  title: "name",
  type: "object",
  properties: {
    prefix: { type: "string" },
    suffix: { type: "string" },
  },
};

export const input = {
  title: "Object with referenced properties",
  type: "object",
  properties: {
    firstName: name,
    lastName: name,
  },
  required: ["lastName"],
};

export const parseOutput: ASTNode = {
  type: "module",
  declarations: [
    {
      name: "Name",
      node: {
        type: "object",
        properties: [
          {
            key: "prefix",
            required: false,
            value: {
              maxLength: 2 ** 53 - 1,
              minLength: 0,
              pattern: ".*",
              type: "string",
            },
          },
          {
            key: "suffix",
            required: false,
            value: {
              maxLength: 2 ** 53 - 1,
              minLength: 0,
              pattern: ".*",
              type: "string",
            },
          },
        ],
      },
    },
    {
      name: "ObjectWithReferencedProperties0",
      node: {
        type: "object",
        properties: [
          { key: "firstName", value: { type: "reference", name: "Name" }, required: false },
          { key: "lastName", value: { type: "reference", name: "Name" }, required: true },
        ],
      },
    },
  ],
  root: {
    name: "ObjectWithReferencedProperties",
    node: {
      type: "reference",
      name: "ObjectWithReferencedProperties0",
    },
  },
};

export const tsOutput = `
  type Name = {
    prefix?: string;
    suffix?: string;
  };

  type ObjectWithReferencedProperties0 = {
    firstName?: Name;
    lastName: Name;
  };

  export type ObjectWithReferencedProperties = ObjectWithReferencedProperties0;
`;
