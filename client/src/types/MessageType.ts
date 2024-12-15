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

export interface IMessagesResponseDTO {
    messages: IMessage[];
}

// Определение типа для результата GetContactsForDMList
export interface IContactForDMList {
    _Id: string;                 // Идентификатор контакта
    LastMessageTime: string;     // Время последнего сообщения (ISO-строка или дата)
    Email: string;               // Email пользователя
    FirstName: string;           // Имя пользователя
    LastName: string;            // Фамилия пользователя
    ImagePath: string;           // Путь к изображению
    Color: string;               // Цвет пользователя (например, для аватарки)
}
