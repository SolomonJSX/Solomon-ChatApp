import { useAppStore } from "@/store";
import { createContext, PropsWithChildren, useContext, useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { HOST } from "@/utils/constants";
import { IMessage } from "@/types/MessageType";
import {getCookie} from "@/utils/operations.ts";

const SignalRContext = createContext<signalR.HubConnection | undefined>(undefined)

export const useSignalR = () => {
    return useContext(SignalRContext)
}

export const SignalRProvider = ({ children }: PropsWithChildren) => {
    const socket = useRef<signalR.HubConnection>()
    const { userInfo } = useAppStore()

    useEffect(() => {
        if (userInfo) {
            const token = getCookie("token")
            socket.current = new signalR.HubConnectionBuilder()
                .withUrl(`${HOST}/chat`, {
                    accessTokenFactory: () => token as string
                })
                .withAutomaticReconnect()
                .build();

            socket.current
                .start()
                .then(() => console.log("Connected to SignalR server"))
                .catch((err) => console.log("Error connecting to SignalR:", err));

            const handleReceiveMessage = (messageData: IMessage) => {
                const {selectedChatData, selectedChatType, addMessage} = useAppStore.getState()

                console.log(messageData)

                if (selectedChatType !== undefined && (userInfo?.id === messageData.sender?.id || selectedChatData?.id === messageData.recipient?.id)) {
                    console.log("message rcv: " + messageData)
                    addMessage(messageData)
                }
            }
            socket.current.on("ReceiveMessage", () => "Hello!")

            socket.current.onclose(() => {
                console.log("Disconnected from SignalR server")
            })

            return () => {
                socket.current?.stop();
            }
        }
    }, [userInfo])

    return (
        <SignalRContext.Provider value={socket.current}>
            {children}
        </SignalRContext.Provider>
    )
}