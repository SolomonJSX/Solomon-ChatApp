import {IContactForDMList} from "@/types/MessageType.ts";
import {useAppStore} from "@/store";
import {IUserInfo} from "@/types/UserType.ts";

interface IContactList {
    contacts: IContactForDMList[]
    isChannel?: boolean
}

const ContactList = ({contacts, isChannel = false}: IContactList) => {
    const {
        selectedChatType,
        selectedChatData,
        setSelectedChatType,
        setSelectedChatData,
        setSelectedChatMessages,
    } = useAppStore()

    const handleClick = (contact: IUserInfo) => {
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
                    key={contact._Id}
                    className={`pl-10 py-2 transition-all duration-300 cursor-pointer 
                    ${selectedChatData && (selectedChatData.id === contact._Id) 
                        ? "bg-[#8417ff] hover:bg-[#8417ff]" 
                        : "hover:bg-[#f1f1f111]"}`}
                    onClick={() => handleClick(contact)}
                >
                    {contact._Id}
                </div>
            ))}
        </div>
    )
}

export default ContactList