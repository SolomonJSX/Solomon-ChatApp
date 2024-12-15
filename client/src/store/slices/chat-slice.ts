import {IContactForDMList, IMessage} from "@/types/MessageType"
import { IUserInfo } from "@/types/UserType"
import { StateCreator } from "zustand"

type selectedChatType = "contact" | "channel" | undefined
type selectedChatDataType = IUserInfo | undefined


export interface IChatSliceState  {
    selectedChatType: selectedChatType
    selectedChatData: selectedChatDataType
    selectedChatMessages: IMessage[]
    directMessagesContact: IContactForDMList[]
    setSelectedChatType: (selectedChatType: selectedChatType) => void
    setSelectedChatData: (selectedChatData: selectedChatDataType) => void 
    setSelectedChatMessages: (selectedChatMessages: IMessage[]) => void
    setDirectMessagesContact: (directMessagesContact: IContactForDMList[]) => void
    addMessage: (message: IMessage) => void
    closeChat: () => void
}

export const createChatSlice: StateCreator<IChatSliceState> = (set, get) => (
    {
        selectedChatType: undefined,
        selectedChatData: undefined,
        selectedChatMessages: [],
        directMessagesContact: [],
        setSelectedChatType: (selectedChatType: selectedChatType) => set({selectedChatType}),
        setSelectedChatData: (selectedChatData: selectedChatDataType) => set({selectedChatData}),
        setSelectedChatMessages: (selectedChatMessages: IMessage[]) => set({selectedChatMessages}),
        setDirectMessagesContact: (directMessagesContact: IContactForDMList[]) => set({directMessagesContact}),
        addMessage: (message: IMessage) => {
            const selectedChatMessages = get().selectedChatMessages;
            const selectedChatType = get().selectedChatType;


            set({
                selectedChatMessages: [
                    ...selectedChatMessages,
                    {
                        ...message,
                        recipient: selectedChatType !== "channel" ? message.recipient : undefined,
                        recipientId: selectedChatType !== "channel" ? message.recipientId : "",
                        sender: selectedChatType !== "channel" ? message.sender : undefined,
                        senderId: selectedChatType !== "channel" ? message.senderId : ""
                    }
                ]
            })
        },
        closeChat: () => set({ selectedChatType: undefined, selectedChatData: undefined, selectedChatMessages: [] })
    }
)