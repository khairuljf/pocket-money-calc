import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS = join(__dirname, "..");

const targets = [
  { svg: "icon.svg", out: "icon.png", size: 1024, background: null },
  {
    svg: "adaptive-icon.svg",
    out: "adaptive-icon.png",
    size: 1024,
    background: null,
  },
  {
    svg: "splash-icon.svg",
    out: "splash-icon.png",
    size: 1024,
    background: null,
  },
  { svg: "favicon.svg", out: "favicon.png", size: 196, background: null },
];

for (const t of targets) {
  const svgPath = join(__dirname, t.svg);
  const outPath = join(ASSETS, t.out);
  const svg = await readFile(svgPath);
  let pipeline = sharp(svg, { density: 384 }).resize(t.size, t.size, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });
  if (t.background) {
    pipeline = pipeline.flatten({ background: t.background });
  }
  await pipeline.png({ compressionLevel: 9 }).toFile(outPath);
  console.log(`✓ ${t.out} (${t.size}x${t.size})`);
}
