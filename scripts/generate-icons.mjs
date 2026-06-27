import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const WHITE_BG = { r: 255, g: 255, b: 255, alpha: 1 };

// Loader: LogoCoin size-14 (56px) + p-2.5 (10px) em cada lado = círculo branco de 76px.
const LOADER_COIN_RATIO = 56 / 76;

async function writePng(buffer, outputPath) {
  await sharp(buffer).toFile(outputPath);
  console.log(`  ✓ ${outputPath.replace(root + "/", "")}`);
}

async function renderSvg(svgPath, width, height, options = {}) {
  const density = options.density ?? 300;
  const background = options.background ?? WHITE_BG;

  return sharp(readFileSync(svgPath), { density })
    .flatten({ background })
    .resize(width, height, {
      fit: "contain",
      background,
    })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
}

async function generateLoaderCoinIcon(logoSvgPath, size) {
  const coinSize = Math.round(size * LOADER_COIN_RATIO);
  const coin = await renderSvg(logoSvgPath, coinSize, coinSize);

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: WHITE_BG,
    },
  })
    .composite([{ input: coin, gravity: "center" }])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
}

async function generateMaskableIcon(logoSvgPath, size) {
  const safeZone = Math.round(size * 0.72);
  const icon = await generateLoaderCoinIcon(logoSvgPath, safeZone);

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: WHITE_BG,
    },
  })
    .composite([{ input: icon, gravity: "center" }])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
}

async function generateFaviconSvg(logoSvgPath, outputPath) {
  const svg = readFileSync(logoSvgPath, "utf8");
  const withBackground = svg.replace(
    /<svg([^>]*)>/,
    '<svg$1><rect width="48" height="48" fill="#ffffff"/>',
  );
  writeFileSync(outputPath, withBackground);
  console.log(`  ✓ ${outputPath.replace(root + "/", "")}`);
}

async function main() {
  const logoSvg = join(root, "src/assets/logo.svg");
  const logoFullSvg = join(root, "src/assets/logo-full.svg");

  console.log("Gerando ícones (LogoCoin + fundo branco do loader)...\n");

  generateFaviconSvg(logoSvg, join(root, "public/favicon.svg"));

  const outputs = [
    [await generateLoaderCoinIcon(logoSvg, 48), join(root, "public/favicon.png")],
    [await generateLoaderCoinIcon(logoSvg, 96), join(root, "src/assets/logo.png")],
    [await generateLoaderCoinIcon(logoSvg, 180), join(root, "public/apple-touch-icon.png")],
    [await generateLoaderCoinIcon(logoSvg, 192), join(root, "public/pwa-192x192.png")],
    [await generateLoaderCoinIcon(logoSvg, 512), join(root, "public/pwa-512x512.png")],
    [await generateMaskableIcon(logoSvg, 512), join(root, "public/pwa-512x512-maskable.png")],
    [await renderSvg(logoFullSvg, 552, 186, { density: 300 }), join(root, "src/assets/logo-full.png")],
  ];

  for (const [buffer, path] of outputs) {
    await writePng(buffer, path);
  }

  console.log("\nConcluído.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
