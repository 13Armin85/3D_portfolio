import { create } from "zustand";
import type { SectionId } from "@/lib/types";

interface RoomState {
  section: SectionId | null;
  hovered: SectionId | null;
  mode: "room" | "list";
  theme: "day" | "night";
  ready: boolean;
  reducedMotion: boolean;
  resetCount: number;
  open: (section: SectionId) => void;
  close: () => void;
  hover: (section: SectionId | null) => void;
  setMode: (mode: "room" | "list") => void;
  toggleTheme: () => void;
  setReady: (ready: boolean) => void;
  setReducedMotion: (value: boolean) => void;
  reset: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  section: null,
  hovered: null,
  mode: "room",
  theme: "day",
  ready: false,
  reducedMotion: false,
  resetCount: 0,
  open: (section) => set({ section, hovered: null }),
  close: () => set({ section: null, hovered: null }),
  hover: (hovered) => set({ hovered }),
  setMode: (mode) => set({ mode, section: null, hovered: null }),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "day" ? "night" : "day" })),
  setReady: (ready) => set({ ready }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  reset: () =>
    set((state) => ({
      section: null,
      hovered: null,
      resetCount: state.resetCount + 1,
    })),
}));
