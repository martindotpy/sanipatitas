// Loki push transport para Pino en produccion
// Se activa con LOKI_ENABLED=true y LOKI_URL=http://loki:3100

const lokiEnabled = process.env.LOKI_ENABLED === "true"
const lokiUrl = process.env.LOKI_URL ?? "http://localhost:3100"
const serviceName = process.env.SERVICE_NAME ?? "auth"
const nodeEnv = process.env.NODE_ENV ?? "development"

function createLokiTransport() {
  if (!lokiEnabled) return undefined

  let buffer: string[] = []
  const pushUrl = `${lokiUrl}/loki/api/v1/push`

  const flushToLoki = async () => {
    if (buffer.length === 0) return

    const nowNs = String(Date.now() * 1_000_000)
    const values = buffer
      .map((line) => {
        try {
          JSON.parse(line)
          return [nowNs, line] as [string, string]
        } catch {
          return null
        }
      })
      .filter(Boolean) as [string, string][]

    if (values.length === 0) {
      buffer = []
      return
    }

    try {
      await fetch(pushUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          streams: [
            {
              stream: {
                service: serviceName,
                level: "info",
                environment: nodeEnv,
              },
              values,
            },
          ],
        }),
      })
    } catch {
      // Loki no alcanzable, silently drop
    }

    buffer = []
  }

  // Flush cada 5 segundos o al acumular 50 lineas
  const interval = setInterval(flushToLoki, 5_000)

  return {
    write(chunk: string) {
      buffer.push(chunk)
      if (buffer.length >= 50) flushToLoki()
    },
    close() {
      clearInterval(interval)
      flushToLoki()
    },
  }
}

export const lokiTransport = createLokiTransport()
