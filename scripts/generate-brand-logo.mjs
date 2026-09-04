import sharp from "sharp"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, "../public/brand")

const markH = 96
const gap = 28
const text = "WI ZEROTHON"
const fontSize = 52

async function buildLogo({ markFile, textColor, baseName }) {
  const mark = await sharp(path.join(outDir, markFile))
    .resize({ height: markH, fit: "contain" })
    .toBuffer()
  const markMeta = await sharp(mark).metadata()

  const textSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="${markH}">
      <text x="0" y="${Math.round(markH * 0.72)}" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="700" letter-spacing="4.2" fill="${textColor}">${text}</text>
    </svg>`,
  )
  const textImg = await sharp(textSvg).trim().png().toBuffer()
  const textMeta = await sharp(textImg).metadata()

  const width = markMeta.width + gap + textMeta.width
  const height = Math.max(markMeta.height, textMeta.height)
  const markTop = Math.round((height - markMeta.height) / 2)
  const textTop = Math.round((height - textMeta.height) / 2)

  const png = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: mark, left: 0, top: markTop },
      { input: textImg, left: markMeta.width + gap, top: textTop },
    ])
    .png()
    .toBuffer()

  await sharp(png).toFile(path.join(outDir, `${baseName}.png`))
  await sharp(png)
    .resize({ width: width * 2 })
    .png()
    .toFile(path.join(outDir, `${baseName}@2x.png`))

  const markB64 = (await sharp(mark).png().toBuffer()).toString("base64")
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
  <image href="data:image/png;base64,${markB64}" x="0" y="${markTop}" width="${markMeta.width}" height="${markMeta.height}" />
  <text x="${markMeta.width + gap}" y="${textTop + Math.round(textMeta.height * 0.72)}" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="700" letter-spacing="4.2" fill="${textColor}">${text}</text>
</svg>`
  fs.writeFileSync(path.join(outDir, `${baseName}.svg`), svg)

  console.log(`${baseName}:`, width, "x", height)
}

await buildLogo({
  markFile: "kt-is-ci-dark.png",
  textColor: "#ffffff",
  baseName: "wi-zerothon-logo-dark",
})

await buildLogo({
  markFile: "kt-is-ci-black-red.png",
  textColor: "#111111",
  baseName: "wi-zerothon-logo-black",
})
