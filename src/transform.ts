import { ASTNode, Transformer } from "./types";

export const transform = <T>(node: ASTNode, transformer: Transformer<T>): T => {
  switch (node.type) {
    case "string": {
      return transformer.string(node);
    }

    case "number": {
      return transformer.number(node);
    }

    case "boolean": {
      return transformer.boolean(node);
    }

    case "null": {
      return transformer.null(node);
    }

    case "const": {
      return transformer.const(node);
    }

    case "unknown": {
      return transformer.unknown(node);
    }

    case "reference": {
      return transformer.reference(node);
    }

    case "object": {
      const properties = node.properties.map((property) => {
        return {
          ...property,
          value: () => transform(property.value, transformer),
        };
      });

      return transformer.object({ ...node, properties });
    }

    case "module": {
      const declarations = node.declarations.map((decl) => {
        return {
          ...decl,
          node: () => transform(decl.node, transformer),
        };
      });

      const root = {
        ...node.root,
        node: () => transform(node.root.node, transformer),
      };

      return transformer.module({ ...node, declarations, root });
    }

    case "or": {
      const items = node.items.map((item) => () => transform(item, transformer));
      return transformer.or({ ...node, items });
    }

    case "xor": {
      const items = node.items.map((item) => () => transform(item, transformer));
      return transformer.xor({ ...node, items });
    }

    case "and": {
      const items = node.items.map((item) => () => transform(item, transformer));
      return transformer.and({ ...node, items });
    }

    case "array": {
      const items = () => transform(node.items, transformer);
      return transformer.array({ ...node, items });
    }
  }
};
