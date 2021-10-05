import { Transformer } from "../types";

export const typescript: Transformer<string> = {
  string() {
    return "string";
  },
  number() {
    return "number";
  },
  boolean() {
    return "boolean";
  },
  null() {
    return "null";
  },
  unknown() {
    return "unknown";
  },
  module(node) {
    const declarations = node.declarations.map((decl) => `type ${decl.name} = ${decl.node()};`).join("\n");

    return `
      import * as Runtime from "json-schema-multi-compiler/build/runtimes/typescript";

      ${declarations};
      export type ${node.root.name} = ${node.root.node()};
    `;
  },
  reference(node) {
    return node.name;
  },
  const(node) {
    return JSON.stringify(node.value, null, 2);
  },
  object(node) {
    const properties = node.properties
      .map((prop) => `${prop.key}${prop.required ? ":" : "?:"} ${prop.value()};`)
      .join("\n");

    return `{ ${properties} }`;
  },
  or(node) {
    if (node.items.length === 0) {
      return "unknown";
    }

    return node.items.map((item) => item()).join(" | ");
  },
  xor(node) {
    if (node.items.length === 0) {
      return "unknown";
    }

    if (node.items.length === 1) {
      return node.items[0]();
    }

    const items = node.items.map((item) => item()).join(", ");

    return `Runtime.XOR<[${items}]>`;
  },
  and(node) {
    if (node.items.length === 0) {
      return "unknown";
    }

    return node.items.map((item) => item()).join(" & ");
  },
  array(node) {
    return `Array<${node.items()}>`;
  },
};
