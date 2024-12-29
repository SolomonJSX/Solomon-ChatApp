import { Option } from "@/components/ui/multipleSelect"

export interface IUser {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    imagePath: string | null
    color: number | null
    profileSetup: boolean
}

export interface IUserInfo {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    imagePath: string | null
    color: number | null
    profileSetup: boolean
}

export interface IContact {
    label: string;
    id: string
}

export interface IGetAllContactsResponse {
    contacts: Option[];
}
