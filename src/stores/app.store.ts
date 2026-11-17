import { create } from "zustand";
import type { App } from "@/types";

type User = { id: string; name: string };

type AppState = {
	currApp: App | null;
	user: User | undefined;
};
type AppActions = {
	saveApp: (app: App) => void;
	saveUser: (user: User) => void;
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
	user: undefined,
	saveApp: (app: App) => {
		localStorage?.setItem("app", JSON.stringify(app));
		set((state) => ({ ...state, currApp: app }));
	},
	saveUser: (user: User) => {
		set((state) => ({ ...state, user }));
	},
	// Optional action to manually re-sync from storage
	syncFromStorage: () => {
		set({ currApp: getInitialApp() });
	},
}));
