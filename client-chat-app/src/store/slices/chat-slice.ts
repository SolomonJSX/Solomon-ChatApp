import { IUserInfo } from "@/types/UserType"
import { StateCreator } from "zustand"

type selectedChatType = "contact" | undefined
type selectedChatDataType = IUserInfo | undefined


export interface IChatSliceState  {
    selectedChatType: selectedChatType
    selectedChatData: selectedChatDataType
    selectedChatMessages: []
    setSelectedChatType: (selectedChatType: selectedChatType) => void
    setSelectedChatData: (selectedChatData: selectedChatDataType) => void 
    setSelectedChatMessages: (selectedChatMessages: any) => void
    closeChat: () => void
}

export const createChatSlice: StateCreator<IChatSliceState> = (set) => (
    {
        selectedChatType: undefined,
        selectedChatData: undefined,
        selectedChatMessages: [],
        setSelectedChatType: (selectedChatType: selectedChatType) => set({selectedChatType}),
        setSelectedChatData: (selectedChatData: selectedChatDataType) => set({selectedChatData}),
        setSelectedChatMessages: (selectedChatMessages: any) => set({selectedChatMessages}),
        closeChat: () => set({ selectedChatType: undefined, selectedChatData: undefined, selectedChatMessages: [] })
    }
)