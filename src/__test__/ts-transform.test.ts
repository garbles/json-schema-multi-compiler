import prettier from "prettier";
import { transform } from "../transform";
import { typescript } from "../transformers/typescript";
import { testHelpers } from "./test-helpers";

for (const [key, value] of testHelpers.examples()) {
  const { parseOutput, tsOutput } = value;

  test(key, async () => {
    const result = await transform(parseOutput as any, typescript);

    const resultNoNewlines = result.replace(/\n/g, "");
    const tsOutputNoNewLines = tsOutput.replace(/\n/g, "");

    const resultFormatted = prettier.format(resultNoNewlines, { parser: "typescript" });
    const tsOutputFormatted = prettier.format(tsOutputNoNewLines, { parser: "typescript" });

    expect(resultFormatted).toEqual(tsOutputFormatted);
  });
}
