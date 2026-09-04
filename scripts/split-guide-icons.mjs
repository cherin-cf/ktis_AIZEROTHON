import sharp from "sharp"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dir = path.join(__dirname, "../public/guide")
const src = path.join(dir, "icon sets.png")

const meta = await sharp(src).metadata()
const w = meta.width
const h = meta.height
const sliceW = Math.floor(w / 4)
const names = ["day1", "day2", "day3", "day4"]

for (let i = 0; i < 4; i++) {
  const left = i * sliceW
  const cropW = i === 3 ? w - left : sliceW
  let buf = await sharp(src)
    .extract({ left, top: 0, width: cropW, height: h })
    .png()
    .toBuffer()
  buf = await sharp(buf).trim({ threshold: 15 }).toBuffer()
  const t = await sharp(buf).metadata()
  const size = Math.max(t.width, t.height)
  buf = await sharp(buf)
    .extend({
      top: Math.max(0, Math.floor((size - t.height) / 2)),
      bottom: Math.max(0, Math.ceil((size - t.height) / 2)),
      left: Math.max(0, Math.floor((size - t.width) / 2)),
      right: Math.max(0, Math.ceil((size - t.width) / 2)),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .resize(512, 512, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer()
  await sharp(buf).toFile(path.join(dir, `${names[i]}.png`))
  console.log(names[i], `${t.width}x${t.height}`)
}
