import { Transformer } from "./types";

export const typeScriptTransformer: Transformer<string> = {
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
    return node.items.map((item) => item()).join(" | ");
  },
  xor(node) {
    return node.items.map((item) => item()).join(" | ");
  },
  and(node) {
    return node.items.map((item) => item()).join(" & ");
  },
  array(node) {
    return `Array<${node.items()}>`;
  },
};
