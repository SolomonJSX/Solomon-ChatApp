import { IMessage, MessageTypeEnum } from "@/types/MessageType.ts";

export interface IChannel {
    id: string; // Уникальный идентификатор канала
    name: string; // Название канала
    members: Member[]; // Список участников канала
    adminId?: string | null; // ID администратора канала (может быть null)
    messages: IMessage[]; // Список сообщений в канале
    createdAt: Date; // Дата создания канала
    updatedAt: Date; // Дата последнего обновления канала
}

export interface Member {
    id: string; // Уникальный идентификатор участника
    memberId?: string | null; // ID участника (может быть null)
    channelId: string; // ID канала, к которому привязан участник
    channel?: IChannel; // Ссылка на канал (опционально)
}

export interface IChannelResponse {
    channels: IChannel[];
}

export interface IChannelDTO {
    senderId: string
    content?: string
    messageType: MessageTypeEnum
    fileUrl?: string | undefined
    channelId: string
}

export interface IChannelRequest {
    name: string;
    membersIdList: string[];
}