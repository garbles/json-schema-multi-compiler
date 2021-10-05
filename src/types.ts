type ASTDeclaration = {
  name: string;
  node: ASTNode;
};

type ASTModule = {
  type: "module";
  declarations: ASTDeclaration[];
  root: ASTDeclaration;
};

type ASTString = {
  type: "string";
  minLength: number;
  maxLength: number;
  pattern: string;
};

type ASTNumber = {
  type: "number";
  // multipleOf: number; // TODO
  maximum: {
    value: number;
    exclusive: boolean;
  };
  minimum: {
    value: number;
    exclusive: boolean;
  };
};

type ASTBoolean = {
  type: "boolean";
};

type ASTNull = {
  type: "null";
};

type ASTUnknown = {
  type: "unknown";
};

type ASTConst = {
  type: "const";
  value: any;
};

type ASTOr = {
  type: "or";
  items: ASTNode[];
};

type ASTXor = {
  type: "xor";
  items: ASTNode[];
};

type ASTAnd = {
  type: "and";
  items: ASTNode[];
};

type ASTReference = {
  type: "reference";
  name: string;
};

type ASTArray = {
  type: "array";
  items: ASTNode;
  minItems: number;
  maxItems: number;
  uniqueItems: boolean;
  //   contains?: TODO
};

type ASTObjectProperty = {
  key: string;
  value: ASTNode;
  required: boolean;
};

type ASTObject = {
  type: "object";
  properties: ASTObjectProperty[];
  // additionalProperties?: ASTNode;
  // patternProperties?: string; // https://json-schema.org/understanding-json-schema/reference/object.html#pattern-properties
  // propertyNames?: string;
  //   dependencies?: TODO
};

export type ASTNode =
  | ASTModule
  | ASTString
  | ASTNumber
  | ASTBoolean
  | ASTNull
  | ASTUnknown
  | ASTConst
  | ASTOr
  | ASTXor
  | ASTAnd
  | ASTReference
  | ASTArray
  | ASTObject;

// prettier-ignore
type Wrap<N extends {}, T> = {
  [K in keyof N]: (
    N[K] extends ASTNode ? () => T :
    N[K] extends ASTNode[] ? Array<() => T> :
    N[K] extends {} ? Wrap<N[K], T> :
    N[K]
  )
};

export type Transformer<T> = {
  [K in ASTNode["type"]]: (node: Wrap<ASTNode & { type: K }, T>) => T;
};
