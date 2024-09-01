import { defineConfig } from "electron-vite";
import { resolve } from "node:path";

export default defineConfig({
	main: {
		build: {
			outDir: "dist/main",
		},
	},
	preload: {
		build: {
			outDir: "dist/preload",
			rollupOptions: {
				input: {
					preload: resolve(__dirname, "src/preload/preload.ts"),
					"osr-preload": resolve(__dirname, "src/preload/osr-preload.ts"),
				},
			},
		},
	},
	renderer: {
		build: {
			outDir: "dist/renderer",
		},
	},
});
