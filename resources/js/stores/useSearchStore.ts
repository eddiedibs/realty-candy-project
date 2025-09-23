import { create } from "zustand";
import type { Market } from "@/types";


interface SearchStore {
  results: any;
  setResults: (res: any) => void;
  loading: boolean;
  setLoading: (state: boolean) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  results: null,
  setResults: (res) => set({ results: res }),
  loading: false,
  setLoading: (state) => set({ loading: state }),
}));