import { win, query, onClick } from "./utils";

win.app.onReady(() => {
	query<HTMLDivElement>(".header")?.classList.remove("header");

	const el = document.getElementById("mainContent");
	if (!el) return;
	el.innerHTML = "<div class='ready'></div>";
});

function openInfoDialog(
	dialogTitle: string,
	info: { title: string; message: string },
) {
	const dialog = query<HTMLDialogElement>("dialog#infoDialog");
	if (!dialog) {
		win.app.log("error", "Failed to get info dialog element");
		return;
	}

	const header = query<HTMLHeadingElement>("h5[data-title]", dialog);
	if (header) {
		header.textContent = dialogTitle;
	}

	const infoTitle = query<HTMLHeadingElement>("h4[data-info-title]", dialog);
	const infoMessage = query<HTMLHeadingElement>("p[data-info-message]", dialog);
	if (infoTitle) {
		infoTitle.textContent = info.title;
	}
	if (infoMessage) {
		infoMessage.textContent = info.message;
	}

	dialog.showModal();
}

async function onHotKeyFormSubmit(ev: SubmitEvent) {
	try {
		ev.preventDefault();

		const data = new FormData(ev.target as HTMLFormElement);

		const mod = data.get("mod")?.toString();
		const key = data.get("key")?.toString();
		if (!mod || !key) throw new Error("Failed to get new hot key data");

		await win.osr.updateHotkey(mod, key);

		query<HTMLDialogElement>("dialog#hotHeyDialog")?.close();
	} catch (error) {
		win.app.log("error", (error as Error).message);
		openInfoDialog("Submit Error", {
			title: "Error",
			message: "There was an error settting the hot key.",
		});
	}
}

function main() {
	win.app
		.getAppVersion()
		.then((version) => {
			const container = query("span.version");
			if (!container) throw new Error("Failed to get container");
			container.innerText = version;
		})
		.catch((e) => win.app.log("error", (e as Error).message));

	query<HTMLFormElement>("#hotKeyForm")?.addEventListener(
		"submit",
		onHotKeyFormSubmit,
	);
	onClick("button#createOSR", () => win.osr.openOSR());
	onClick("button#visibilityOSR", () => win.osr.toggle());
	onClick("button#updateHotKey", async () => {
		try {
			const dialog = query<HTMLDialogElement>("dialog#hotHeyDialog");
			if (!dialog) throw new Error("Failed to get dialog");

			const hotKey = await win.app.getCurrentHotKey();

			const selected = query<HTMLOptionElement>(
				`option[value='${hotKey.mod}']`,
				dialog,
			);
			if (!selected) throw new Error("Failed to get option elemenet");
			selected.toggleAttribute("selected");

			const input = query<HTMLInputElement>("input[name='key']", dialog);
			if (!input) throw new Error("Failed to get input");
			input.value = hotKey.key;

			dialog.showModal();
		} catch (error) {
			console.error(error);
			win.app.log("error", (error as Error).message);
		}
	});

	for (const btn of document.querySelectorAll("button[data-close]")) {
		const target = btn.getAttribute("data-close");
		if (!target) continue;
		btn.addEventListener("click", () => {
			const dialog = document.getElementById(target) as HTMLDialogElement;
			dialog.close();
		});
	}
}

window.addEventListener("DOMContentLoaded", () => {
	try {
		main();
	} catch (error) {
		console.error(error);
		win.app.log("error", (error as Error).message);
	}
});
