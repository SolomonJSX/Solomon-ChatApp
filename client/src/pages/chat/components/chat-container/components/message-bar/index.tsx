import {ChangeEventHandler, useEffect, useRef, useState} from "react"
import EmojiPicker, {EmojiClickData, Theme} from "emoji-picker-react"
import {GrAttachment} from "react-icons/gr"
import {IoSend} from "react-icons/io5"
import {RiEmojiStickerLine} from "react-icons/ri"
import {useAppStore} from "@/store"
import {useSignalR} from "@/context/SignalRContext"
import {IMessageDTO, IUploadFileResponse, MessageTypeEnum} from "@/types/MessageType"
import apiClient from "@/lib/api-client.ts";
import {UPLOAD_FILE_ROUTE} from "@/utils/constants.ts";
import { IChannelDTO } from "@/types/ChannelType"

const MessageBar = () => {
    const fileRef = useRef<HTMLInputElement | null>(null)
    const emojiRef = useRef<HTMLDivElement>(null)
    const { selectedChatData, selectedChatType, userInfo, setIsFileUploading,setFileUploadProgress } = useAppStore()
    const signalR = useSignalR()

    useEffect(() => {
        function handleClickOutside(event: MouseEvent | TouchEvent) {
            if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
                setEmojiPickerOpen(false)
            }
        }

        document.addEventListener('mouseup', handleClickOutside);
        document.addEventListener('touchend', handleClickOutside);

        return () => {
            document.removeEventListener('mouseup', handleClickOutside);
            document.removeEventListener('touchend', handleClickOutside);
        }
    }, [emojiRef])

    const [message, setMessage] = useState("")
    const [emojiPickerOpen, setEmojiPickerOpen] = useState<boolean>(false)

    const handleAddEmoji = (emoji: EmojiClickData) => {
        setMessage((msg) => msg + emoji.emoji)
    }

    const handleSendMessage = async () => {
        //SendMessage(string senderId, string recipientId, string content)

        

        if (selectedChatType === "contact") {
            const messageDTO: IMessageDTO = {
                senderId: userInfo?.id as string,
                content: message,
                recipientId: selectedChatData?.id as string,
                messageType: MessageTypeEnum.TEXT,
                fileUrl: undefined
            }

            signalR?.invoke("SendMessage", messageDTO)
        } else if(selectedChatType === "channel") {
            const messageDTO: IChannelDTO = {
                senderId: userInfo?.id as string,
                content: message,
                messageType: MessageTypeEnum.TEXT,
                fileUrl: undefined,
                channelId: selectedChatData?.id as string
            }

            signalR?.invoke("SendChannelMessage", messageDTO)
        }

        setMessage("")
    }

    const handleAttachmentClick = () => {
        if (fileRef?.current) {
            fileRef?.current.click()
        }
    }

    const handleAttachmentChange: ChangeEventHandler<HTMLInputElement> = async (ev) => {
        try {
            if (ev.target.files && ev.target.files[0]) {
                const file = ev.target.files[0]
                const formData: FormData = new FormData()
                formData.append("file", file)

                setIsFileUploading(true)

                const response = await apiClient.post<IUploadFileResponse>(UPLOAD_FILE_ROUTE,
                    formData,
                    {
                        onUploadProgress: (data) => {
                            setFileUploadProgress(Math.round((data.loaded / (data.total as number)) * 100));
                        }
                    },
                )

                if (response.status === 200 && response.data) {
                    setIsFileUploading(false)
                    if (selectedChatType === "contact") {
                        const messageDTO: IMessageDTO = {
                            senderId: userInfo?.id as string,
                            content: undefined,
                            recipientId: selectedChatData?.id as string,
                            messageType: MessageTypeEnum.FILE,
                            fileUrl: response.data.filePath
                        }

                        signalR?.invoke("SendMessage", messageDTO)
                    } else if(selectedChatType === "channel") {
                        const messageDTO: IChannelDTO = {
                            senderId: userInfo?.id as string,
                            content: undefined,
                            channelId: selectedChatData?.id as string,
                            messageType: MessageTypeEnum.FILE,
                            fileUrl: response.data.filePath
                        }

                        signalR?.invoke("SendChannelMessage", messageDTO)
                    }
                }
            }
        } catch (e) {
            setIsFileUploading(false)
            console.log(e)
        }
    }

    return (
        <div className="h-[10vh] bg-[#1c1d25] flex justify-between items-center px-8 mb-6 gap-6">
            <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
                <input
                    type="text"
                    className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
                    placeholder="Enter Message"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                />
                <button
                    className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
                    onClick={handleAttachmentClick}
                >
                    <GrAttachment className="text-2xl"/>
                </button>
                <input type="file" ref={fileRef} onChange={handleAttachmentChange} className="hidden"/>
                <div className="relative">
                    <button
                        className="focus:text-white duration-300 transition-all"
                        onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
                    >
                        <RiEmojiStickerLine className="text-2xl"/>
                    </button>
                    <div className="absolute bottom-16 right-0" ref={emojiRef}>
                        <EmojiPicker
                            theme={Theme.DARK}
                            autoFocusSearch={false}
                            open={emojiPickerOpen}
                            onEmojiClick={handleAddEmoji}
                        />
                    </div>
                </div>
            </div>
            <button
                className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 text-neutral-500 focus:border-none hover:bg-[#741bda] focus:bg-[#741bda] focus:outline-none focus:text-white duration-300 transition-all"
                onClick={handleSendMessage}
            >
                <IoSend className="text-2xl"/>
            </button>
        </div>
    )
}

export default MessageBar