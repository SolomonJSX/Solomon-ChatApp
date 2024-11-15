import { StateCreator } from "zustand"
import { IUserInfo } from "@/types/UserType.ts";

export interface AuthState {
    userInfo: IUserInfo | undefined
    setUserInfo: (userInfo: IUserInfo) => void;
}

export const createAuthSlice: StateCreator<AuthState> = (set) => (
    {
        userInfo: undefined,
        setUserInfo: (userInfo: IUserInfo) => set({ userInfo })
    }
)