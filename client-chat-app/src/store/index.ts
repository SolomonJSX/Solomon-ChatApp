import { create } from "zustand";
import { AuthState, createAuthSlice } from "./slices/auth-slice";

type AppState = AuthState

export const useAppStore = create<AppState>()((...a) => ({
    ...createAuthSlice(...a)
}))