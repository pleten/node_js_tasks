import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    OnModuleInit
} from '@nestjs/common';
import {existsSync, mkdirSync} from "node:fs";
import {writeFile, readFile, rm} from "node:fs/promises";
import * as path from "path";
import {ChatDTO, MessageDTO, UserDTO} from "../dto";
import {v4 as uuidv4} from 'uuid';
import {Mutex} from "../mutex/mutex";
import Redis from "ioredis";

@Injectable()
export class Store implements OnModuleInit {
    private DB_PATH = path.join(process.cwd(), './db');
    private CHAT_PATH = path.join(this.DB_PATH, './chats');
    private USERS_DB_PATH = path.join(this.DB_PATH, './users.json');
    private CHATS_DB_PATH = path.join(this.DB_PATH, './chats.json');
    private ICONS_PATH = path.join(process.cwd(), './public/icons');
    private chatMutex: Mutex;
    private usersMutex: Mutex;
    private messagesMutex: Mutex;
    constructor(private readonly redis: Redis) {
        this.chatMutex = new Mutex(redis,'chat-db');
        this.usersMutex = new Mutex(redis,'users-db');
        this.messagesMutex = new Mutex(redis,'messages-db');
    }


    async onModuleInit() {
        if (!existsSync(this.DB_PATH)) {
            mkdirSync(this.DB_PATH, {recursive: true});
        }
        if (!existsSync(this.CHAT_PATH)) {
            mkdirSync(this.CHAT_PATH, {recursive: true});
        }
        if (!existsSync(this.USERS_DB_PATH)) {
            await writeFile(this.USERS_DB_PATH, '[]');
        }
        if (!existsSync(this.CHATS_DB_PATH)) {
            await writeFile(this.CHATS_DB_PATH, '[]');
        }
    }

    async getUsers(): Promise<UserDTO[]> {
        if (!existsSync(this.USERS_DB_PATH)) {
            return [];
        }
        const users = await readFile(this.USERS_DB_PATH);
        return JSON.parse(users.toString());
    }

    getUserByName(username: string): Promise<UserDTO | null> {
        return this.getUsers().then(users => {
            const user = users.find(user => user.name === username);
            return user || null;
        }).catch((e) => {
            throw new InternalServerErrorException(`Failed to read user data. Error: ${e.message()}`)
        });
    }

    async addUser(user: UserDTO): Promise<UserDTO> {
        this.usersMutex.lock();
        const users = await this.getUsers();
        const userIndex = users.findIndex(u => u.name === user.name);
        if (userIndex !== -1) {
            return users[userIndex];
        } else {
            users.push(user); // Add new user
        }
        return writeFile(this.USERS_DB_PATH, JSON.stringify(users)).then(() => {
            this.usersMutex.unlock();
            return user;
        }).catch((e) => {
            this.usersMutex.unlock();
            throw new InternalServerErrorException(`Failed to read messages history. Error: ${e.message()}`);
        });
    }

    async getChatHistory(chatId: string, options?: { limit?: number, cursor?: number }): Promise<MessageDTO[]> {
        const chatFileName = chatId + '.json';
        const chatFilePath = path.join(this.CHAT_PATH, chatFileName);
        if (!existsSync(chatFilePath)) {
            await writeFile(chatFilePath, '[]');
            return [];
        }
        return readFile(chatFilePath).then((data) => {
            console.log(`Reading chat history for chatId: ${chatId}, options:`, options);
            const users = JSON.parse(data.toString()) as MessageDTO[];
            if (options?.limit && options.limit > data.length) {
                if (options?.cursor) {
                    return options.cursor + 1 > options.limit
                        ? users.slice(options.cursor + 1 - options.limit, options.cursor + 1)
                        : users.slice(0, options.limit);
                }
                return users.slice(-options.limit);
            }
            return users;
        }).catch((e) => {
            throw new InternalServerErrorException(`Failed to read messages history. Error: ${e.message()}`);
        })
    }

    async sendMessageToChat(message: Partial<MessageDTO>): Promise<MessageDTO> {
        this.messagesMutex.lock();
        message.sentAt = new Date().toISOString();
        message.id = uuidv4();
        if (!message.chatId || !message.author || !message.text) {
            const missingFields = [];
            if (!message.chatId) missingFields.push('chatId');
            if (!message.author) missingFields.push('author');
            if (!message.text) missingFields.push('text');
            throw new InternalServerErrorException(`Message data is incomplete. Missing fields: ${missingFields}`);
        }
        const chatFileName = message.chatId + '.json';
        const chatFilePath = path.join(this.CHAT_PATH, chatFileName);
        const messageHistory = await this.getChatHistory(message.chatId);
        messageHistory.push(message as MessageDTO);
        try {
            await writeFile(chatFilePath, JSON.stringify(messageHistory));
            this.messagesMutex.unlock();
            return message as MessageDTO;
        } catch {
            this.messagesMutex.unlock();
            throw new InternalServerErrorException(`Failed to send message data.`);
        }
    }

