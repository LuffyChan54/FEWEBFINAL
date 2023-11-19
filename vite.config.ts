import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  resolve: {
    alias: [
      {
        find: "assets",
        replacement: path.resolve(__dirname, "src/assets")
      },
      {
        find: "@redux",
        replacement: path.resolve(__dirname, "src/redux")
      },
      {
        find: "utils",
        replacement: path.resolve(__dirname, "src/utils")
      },
      {
        find: "components",
        replacement: path.resolve(__dirname, "src/components")
      },
      {
        find: "lib",
        replacement: path.resolve(__dirname, "src/lib")
      },
      {
        find: "pages",
        replacement: path.resolve(__dirname, "src/pages")
      },
      {
        find: "routes",
        replacement: path.resolve(__dirname, "src/routes")
      },
      {
        find: "services",
        replacement: path.resolve(__dirname, "src/services")
      },
    ]
  }
})
