import { parse } from "../parse";
import { testHelpers } from "./test-helpers";

for (const [key, value] of testHelpers.examples()) {
  const { input, parseOutput } = value;

  test(key, async () => {
    const result = await parse(input as any);

    expect(result).toEqual(parseOutput);
  });
}
