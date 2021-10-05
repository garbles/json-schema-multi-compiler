import path from "path";
import fs from "fs";
import assert from "assert";

const examples = () => {
  const examplesDir = path.join(__dirname, "examples");
  const keys = fs.readdirSync(examplesDir);
  const result = new Map<string, { input: any; parseOutput: any; tsOutput: any }>();

  for (const key of keys) {
    const mod = require(path.join(examplesDir, key));

    assert("input" in mod);
    assert("parseOutput" in mod);

    result.set(key, mod);
  }

  return result;
};

export const testHelpers = {
  examples,
};
