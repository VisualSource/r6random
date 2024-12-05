import type { Win } from "./types";

export function getById<T extends HTMLElement>(el: string) {
	return document.getElementById(el) as T | null;
}
export function query<T extends HTMLElement>(
	el: string,
	parent: HTMLElement | Document = document,
) {
	return parent.querySelector(el) as T | null;
}

export function onClick(
	target: string,
	callback: ((ev: unknown) => void) | (() => Promise<void>),
) {
	const el = query(target);
	if (!el) throw new Error("Element was not found");
	el.addEventListener("click", callback);
}

export const win = window as Win;
