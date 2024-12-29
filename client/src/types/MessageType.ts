import { IChannel } from "./ChannelType";
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

    channelId?: string;
    channel?: IChannel;
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

export interface IMessagesResponseDTO {
    messages: IMessage[];
}

// Определение типа для результата GetContactsForDMList
export interface IContactForDMList {
    id: string;                 // Идентификатор контакта
    lastMessageTime: Date;     // Время последнего сообщения (ISO-строка или дата)
    email: string;               // Email пользователя
    firstName: string;           // Имя пользователя
    lastName: string;            // Фамилия пользователя
    imagePath: string;           // Путь к изображению
    color: number | null;               // Цвет пользователя (например, для аватарки)
}

export interface IUploadFileResponse {
    filePath: string | undefined
}