import RefParser from "@apidevtools/json-schema-ref-parser";
import { JSONSchema7 } from "json-schema";
import camelcase from "lodash.camelcase";
import upperFirst from "lodash.upperfirst";
import { ASTNode } from "./types";

type Options = {
  cwd: string;
};

const defaultOptions: Options = {
  cwd: process.cwd(),
};

const reference = (obj: { name: string }): ASTNode => {
  return {
    type: "reference",
    name: obj.name,
  };
};

const unknown = (): ASTNode => ({ type: "unknown" });

type ObjectReferenceProcessorEntry = {
  name: string;
  node: ASTNode;
};

const stringToName = (str: string) => upperFirst(camelcase(str));

class NameCache {
  static root(rootKey: string) {
    const used = new Set([rootKey]);
    const counter = 0;

    return new NameCache(used, counter);
  }

  #used: Set<string>;
  #counter: number;

  constructor(used: Set<string>, counter: number) {
    this.#used = used;
    this.#counter = counter;
  }

  uniqueNameFor(keyPath: string[]) {
    const joined = keyPath.join("");
    let value = joined;

    while (this.#used.has(value)) {
      value = joined + (this.#counter++).toString();
    }

    this.#used.add(value);

    return value;
  }
}

class ObjectReferenceProcessor {
  static root(rootKey: string) {
    return new ObjectReferenceProcessor(new Map(), NameCache.root(rootKey), [rootKey]);
  }

  #entries: Map<JSONSchema7, ObjectReferenceProcessorEntry>;
  #keyPath: string[];
  #usedNames: NameCache;

  constructor(entries: Map<JSONSchema7, ObjectReferenceProcessorEntry>, usedNames: NameCache, keyPath: string[]) {
    this.#entries = entries;
    this.#keyPath = keyPath;
    this.#usedNames = usedNames;
  }

  has(schema: JSONSchema7): boolean {
    return this.#entries.has(schema);
  }

  get(schema: JSONSchema7): ASTNode | null {
    const entry = this.#entries.get(schema);

    if (entry !== undefined) {
      return reference(entry);
    }

    return null;
  }

