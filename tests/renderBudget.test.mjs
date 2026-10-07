import { test } from "node:test";
import assert from "node:assert/strict";
import { transformSync } from "esbuild";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../src/components/Character/utils/renderBudget.ts", import.meta.url), "utf8");
const { code } = transformSync(source, { loader: "ts", format: "esm" });
const { RenderBudget } = await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);

test("high-density touch devices stay bounded across slow frames and resume", () => {
  const budget = new RenderBudget(true, 2.75);
  assert.equal(budget.pixelRatio, 1.5);
  for (let i = 0; i < 120; i++) budget.sample(40);
  assert.equal(budget.pixelRatio, 1.25);
  for (let i = 0; i < 400; i++) budget.sample(40);
  assert.equal(budget.pixelRatio, 1);
  budget.resetSample();
  assert.equal(budget.pixelRatio, 1, "resume does not restore the expensive native buffer");
  for (let i = 0; i < 400; i++) budget.sample(16.67);
  assert.equal(budget.pixelRatio, 1);
});

test("healthy frames and isolated startup/background stalls do not reduce quality", () => {
  const budget = new RenderBudget(true, 3);
  for (let i = 0; i < 600; i++) budget.sample(16.67);
  budget.sample(3000);
  budget.resetSample();
  budget.sample(3000);
  assert.equal(budget.pixelRatio, 1.5);
});

test("desktop native resolution and low-density phones are preserved", () => {
  for (const [mobile, ratio] of [[false, 2.75], [true, 0.75], [true, 1]]) {
    const budget = new RenderBudget(mobile, ratio);
    for (let i = 0; i < 1000; i++) budget.sample(40);
    assert.equal(budget.pixelRatio, ratio);
  }
});
