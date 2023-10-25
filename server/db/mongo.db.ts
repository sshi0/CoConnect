// This is the real database, using MongoDB and Mongoose
// It can be initialized with a MongoDB URL pointing to a production or development/test database

import { IDatabase } from './dao';
import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';
import { IUser } from '../../common/user.interface';
import { IChatMessage } from '../../common/chatMessage.interface';
// import { YacaError, UnknownError } from '../../common/server.responses'; // if needed

const UserSchema = new Schema<IUser>({
  // TODO
});

const ChatMessageSchema = new Schema<IChatMessage>({
  // TODO
});

const MUser = model<IUser>('User', UserSchema);

const MChatMessage = model<IChatMessage>('Message', ChatMessageSchema);

export class MongoDB implements IDatabase {
  // to implement IDB

  public dbURL: string;

  private db: mongoose.Connection | undefined;

  constructor(dbURL: string) {
    this.dbURL = dbURL;
  }

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
    // TODO
    return user;
  }

  async findUserByUsername(username: string): Promise<IUser | null> {
    // TODO
    return null;
  }

  async findAllUsers(): Promise<IUser[]> {
    // TODO
    return [];
  }

  async saveChatMessage(message: IChatMessage): Promise<IChatMessage> {
    // TODO
    return message;
  }

  async findAllChatMessages(): Promise<IChatMessage[]> {
    // TODO
    return [];
  }

  async findChatMessageById(_id: string): Promise<IChatMessage | null> {
    // TODO
    return null;
  }
}