  getAll(): ObjectReferenceProcessorEntry[] {
    return Array.from(this.#entries.values());
  }

  register(schema: JSONSchema7, node: ASTNode) {
    const entry = this.get(schema);

    if (entry !== null) {
      return entry;
    }

    const name = this.#usedNames.uniqueNameFor(this.#keyPath);

    this.#entries.set(schema, { name, node });

    return reference({ name });
  }

  refine(key: string) {
    return new ObjectReferenceProcessor(this.#entries, this.#usedNames, [...this.#keyPath, key]);
  }

  refineAsBase(key: string) {
    return new ObjectReferenceProcessor(this.#entries, this.#usedNames, [key]);
  }
}

const bundle = (schema: JSONSchema7, options: Options) => {
  const parser = new RefParser();
  return parser.bundle(options.cwd, schema, {}) as JSONSchema7;
};

const walk = (schema: JSONSchema7, processor: ObjectReferenceProcessor): ASTNode => {
  if (processor.has(schema)) {
    return processor.get(schema)!;
  }

  // need to call `processor.get` here and if it's already declared then just return it
  // also change the processor definition here to only what is required and have
  // ObjectReferenceProcessor implement it

  if (typeof schema.type !== "string") {
    if (Array.isArray(schema.allOf)) {
      const items = schema.allOf
        ?.filter((val): val is JSONSchema7 => typeof val !== "boolean")
        .map((val, index) => {
          const nextProcessor = processor.refine(index.toString());
          return walk(val, nextProcessor);
        });

      return {
        type: "and",
        items,
      };
    } else if (Array.isArray(schema.oneOf)) {
      const items = schema.oneOf
        ?.filter((val): val is JSONSchema7 => typeof val !== "boolean")
        .map((val, index) => {
          const nextProcessor = processor.refine(index.toString());
          return walk(val, nextProcessor);
        });

      return {
        type: "xor",
        items,
      };
    } else {
      return unknown();
    }
  }

  switch (schema.type) {
    case "string": {
      if (typeof schema.const === "string") {
        return { type: "const", value: schema.const };
      } else if (Array.isArray(schema.enum) && schema.enum.every((val) => typeof val === "string")) {
        const items = schema.enum ?? [];
        return { type: "or", items: items.map((str) => ({ type: "const", value: str })) };
      } else if (Array.isArray(schema.anyOf) && schema.anyOf.every((val) => typeof val === "string")) {
        const items = schema.anyOf ?? [];
        return { type: "or", items: items.map((str) => ({ type: "const", value: str })) };
      } else {
        return {
          type: "string",
          minLength: schema.minLength ?? 0,
          maxLength: schema.maxLength ?? 2 ** 53 - 1,
          pattern: schema.pattern ?? ".*",
        };
      }
    }

    case "integer":
    case "number": {
      if (typeof schema.const === "number") {
        return { type: "const", value: schema.const };
      } else if (Array.isArray(schema.enum) && schema.enum.every((val) => typeof val === "number")) {
        const items = schema.enum ?? [];
        return { type: "or", items: items.map((str) => ({ type: "const", value: str })) };
      } else if (Array.isArray(schema.anyOf) && schema.anyOf.every((val) => typeof val === "number")) {
        const items = schema.anyOf ?? [];
        return { type: "or", items: items.map((str) => ({ type: "const", value: str })) };
      } else {
        const maximum = {
          value: 2 ** 53 - 1,
          exclusive: false,
        };

        const minimum = {
          value: -(2 ** 53) + 1,
          exclusive: false,
        };

        if (typeof schema.maximum === "number") {
          maximum.value = schema.maximum;
        } else if (typeof schema.exclusiveMaximum === "number") {
          maximum.value = schema.exclusiveMaximum;
          maximum.exclusive = true;
        }

        if (typeof schema.minimum === "number") {
          minimum.value = schema.minimum;
        } else if (typeof schema.exclusiveMinimum === "number") {
          minimum.value = schema.exclusiveMinimum;
          minimum.exclusive = true;
        }

        return {
          type: "number",
          maximum,
          minimum,
        };
      }
    }

    case "boolean": {
      if (typeof schema.const === "boolean") {
        return { type: "const", value: schema.const };
      } else {
        return {
          type: "boolean",
        };
      }
    }

    case "null": {
      return {
        type: "null",
      };
    }

    case "object": {
      type Property = { key: string; value: ASTNode; required: boolean };
      const properties: Property[] = [];

      for (const key in schema.properties) {
        let value: ASTNode;
        const property = schema.properties[key];

        if (property === false) {
          continue;
        } else if (property === true) {
          value = unknown();
        } else {
          let nextProcessor: ObjectReferenceProcessor;

          if (property.title !== undefined) {
            const nextKey = stringToName(property.title);
            nextProcessor = processor.refineAsBase(nextKey);
          } else {
            const nextKey = stringToName(key);
            nextProcessor = processor.refine(nextKey);
          }

          value = walk(property, nextProcessor);
        }

        const required = schema.required?.some((req) => req === key) ?? false;

        properties.push({ key, value, required });
      }

      const node: ASTNode = {
        type: "object",
        properties,
      };

      const ref = processor.register(schema, node);

      return ref;
    }

    case "array": {
      let items: ASTNode;

      if (schema.items === undefined || typeof schema.items === "boolean") {
        items = unknown();
      } else if (Array.isArray(schema.items)) {
        if (schema.items.some((item) => typeof item === "boolean")) {
          items = unknown();
        } else if (schema.items.length === 1 && typeof schema.items[0] !== "boolean") {
          items = walk(schema.items[0], processor);
        } else {
          items = {
            type: "or",
            items: schema.items.map((item, index) => {
              const nextProcessor = processor.refine(index.toString());
              return walk(item as JSONSchema7, nextProcessor);
            }),
          };
        }
      } else {
        items = walk(schema.items, processor);
      }

      return {
        type: "array",
        items,
        minItems: schema.minItems ?? 0,
        maxItems: schema.maxItems ?? 2 ** 32,
        uniqueItems: schema.uniqueItems ?? false,
      };
    }
    default:
      return unknown();
  }
};

export const parse = async (schema: JSONSchema7, options: Partial<Options> = {}): Promise<ASTNode> => {
  const fullOptions = { ...defaultOptions, ...options };
  schema = await bundle(schema, fullOptions);

  const rootKey = stringToName(schema.title ?? "value");
  const processor = ObjectReferenceProcessor.root(rootKey);
  const node = walk(schema, processor);

  const root = {
    name: rootKey,
    node,
  };

  return {
    type: "module",
    declarations: processor.getAll(),
    root,
  };
};