    async createIcon(userId: string, icon?: Express.Multer.File): Promise<string> {
        if (!existsSync(this.ICONS_PATH)) {
            mkdirSync(this.ICONS_PATH, {recursive: true});
        }
        if (!icon) {
            return path.join(this.ICONS_PATH, 'default.png');
        }
        const iconName = `${userId}.${icon.originalname.split('.').pop()}`;
        try {
            await writeFile(path.join(this.ICONS_PATH, iconName), icon.buffer);
            return '/api/users/icons/' + iconName;
        } catch {
            throw new InternalServerErrorException(`Failed to save icon.`);
        }
    }

    async getIcon(iconPath: string): Promise<Buffer> {
        const iconFilePath = path.join(this.ICONS_PATH, iconPath);
        console.log(`Getting icon from path: ${iconFilePath}`);
        if (!existsSync(iconFilePath)) {
            throw new NotFoundException("Icon not found");
        }
        return readFile(iconFilePath);
    }

    async getChatList(user?: string): Promise<ChatDTO[]> {
        if (!existsSync(this.CHATS_DB_PATH)) {
            await writeFile(this.CHATS_DB_PATH, '[]');
            return [];
        }
        return readFile(this.CHATS_DB_PATH).then((data) => {
            const chats = JSON.parse(data.toString()) as ChatDTO[];
            return user ? chats.filter(chat => chat.members.includes(user)) : chats;
        }).catch((e) => {
            throw new InternalServerErrorException(`Failed to read chat list. Error: ${e.message()}`);
        });
    }

    async getChatData(chatId: string): Promise<ChatDTO | null> {
        const chats = await this.getChatList();
        const chat = chats.find(chat => chat.id === chatId);
        if (!chat) {
            return null;
        }
        return chat;
    }

    async createChat(chatData: ChatDTO): Promise<ChatDTO> {
        this.chatMutex.lock();
        if (!existsSync(this.CHAT_PATH)) {
            mkdirSync(this.CHAT_PATH, {recursive: true});
        }
        const chats = await this.getChatList();
        chats.push(chatData);
        try {
            const chatFileName = chatData.id + '.json';
            const chatFilePath = path.join(this.CHAT_PATH, chatFileName);
            await writeFile(chatFilePath, '[]');
            await writeFile(this.CHATS_DB_PATH, JSON.stringify(chats));
            this.chatMutex.unlock();
            return chatData;
        } catch {
            this.chatMutex.unlock();
            throw new InternalServerErrorException(`Failed to create chat`);
        }
    }

    async updateChatMembers(chatId: string, actor: string, options?: {
        remove?: string[],
        add?: string[]
    }): Promise<ChatDTO> {
        this.chatMutex.lock();
        const chats = await this.getChatList();
        const chatIndex = chats.findIndex(chat => chat.id === chatId);
        if (chatIndex === -1) {
            throw new NotFoundException(`Chat not found`);
        }
        const chat = chats[chatIndex];
        const isChatLeave = options?.remove?.includes(actor) && options?.remove?.length === 1 && (!options?.add?.includes(actor) || options.add?.length !== 0);
        if (chat.members[0] !== actor && !isChatLeave) {
            throw new ForbiddenException(`You are not allowed to update chat members`);
        }
        if (options?.remove) {
            chat.members = chat.members.filter(member => !options.remove?.includes(member));
            chat.updatedAt = new Date().toISOString();
        }
        if (options?.add) {
            chat.members.push(...options.add.filter(member => !chat.members.includes(member)));
            chat.updatedAt = new Date().toISOString();
        }
        chats[chatIndex] = chat;
        try {
            await writeFile(this.CHATS_DB_PATH, JSON.stringify(chats));
            this.chatMutex.unlock();
            return chat;
        } catch {
            this.chatMutex.unlock();
            throw new InternalServerErrorException(`Failed to update chat members`);
        }
    }

    async deleteChat(chatId: string, actor: string): Promise<void> {
        this.chatMutex.lock();
        const chats = await this.getChatList();
        const chatIndex = chats.findIndex(chat => chat.id === chatId);
        if (chatIndex === -1) {
            throw new NotFoundException(`Chat not found`);
        }
        const chat = chats[chatIndex];
        if (chat.members[0] !== actor) {
            throw new ForbiddenException(`You are not allowed to delete this chat`);
        }
        chats.splice(chatIndex, 1);
        try {
            await writeFile(this.CHATS_DB_PATH, JSON.stringify(chats));
            await rm(path.join(this.CHAT_PATH, chatId + '.json'));
            this.chatMutex.unlock();
            return;
        } catch {
            this.chatMutex.unlock();
            throw new InternalServerErrorException(`Failed to delete chat`);
        }
    }

}