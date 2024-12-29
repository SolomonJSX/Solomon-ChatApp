import { create } from "zustand";
import { createChatSlice, IChatSliceState } from "./slices/chat-slice";

type AppState = IChatSliceState

export const useAppStore = create<AppState>()((...a) => ({
    ...createChatSlice(...a)
}))