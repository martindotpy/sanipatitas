import consola from "consola"
import { readFile, writeFile } from "node:fs"
import path from "node:path"
import { promisify } from "node:util"
import * as png2icons from "png2icons"

// Logger
png2icons.setLogger(consola.log)

// Context
const cwd = process.cwd()

// Utils
const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)

// Generate .icns file from .png
const input = await readFileAsync(
  path.join(cwd, "src-tauri", "icons", "icon.png")
)
const icns = png2icons.createICNS(input, png2icons.BICUBIC, 0)

if (icns)
  await writeFileAsync(path.join(cwd, "src-tauri", "icons", "icon.icns"), icns)
