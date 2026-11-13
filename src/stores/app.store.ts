import { create } from "zustand";
import type { App } from "@/types";

type AppState = {
	currApp: App | null;
};
type AppActions = {
	saveApp: (app: App) => void;
	syncFromStorage: () => void;
};

type AppStore = AppState & AppActions;

// Helper to safely read from localStorage
const getInitialApp = () => {
	try {
		const saved = localStorage.getItem("app");
		return saved ? JSON.parse(saved) : null;
	} catch {
		return null;
	}
};

export const useAppStore = create<AppStore>((set) => ({
	currApp: getInitialApp(),
	saveApp: (app: App) => {
		localStorage?.setItem("app", JSON.stringify(app));
		set((state) => ({ ...state, currApp: app }));
	},
	// Optional action to manually re-sync from storage
	syncFromStorage: () => {
		set({ currApp: getInitialApp() });
	},
}));
