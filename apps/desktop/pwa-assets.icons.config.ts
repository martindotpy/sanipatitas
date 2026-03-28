import { defineConfig } from "@vite-pwa/assets-generator/config"

export default defineConfig({
  headLinkOptions: {
    preset: "2023",
  },
  preset: {
    transparent: {
      sizes: [30, 32, 44, 50, 71, 89, 107, 128, 142, 150, 256, 284, 310, 512],
      favicons: [[256, "icon.ico"]],
    },
    maskable: {
      sizes: [],
    },
    apple: {
      sizes: [],
    },
    assetName(type, size) {
      if (type !== "transparent") return `unexpected-${type}-${size}`

      if (size.height === 32 || size.height === 128) {
        return `${size.height}x${size.width}.png`
      }

      if (size.height === 256) {
        return `128x128@2x.png`
      }

      if (size.height === 512) {
        return "icon.png"
      }

      if (size.height === 50) {
        return "StoreLogo.png"
      }

      return `Square${size.width}x${size.height}Logo.png`
    },
  },
  images: ["src-tauri/icons/icon.svg"],
})
