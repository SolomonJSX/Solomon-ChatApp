import {IContactForDMList, IMessage} from "@/types/MessageType"
import { IUserInfo } from "@/types/UserType"
import { StateCreator } from "zustand"

type selectedChatType = "contact" | "channel" | undefined
type selectedChatDataType = IUserInfo | IContactForDMList | undefined


export interface IChatSliceState  {
    selectedChatType: selectedChatType
    selectedChatData: selectedChatDataType
    selectedChatMessages: IMessage[]
    directMessagesContacts: IContactForDMList[]

    isFileUploading: boolean,
    isFileDownloading: boolean,
    fileUploadProgress: number,
    fileDownloadProgress: number,

    setIsFileUploading: (isUploading: boolean) => void,
    setIsFileDownloading: (isDownloading: boolean) => void,
    setFileUploadProgress: (progress: number) => void,
    setFileDownloadProgress: (progress: number) => void,

    setSelectedChatType: (selectedChatType: selectedChatType) => void
    setSelectedChatData: (selectedChatData: selectedChatDataType | IContactForDMList) => void
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
        directMessagesContacts: [],

        isFileUploading: false,
        isFileDownloading: false,
        fileUploadProgress: 0,
        fileDownloadProgress: 0,

        setIsFileUploading: (isUploading: boolean) => set({isFileUploading: isUploading}),
        setIsFileDownloading: (isDownloading: boolean) => set({isFileDownloading: isDownloading}),
        setFileUploadProgress: (fileUploadProgress: number) => set({fileUploadProgress}),
        setFileDownloadProgress: (fileDownloadProgress: number) => set({fileDownloadProgress}),

        setSelectedChatType: (selectedChatType: selectedChatType) => set({selectedChatType}),
        setSelectedChatData: (selectedChatData: selectedChatDataType) => set({selectedChatData}),
        setSelectedChatMessages: (selectedChatMessages: IMessage[]) => set({selectedChatMessages}),
        setDirectMessagesContact: (directMessagesContact: IContactForDMList[]) => set({directMessagesContacts: directMessagesContact}),
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