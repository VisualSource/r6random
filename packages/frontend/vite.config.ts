import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "node:path"

const ID = "/r6random/"
const OUTDIR = `../../../dist${ID}`

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {

  const isElectron = process.env?.ELECTRON_BUILD !== undefined;

  const base = isElectron ? "/" : command === "build" ? ID : "/"

  return {
    plugins: [react()],
    base,
    build: {
      emptyOutDir: true,
      outDir: isElectron ? undefined : OUTDIR,
      copyPublicDir: true,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
