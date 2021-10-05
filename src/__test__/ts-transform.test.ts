import prettier from "prettier";
import { transform } from "../transform";
import { typeScriptTransformer } from "../typescript-transformer";
import { testHelpers } from "./test-helpers";

for (const [key, value] of testHelpers.examples()) {
  const { parseOutput, tsOutput } = value;

  if (!tsOutput) {
    continue;
  }

  test(key, async () => {
    const result = await transform(parseOutput as any, typeScriptTransformer);

    const resultNoNewlines = result.replace(/\n/g, "");
    const tsOutputNoNewLines = tsOutput.replace(/\n/g, "");

    const resultFormatted = prettier.format(resultNoNewlines, { parser: "typescript" });
    const tsOutputFormatted = prettier.format(tsOutputNoNewLines, { parser: "typescript" });

    expect(resultFormatted).toEqual(tsOutputFormatted);
  });
}
