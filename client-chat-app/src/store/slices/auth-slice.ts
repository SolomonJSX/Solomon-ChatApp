import { StateCreator } from "zustand"
import { IUserInfo } from "@/types/UserType.ts";

export interface IAuthState {
    userInfo: IUserInfo | null
    setUserInfo: (userInfo: IUserInfo | null) => void;
}

export const createAuthSlice: StateCreator<IAuthState> = (set) => (
    {
        userInfo: null,
        setUserInfo: (userInfo: IUserInfo | null) => set({ userInfo })
    }
)