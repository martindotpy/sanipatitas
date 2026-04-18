import { Glob } from "bun"
import consola from "consola"
import { readFile, rename, unlink, writeFile } from "node:fs/promises"
import path from "node:path"
import * as png2icons from "png2icons"
import sharp from "sharp"

// Logger
png2icons.setLogger(consola.log)

// Context
const cwd = process.cwd()

// Convert to RGB to RGBA all images (.png/.ico)
const imagesGlob = new Glob("src-tauri/icons/**/*.{png}")

await Promise.all(
  (await Array.fromAsync(imagesGlob.scan())).map(async (image) => {
    const tmpImage = `${image}.tmp`

    // Rename all the input file
    await rename(image, tmpImage)

    // Add alpha channel
    await sharp(tmpImage).ensureAlpha().toFormat("png").toFile(image)

    // Delete the temporary file
    await unlink(tmpImage)
  })
)

// Generate .icns file from .png
const input = await readFile(path.join(cwd, "src-tauri", "icons", "icon.png"))
const icns = png2icons.createICNS(input, png2icons.BICUBIC, 0)

if (icns)
  await writeFile(path.join(cwd, "src-tauri", "icons", "icon.icns"), icns)
