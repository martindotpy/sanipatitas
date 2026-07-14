import { defineConfig } from "@hey-api/openapi-ts"

export default defineConfig({
  input: [
    { path: "http://localhost:3000/api/auth/openapi.json" },
    { path: "http://localhost:8080/api/patient/openapi.json" },
    { path: "http://localhost:8082/api/clinical/openapi.json" },
    { path: "http://localhost:8081/api/appointment/openapi.json" },
  ],
  output: {
    path: "src/api/client",
    postProcess: ["prettier"],
  },

  plugins: [
    {
      name: "@hey-api/client-fetch",
      baseUrl: false,
    },
    "@tanstack/react-query",
    "zod",
  ],
})
