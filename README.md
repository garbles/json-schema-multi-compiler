# JSON Schema Multi Compiler

Transforms JSON Schema documents into an AST and then exposes a simple interface to turn that AST into anything else. You can use JSON Schema as a single source of truth for multiple _generated_ source files. The transform for TypeScript is 50 LOC. Can also be used as a runtime tree walker for JavaScript objects that interface with JSON schema.
