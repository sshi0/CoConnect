// an InMemory version of the database that you can use in early-stage development
// It's not persistent, but can be used for testing and debugging
// It allows you to evolve your application in the absense of a real database

import { IDatabase } from './dao';
import { IChatMessage } from '../../common/chatMessage.interface';
import { IUser } from '../../common/user.interface';
import { YacaError, UnknownError } from '../../common/server.responses';

export class InMemoryDB implements IDatabase {
  // TODO

  async connect(): Promise<void> {
    // TODO
  }

  async init(): Promise<void> {
    // TODO
  }

  async close(): Promise<void> {
    // TODO
  }

  async saveUser(user: IUser): Promise<IUser> {
    // TODO: must return a copy of the saved user
    return user;
  }

  async findUserByUsername(username: string): Promise<IUser | null> {
    // TODO
    return null;
  }

  async findAllUsers(): Promise<IUser[]> {
    const users: IUser[] = [];
    // TODO
    return users;
  }

  async saveChatMessage(message: IChatMessage): Promise<IChatMessage> {
    // TODO: must return a copy of the saved message
    return message;
  }

  async findChatMessageById(_id: string): Promise<IChatMessage | null> {
    // TODO
    return null;
  }

  async findAllChatMessages(): Promise<IChatMessage[]> {
    const messages: IChatMessage[] = [];
    // TODO
    return messages;
  }
}
