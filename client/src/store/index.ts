import { create } from "zustand";
import { IAuthState, createAuthSlice } from "./slices/auth-slice";
import { createChatSlice, IChatSliceState } from "./slices/chat-slice";

type AppState = IAuthState & IChatSliceState

export const useAppStore = create<AppState>()((...a) => ({
    ...createAuthSlice(...a),
    ...createChatSlice(...a)
}))