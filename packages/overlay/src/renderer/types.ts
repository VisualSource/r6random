interface WindowExtend {
	app: {
		log(type: "info" | "error", message: string): Promise<void>;
		getCurrentHotKey: () => Promise<{ mod: string; key: string }>;
		getAppVersion: () => Promise<string>;
		onReady: (callback: () => void) => void;
	};
	osr: {
		openOSR: () => Promise<void>;
		toggle: () => Promise<void>;
		updateHotkey: (mod: string, key: string) => Promise<void>;
	};
}

export type Win = typeof window & WindowExtend;
