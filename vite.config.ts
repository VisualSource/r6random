import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "node:path"

const ID = "/r6random"
const OUTDIR = `../../dist${ID}`

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {


  return {
    plugins: [react()],
    base: command === "build" ? ID : "/",
    build: {
      emptyOutDir: true,
      outDir: OUTDIR,
      copyPublicDir: true,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
