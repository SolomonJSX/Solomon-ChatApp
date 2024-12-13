import {useAppStore} from "@/store";
import {useEffect, useRef} from "react";
import moment from "moment";
import {IMessage, IMessagesResponseDTO, MessageTypeEnum} from "@/types/MessageType.ts";
import apiClient from "@/lib/api-client.ts";
import {GET_ALL_MESSAGES_ROUTES} from "@/utils/constants.ts";

const MessageContainer = () => {
    const scrollRef = useRef<HTMLDivElement>(null)
    const {selectedChatType, selectedChatData, selectedChatMessages, setSelectedChatMessages} = useAppStore()

    useEffect(() => {
        const getMessages = async () => {
            try {
                const response = await apiClient.post<IMessagesResponseDTO>(
                    GET_ALL_MESSAGES_ROUTES,
                    {id: selectedChatData?.id},
                    {withCredentials: true}
                )

                if (response.data.messages) {
                    setSelectedChatMessages(response.data.messages)
                }
            } catch (e) {
                console.error(e)
            }
        }

        if (selectedChatData?.id) {
            if (selectedChatType === "contact") getMessages()
        }
    }, [selectedChatType, selectedChatData, setSelectedChatMessages])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({behavior: 'smooth'})
        }
    }, [selectedChatMessages]);

    const renderMessages = () => {
        let lastDate: string | null = null;

        return selectedChatMessages.map((message, index) => {
            const messageDate = moment(message.timeStamp).format("YYYY-MM-DD")
            const showDate = messageDate !== lastDate
            lastDate = messageDate
            return (
                <div key={index}>
                    {showDate && (
                        <div className="text-center text-gray-500 my-2">
                            {moment(message.timeStamp).format("LL")}
                        </div>
                    )}
                    {
                        selectedChatType === "contact" && renderDMMessages(message)
                    }
                </div>
            )
        })
    }

    const renderDMMessages = (message: IMessage) => {
        return (
            <div className={`${
                message.sender?.id === selectedChatData?.id ? "text-right" : "text-left"
            }`}>
                {message.messageType === MessageTypeEnum.TEXT && (
                    <div className={`${
                        message.sender?.id !== selectedChatData?.id
                            ? "bg-[#8417ff]/5 text-white/90 border-[#8417ff]/50"
                            : "bg-[#2a2b33]/5 text-white/80 border-[#fff]/20"
                    } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
                        {message.content}
                    </div>
                )}
                <div className="text-xs text-gray-500">
                    {moment(message.timeStamp).format("LT")}
                </div>
            </div>
        )
    }
    return (
        <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
            {renderMessages()}
            <div ref={scrollRef}/>
        </div>
    )
}

export default MessageContainer;