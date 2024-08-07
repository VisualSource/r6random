export const loadItem = (key: string, defaultValue: number) => {
	const value = localStorage.getItem(key);
	if (value === null) {
		return defaultValue;
	}
	try {
		return Number.parseInt(value);
	} catch (error) {
		console.error("Failed to load value from storage:", error, value);
		return defaultValue;
	}
};
