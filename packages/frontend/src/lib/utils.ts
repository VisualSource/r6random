import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isElectron() {
	// test for render process
	if (
		typeof window !== "undefined" &&
		typeof window.process === "object" &&
		"type" in window.process &&
		window.process.type === "renderer"
	) {
		return true;
	}

	// test for main process
	if (
		typeof process !== "undefined" &&
		"versions" in process &&
		typeof process.versions === "object" &&
		"electron" in process.versions
	) {
		return true;
	}

	if (
		typeof navigator === "object" &&
		typeof navigator.userAgent === "string" &&
		navigator.userAgent.indexOf("Electron") >= 0
	) {
		return true;
	}
	return false;
}
