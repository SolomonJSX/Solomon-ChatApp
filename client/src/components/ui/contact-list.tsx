import {IContactForDMList, MessageTypeEnum} from "@/types/MessageType.ts";
import {useAppStore} from "@/store";
import {Avatar, AvatarImage} from "@/components/ui/avatar.tsx";
import {HOST} from "@/utils/constants.ts";
import {getColor} from "@/lib/utils.ts";
import { IChannel, IChannelDTO } from "@/types/ChannelType";
import {useSignalR} from "@/context/SignalRContext.tsx";

interface IContactList {
    contacts: IContactForDMList[] | IChannel[]
    isChannel?: boolean
}

const ContactList = ({contacts, isChannel = false}: IContactList) => {
    const signalR = useSignalR()

    const {
        // selectedChatType,
        selectedChatData,
        setSelectedChatType,
        setSelectedChatData,
        setSelectedChatMessages,
        userInfo
    } = useAppStore()

    const handleClick = (contact: IContactForDMList | IChannel) => {
        if (isChannel) {
            setSelectedChatType("channel")
            
            const channelDto: IChannelDTO = {
                channelId: (contact as IChannel).id,
                content: undefined,
                messageType: MessageTypeEnum.FILE,
                senderId: userInfo?.id as string,
            }

            signalR?.invoke("Enter", channelDto)
        }
        else {
            setSelectedChatType("contact")
        }

        setSelectedChatData(contact)

        if (selectedChatData && selectedChatData.id !== contact.id) {
            setSelectedChatMessages([])
        }
    }

    return (
        <div className="mt-5">
            {contacts.map(contact => (
                <div
                    key={contact.id}
                    className={`pl-10 py-2 transition-all duration-300 cursor-pointer 
                    ${selectedChatData && (selectedChatData.id === contact.id)
                        ? "bg-[#8417ff] hover:bg-[#8417ff]"
                        : "hover:bg-[#f1f1f111]"}`}
                    onClick={() => handleClick(contact as IContactForDMList)}
                >
                    <div className="flex gap-5 items-center justify-start text-neutral-300">
                        {
                            !isChannel && (
                                <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                                    {
                                        (contact as IContactForDMList)?.imagePath ? (
                                            <AvatarImage
                                                src={`${HOST}/${(contact as IContactForDMList)?.imagePath}`}
                                                alt="profile"
                                                className="object-cover w-full h-full bg-black"
                                            />
                                        ) : (
                                            <div
                                                className={`
                                                ${selectedChatData && selectedChatData.id === contact.id ? "bg-[#ffffff22] border-2 border-white/70" : `${getColor((contact as IContactForDMList)?.color as number)}`}
                                                uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full`}>
                                                {(contact as IContactForDMList)?.firstName
                                                    ? (contact as IContactForDMList)?.firstName.split("").shift()
                                                    : (contact as IContactForDMList)?.email.split("").shift()}
                                            </div>
                                        )}
                                </Avatar>
                            )}
                        {isChannel && (<div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">#</div>)}
                        {
                            isChannel
                                ? <span>{(contact as IChannel).name}</span>
                                : (<span>{(contact as IContactForDMList) ? `${(contact as IContactForDMList).firstName} ${(contact as IContactForDMList).lastName}` : (contact as IContactForDMList).email}</span>)
                        }
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ContactList