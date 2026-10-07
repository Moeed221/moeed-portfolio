import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

// Generate lossless versions from the committed originals. Nothing is resized.
const assets = new URL("../src/assets/", import.meta.url);
const work = await readFile(new URL("../src/components/Work.tsx", import.meta.url), "utf8");
const files = [...new Set([...work.matchAll(/\.\.\/assets\/([^"\n]+\.webp)/g)].map((match) => match[1]))];
let before = 0;
let after = 0;
for (const name of files) {
  const original = await readFile(new URL(name.replace(/\.webp$/, ".png"), assets));
  const converted = await sharp(original).webp({ lossless: true, effort: 6 }).toBuffer();
  await writeFile(fileURLToPath(new URL(name, assets)), converted);
  before += original.length;
  after += converted.length;
}
console.log(`Lossless project images: ${(before / 1e6).toFixed(2)} MB -> ${(after / 1e6).toFixed(2)} MB`);
