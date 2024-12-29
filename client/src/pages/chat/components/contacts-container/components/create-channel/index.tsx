import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {FaPlus} from "react-icons/fa";
import {useEffect, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import apiClient from "@/lib/api-client";
import {IGetAllContactsResponse} from "@/types/UserType";
import {
    CREATE_CHANNEL_ROUTE,
    GET_ALL_CONTACTS_ROUTE,
} from "@/utils/constants";
import {Button} from "@/components/ui/button";
import MultipleSelector, {Option} from "@/components/ui/multipleSelect"; // Adjust the import path as necessary
import {useAppStore} from "@/store";
import {IChannel, IChannelRequest} from "@/types/ChannelType";

export const CreateChannel = () => {
    const {addChannel} = useAppStore();

    const [newChannelModal, setNewChannelModal] = useState<boolean>(false);
    // const [searchedContacts, setSearchedContacts] = useState<Option[] | undefined>(undefined);
    const [allContacts, setAllContacts] = useState<Option[] | undefined>(undefined);
    const [selectedContacts, setSelectedContacts] = useState<Option[] | undefined>(undefined);
    const [channelName, setChannelName] = useState<string>("");

    useEffect(() => {
        const getData = async () => {
            const response = await apiClient.get<IGetAllContactsResponse>(
                GET_ALL_CONTACTS_ROUTE,
                {withCredentials: true}
            );

            setAllContacts(response.data.contacts);
        };

        getData();
    }, []);

    const createChannel = async () => {
        const channelRequest: IChannelRequest = {
            name: channelName,
            membersIdList: selectedContacts?.map((contact) => contact.value) || [],
        };
        try {
            if (channelName.length > 0 && selectedContacts?.length as number > 0) {
                const response = await apiClient.post<IChannel>(
                    CREATE_CHANNEL_ROUTE,
                    channelRequest,
                    {withCredentials: true}
                );

                if (response.status === 200) {
                    setChannelName("");
                    setSelectedContacts([]);
                    setNewChannelModal(false);
                    addChannel(response.data);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <FaPlus
                                className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
                                onClick={() => setNewChannelModal(true)}
                            />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
                            Select New Contact
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
                    <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
                        <DialogHeader>
                            <DialogTitle>Please fill up details for new channel.</DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <div>
                            <Input
                                placeholder="Channel Name"
                                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                                onChange={(e) => setChannelName(e.target.value)}
                                value={channelName}
                            />
                        </div>
                        <div>
                            <MultipleSelector
                                className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
                                defaultOptions={allContacts}
                                placeholder="Search Contacts"
                                value={selectedContacts}
                                onChange={setSelectedContacts}
                                emptyIndicator={
                                    <p className="text-center text-lg leading-10 text-gray-600">
                                        No results found.
                                    </p>
                                }
                            />
                        </div>
                        <div>
                            <Button
                                className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
                                onClick={createChannel}
                            >
                                Create Channel
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </>
        </div>
    );
};
