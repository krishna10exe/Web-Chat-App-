import { create } from "zustand";
import { THEMES } from "../constants";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "Black",
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));