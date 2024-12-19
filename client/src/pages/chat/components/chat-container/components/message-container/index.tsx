import { useAppStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { IMessage, IMessagesResponseDTO, MessageTypeEnum } from "@/types/MessageType.ts";
import apiClient from "@/lib/api-client.ts";
import { GET_ALL_MESSAGES_ROUTE, HOST } from "@/utils/constants.ts";
import { MdFolderZip } from "react-icons/md"
import { IoArrowDown, IoCloseSharp } from "react-icons/io5"

const MessageContainer = () => {
    const scrollRef = useRef<HTMLDivElement>(null)
    const { selectedChatType, selectedChatData, selectedChatMessages, setSelectedChatMessages, setFileDownloadProgress, setIsFileDownloading } = useAppStore()
    const [showImage, setShowImage] = useState<boolean>(false)
    const [imageURL, setImageURL] = useState<string | null>(null)

    useEffect(() => {
        const getMessages = async () => {
            try {
                const response = await apiClient.post<IMessagesResponseDTO>(
                    GET_ALL_MESSAGES_ROUTE,
                    { id: selectedChatData?.id },
                    { withCredentials: true }
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
            scrollRef.current.scrollIntoView({ behavior: 'smooth' })
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

    const checkIfImage = (filePath: string | undefined): boolean => {
        const imageRegex: RegExp = /\.(jpg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
        return imageRegex.test(filePath as string);
    }

    const downloadFile = async (fileUrl: string) => {
        setIsFileDownloading(true)
        setFileDownloadProgress(0)

        const response = await apiClient.get(`${HOST}/${fileUrl}`, {
            method: "get",
            responseType: "blob",
            headers: {
                "Accept": "application/octet-stream",
            },
            onDownloadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent
                const percentCompleted = Math.round((loaded * 100) / (total as number))
                setFileDownloadProgress(percentCompleted)
            }
        });

        if (response.status !== 200) throw new Error("Failed to download file");
    
        const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = urlBlob;
        link.setAttribute("download", fileUrl.split("/").pop() as string);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(urlBlob);
        setIsFileDownloading(false);
        setFileDownloadProgress(0)
    }

    const renderDMMessages = (message: IMessage) => {
        return (
            <div className={`${message.sender?.id === selectedChatData?.id ? "text-right" : "text-left"
                }`}>
                {message.messageType === MessageTypeEnum.TEXT && (
                    <div className={`${message.sender?.id !== selectedChatData?.id
                            ? "bg-[#8417ff]/5 text-white/90 border-[#8417ff]/50"
                            : "bg-[#2a2b33]/5 text-white/80 border-[#fff]/20"
                        } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
                        {message.content}
                    </div>
                )}
                {
                    message.messageType === MessageTypeEnum.FILE && (
                        <div className={`${message.sender?.id !== selectedChatData?.id
                                ? "bg-[#8417ff]/5 text-white/90 border-[#8417ff]/50"
                                : "bg-[#2a2b33]/5 text-white/80 border-[#fff]/20"
                            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
                            {
                                checkIfImage(message.fileUrl)
                                    ? 
                                    (
                                        <div className="cursor-pointer"
                                            onClick={() => {
                                                setShowImage(true)
                                                setImageURL(message.fileUrl as string)
                                            }}    
                                        >
                                            <img src={`${HOST}/${message.fileUrl}`} alt="" height={300} width={300} />
                                        </div>
                                    )
                                    : 
                                    (
                                        <div className="flex items-center justify-center gap-4">
                                            <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                                                <MdFolderZip />
                                            </span>
                                            <span>{message.fileUrl?.split("/").pop()}</span>
                                            <span className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                                                onClick={() => downloadFile(message.fileUrl as string)}
                                            >
                                                <IoArrowDown />
                                            </span>
                                        </div>
                                    )
                            }
                        </div>
                    )
                }
                <div className="text-xs text-gray-500">
                    {moment(message.timeStamp).format("LT")}
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
            {renderMessages()}
            <div ref={scrollRef} />
            { showImage && <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
                <div>
                    <img src={`${HOST}/${imageURL}`} alt="" className="h-[80vh] w-full bg-cover" />
                    <div className="flex gap-5 fixed top-0 mt-5">
                        <button className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300" onClick={() => downloadFile(imageURL as string)}>
                            <IoArrowDown />
                        </button>
                        <button className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300" onClick={() => {
                            setShowImage(false)
                            setImageURL(null)
                        }}>
                            <IoCloseSharp />
                        </button>
                    </div>
                </div>
            </div> }
        </div> 
    )
}

export default MessageContainer;