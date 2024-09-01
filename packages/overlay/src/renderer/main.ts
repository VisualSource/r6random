interface WindowExtend {
	app: {
		getCurrentHotKey: () => Promise<{ mod: string; key: string }>;
		getVersionData: () => void;
		onLog: (callback: (...args: unknown[]) => void) => void;
		onConnected: (callback: () => void) => void;
	};
	osr: {
		openOSR: () => Promise<void>;
		toggle: () => Promise<void>;
		updateHotkey: (mod: string, key: string) => Promise<void>;
	};
}
type Win = typeof window & WindowExtend;

const extendWindow = window as Win;

function getTarget<T extends HTMLElement>(value: string) {
	return document.getElementById(value) as T;
}

function onClick(
	target: string,
	callback: ((ev: unknown) => void) | (() => Promise<void>),
) {
	getTarget(target)?.addEventListener("click", callback);
}

function logMessage(value: unknown) {
	const log = getTarget("log");
	const el = document.createElement("p");
	if (typeof value !== "string") {
		el.textContent = JSON.stringify(value);
	} else {
		el.textContent = value;
	}
	log?.appendChild(el);
}

let isReady = false;

extendWindow.app.getVersionData();
extendWindow.app.onLog((value) => logMessage(value));
extendWindow.app.onConnected(() => {
	isReady = true;
	const el = document.getElementById("mainContent");
	if (!el) return;
	el.innerHTML = "<div class='ready'></div>";
});

window.addEventListener("DOMContentLoaded", () => {
	getTarget("hotKeyForm").addEventListener("submit", async (ev) => {
		ev.preventDefault();
		const data = new FormData(ev.target as HTMLFormElement);

		const mod = data.get("mod")?.toString();
		const key = data.get("key")?.toString();
		if (!mod || !key) return;

		await extendWindow.osr.updateHotkey(mod, key);
	});

	for (const btn of document.querySelectorAll("button[data-close]")) {
		const target = btn.getAttribute("data-close");
		if (!target) continue;
		btn.addEventListener("click", () => {
			const dialog = document.getElementById(target) as HTMLDialogElement;
			dialog.close();
		});
	}
	onClick("createOSR", () =>
		extendWindow.osr.openOSR().catch((e) => logMessage(e?.message ?? e)),
	);
	onClick("visibilityOSR", async () =>
		extendWindow.osr.toggle().catch((e) => logMessage(e?.message ?? e)),
	);
	onClick("updateHotkey", async () => {
		try {
			if (!isReady) return;
			const dialog = getTarget<HTMLDialogElement>("hotHeyChanger");

			const { mod, key } = await extendWindow.app.getCurrentHotKey();

			dialog
				.querySelector(`option[value=${mod}]`)
				?.setAttribute("selected", "");
			const keyInput =
				dialog.querySelector<HTMLInputElement>("input[name='key']");
			if (keyInput) {
				keyInput.value = key;
			}

			dialog.showModal();
		} catch (error) {
			logMessage((error as Error)?.message ?? error);
		}
	});
	onClick("showLog", () =>
		getTarget<HTMLDialogElement>("systemLog").showModal(),
	);
});
