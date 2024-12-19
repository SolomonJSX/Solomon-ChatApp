import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"
import {FaPlus} from "react-icons/fa"
import {useState} from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import Lottie from "react-lottie"
import {animationDefaultOptions, getColor} from "@/lib/utils"
import apiClient from "@/lib/api-client"
import {IUserInfo} from "@/types/UserType"
import {HOST, SEARCH_CONTACTS_ROUTE} from "@/utils/constants"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Avatar, AvatarImage} from "@/components/ui/avatar"
import {useAppStore} from "@/store"

export const CreateChannel = () => {
    const {setSelectedChatType, setSelectedChatData} = useAppStore()
    const [openNewContactModal, setOpenNewContactModal] = useState<boolean>(false)
    const [searchedContacts, setSearchedContacts] = useState<IUserInfo[]>([])

    const searchContacts = async (searchTerm: string) => {
        try {
            if (searchTerm.length > 0) {
                const response = await apiClient.post<IUserInfo[]>(`${SEARCH_CONTACTS_ROUTE}`, {searchTerm}, {
                    withCredentials: true, headers: {
                        "Content-Type": "application/json"
                    }
                })

                if (response.status === 200 && response.data) {
                    setSearchedContacts(response.data)
                }
            } else {
                setSearchedContacts([])
            }
        } catch (error) {
            console.log({error})
        }
    }

    const selectedNewContact = (contact: IUserInfo) => {
        setOpenNewContactModal(false)
        setSelectedChatType("contact")
        setSelectedChatData(contact)
        setSearchedContacts([])
    }

    return (
        <div>
            <>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <FaPlus
                                className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
                                onClick={() => setOpenNewContactModal(true)}
                            />
                        </TooltipTrigger>
                        <TooltipContent
                            className="bg-[#1c1b1e] border-none mb-2 p-3 text-white"

                        >Select New Contact</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
                    <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
                        <DialogHeader>
                            <DialogTitle>Please select a contact</DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <div>
                            <Input placeholder="Search Contacts" className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                                   onChange={(e) => searchContacts(e.target.value)}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            </>
        </div>
    )
}