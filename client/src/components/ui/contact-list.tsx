import {IContactForDMList} from "@/types/MessageType.ts";
import {useAppStore} from "@/store";
import {Avatar, AvatarImage} from "@/components/ui/avatar.tsx";
import {HOST} from "@/utils/constants.ts";
import {getColor} from "@/lib/utils.ts";

interface IContactList {
    contacts: IContactForDMList[]
    isChannel?: boolean
}

const ContactList = ({contacts, isChannel = false}: IContactList) => {
    const {
        // selectedChatType,
        selectedChatData,
        setSelectedChatType,
        setSelectedChatData,
        setSelectedChatMessages,
    } = useAppStore()

    const handleClick = (contact: IContactForDMList) => {
        if (isChannel) setSelectedChatType("channel")
        else setSelectedChatType("contact")

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
                    onClick={() => handleClick(contact)}
                >
                    <div className="flex gap-5 items-center justify-start text-neutral-300">
                        {
                            !isChannel && (
                                <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                                    {
                                        contact?.imagePath ? (
                                            <AvatarImage
                                                src={`${HOST}/${contact?.imagePath}`}
                                                alt="profile"
                                                className="object-cover w-full h-full bg-black"
                                            />
                                        ) : (
                                            <div
                                                className={`
                                                ${selectedChatData && selectedChatData.id === contact.id ? "bg-[#ffffff22] border-2 border-white/70" : `${getColor(contact?.color as number)}`}
                                                uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full`}>
                                                {contact?.firstName
                                                    ? contact?.firstName.split("").shift()
                                                    : contact?.email.split("").shift()}
                                            </div>
                                        )}
                                </Avatar>
                            )}
                        {isChannel && (<div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">#</div>)}
                        {
                            isChannel
                                ? <span>{contact.firstName}</span>
                                : (<span>{`${contact.firstName} ${contact.lastName}`}</span>)
                        }
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ContactList