import { isTauri } from "@sanipatitas/desktop/core/configuration/app-configuration"
import QRCodeStyling from "qr-code-styling"
import { useEffect, useRef } from "react"

// Logo
const logoUrl = "/favicon.svg"

// Component
export function SanipatitasQR({ uuid }: { uuid: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const qrRef = useRef<QRCodeStyling | null>(null)

  // URL
  const deepLinkUrl = isTauri
    ? `sanipatitas://patient/${uuid}`
    : `${window.location.origin}/patient/${uuid}`

  // QR
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const qr = new QRCodeStyling({
      width: 160,
      height: 160,
      data: deepLinkUrl,
      image: logoUrl,
      dotsOptions: { type: "dots", color: "#000000" },
      cornersSquareOptions: { type: "square", color: "#000000" },
      cornersDotOptions: { type: "dot", color: "#000000" },
      imageOptions: { crossOrigin: "anonymous", margin: 6, imageSize: 0.45 },
    })

    qr.append(container)
    qrRef.current = qr

    return () => {
      container.innerHTML = ""
      qrRef.current = null
    }
  }, [deepLinkUrl])

  // Download
  const handleClick = () => {
    qrRef.current?.download({ name: `paciente-${uuid}`, extension: "png" })
  }

  return (
    <div className="flex justify-center px-4 pt-2 pb-1">
      <div
        ref={containerRef}
        onClick={handleClick}
        className="focus-visible:outline-ring cursor-pointer rounded-md transition-shadow duration-200 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2"
        role="button"
        tabIndex={0}
        title="Click para descargar código QR"
      />
    </div>
  )
}
