import { os } from "@sanipatitas/desktop/core/configuration/app-configuration"

// Add os to data-attributes for styling
document.documentElement.setAttribute("data-os", os!)

// Change styles based on the operating system
if (os !== "android" && os !== "ios") {
  document.documentElement.style.setProperty(
    "--scalar-document-selector-padding-top",
    "2.25rem"
  )
}
