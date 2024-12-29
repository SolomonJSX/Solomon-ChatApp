import { IChannel } from "@/types/ChannelType"
import { IContactForDMList, IMessage } from "@/types/MessageType"
import { IUserInfo } from "@/types/UserType"
import { channel } from "diagnostics_channel"
import { StateCreator } from "zustand"

type selectedChatType = "contact" | "channel" | undefined
type selectedChatDataType = IUserInfo | IContactForDMList | IChannel | undefined


export interface IChatSliceState {
    userInfo: IUserInfo | null
    setUserInfo: (userInfo: IUserInfo | null) => void;
    addContactsInDMContacts: (message: IMessage) => void

    selectedChatType: selectedChatType
    selectedChatData: selectedChatDataType
    selectedChatMessages: IMessage[]
    directMessagesContacts: IContactForDMList[]

    isFileUploading: boolean,
    isFileDownloading: boolean,
    fileUploadProgress: number,
    fileDownloadProgress: number,

    channels: IChannel[],

    setChannels: (channels: IChannel[]) => void,
    addChannel: (channel: IChannel) => void,

    setIsFileUploading: (isUploading: boolean) => void,
    setIsFileDownloading: (isDownloading: boolean) => void,
    setFileUploadProgress: (progress: number) => void,
    setFileDownloadProgress: (progress: number) => void,

    setSelectedChatType: (selectedChatType: selectedChatType) => void
    setSelectedChatData: (selectedChatData: selectedChatDataType) => void
    setSelectedChatMessages: (selectedChatMessages: IMessage[]) => void
    setDirectMessagesContact: (directMessagesContact: IContactForDMList[]) => void
    addMessage: (message: IMessage) => void
    closeChat: () => void

    addChannelInChannelList: (message: IMessage) => void
}

export const createChatSlice: StateCreator<IChatSliceState> = (set, get) => (
    {
        userInfo: null,
        setUserInfo: (userInfo: IUserInfo | null) => set({ userInfo }),

        selectedChatType: undefined,
        selectedChatData: undefined,
        selectedChatMessages: [],
        directMessagesContacts: [],

        isFileUploading: false,
        isFileDownloading: false,
        fileUploadProgress: 0,
        fileDownloadProgress: 0,

        channels: [],


        setChannels: (channels: IChannel[]) => set({ channels }),
        addChannel: (channel: IChannel) => {
            const channels = get().channels;
            set({ channels: [channel, ...channels] })
        },

        setIsFileUploading: (isUploading: boolean) => set({ isFileUploading: isUploading }),
        setIsFileDownloading: (isDownloading: boolean) => set({ isFileDownloading: isDownloading }),
        setFileUploadProgress: (fileUploadProgress: number) => set({ fileUploadProgress }),
        setFileDownloadProgress: (fileDownloadProgress: number) => set({ fileDownloadProgress }),

        setSelectedChatType: (selectedChatType: selectedChatType) => set({ selectedChatType }),
        setSelectedChatData: (selectedChatData: selectedChatDataType) => set({ selectedChatData }),
        setSelectedChatMessages: (selectedChatMessages: IMessage[]) => set({ selectedChatMessages }),
        setDirectMessagesContact: (directMessagesContact: IContactForDMList[]) => set({ directMessagesContacts: directMessagesContact }),
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
                        sender: message.sender,
                        senderId: message.senderId,
                        channel: selectedChatType !== "contact" ? message.channel : undefined,
                        channelId: selectedChatType !== "contact" ? message.channelId : "",
                    }
                ]
            })
        },
        closeChat: () => set({ selectedChatType: undefined, selectedChatData: undefined, selectedChatMessages: [] }),

        addChannelInChannelList: (message: IMessage) => {
            const channels = get().channels;
            const data = channels.find(channel => channel.id === message.channelId)

            const index = channels.findIndex(channel => channel.id === message.channelId)

            if (index !== -1) {
                channels.splice(index, 1)
                channels.unshift(data as IChannel)
            }
        },

        addContactsInDMContacts: (message: IMessage) => {
            const userId = get().userInfo?.id;
            const fromId = message.sender?.id === userId
                ? message.recipient?.id
                : message.sender?.id;

            const fromData =
                message.sender?.id === userId
                    ? message.recipient
                    : message.sender;

            const dmContacts = get().directMessagesContacts;
            const data = dmContacts.find((contact) => contact.id === fromId);
            const index = dmContacts.findIndex((contact) => contact.id === fromId);

            const fromDataAsContact: IContactForDMList = {
                id: fromData?.id || "",
                lastMessageTime: message.timeStamp,
                email: fromData?.email || "",
                firstName: fromData?.firstName || "",
                lastName: fromData?.lastName || "",
                imagePath: fromData?.imagePath || "",
                color: fromData?.color || null
            }

            if (index !== -1 && index !== undefined) {
                dmContacts.splice(index, 1);
                dmContacts.unshift(data as IContactForDMList);
            } else {
                dmContacts.unshift(fromDataAsContact);
            }

            set({ directMessagesContacts: dmContacts });
        },
    })