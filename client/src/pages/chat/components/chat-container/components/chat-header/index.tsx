import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { RiCloseFill } from "react-icons/ri";
import {IUserInfo} from "@/types/UserType.ts";
import {IChannel} from "@/types/ChannelType.ts";



const ChatHeader = () => {
    const { closeChat, selectedChatData, selectedChatType } = useAppStore()

    return (
        <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
            <div className="flex gap-5 items-center w-full justify-between">
                <div className="flex gap-3 items-center justify-center">
                    <div className="w-12 h-12 relative">
                        {
                            selectedChatType === "contact" ? (
                                <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                                    {
                                        (selectedChatData as IUserInfo)?.imagePath ? (
                                            <AvatarImage
                                                src={`${HOST}/${(selectedChatData as IUserInfo)?.imagePath}`}
                                                alt="profile"
                                                className="object-cover w-full h-full bg-black"
                                            />
                                        ) : (
                                            <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor((selectedChatData as IUserInfo)?.color as number)}`}>
                                                {(selectedChatData as IUserInfo)?.firstName
                                                    ? (selectedChatData as IUserInfo)?.firstName?.split("").shift()
                                                    : (selectedChatData as IUserInfo)?.email.split("").shift()}
                                            </div>
                                        )}
                                </Avatar>
                            ) : (<div
                                className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">#</div>)
                        }
                    </div>
                    <div>
                        {selectedChatType === "channel" && (selectedChatData as IChannel).name}
                        {selectedChatType === "contact" ? `${(selectedChatData as IUserInfo)?.firstName} ${(selectedChatData as IUserInfo)?.lastName}` : (selectedChatData as IUserInfo)?.email}
                    </div>
                </div>
                <div className="flex gap-3 items-center justify-center">
                    <button
                        className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
                        onClick={closeChat}
                    >
                        <RiCloseFill className="text-3xl" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatHeader;