import { IUser } from "./UserType";

export interface IMessage {
    id: string;
    messageType: MessageTypeEnum;
    content?: string;
    fileUrl?: string;
    timeStamp: Date;
    senderId: string;
    sender?: IUser;
    recipientId: string;
    recipient?: IUser;
}

export enum MessageTypeEnum {
    TEXT,
    FILE
}

export interface IMessageDTO {
    messageType: MessageTypeEnum;
    content?: string;
    fileUrl?: string | undefined;
    senderId: string;
    recipientId: string;
}