// This is the model for chat messages
// It is used by the controllers to access functionality related chat messages, including database access

import DAO from '../db/dao';
import { v4 as uuidV4 } from 'uuid';
import { IChatMessage } from '../../common/chatMessage.interface';
import { IUser } from '../../common/user.interface';
import { YacaError, UnknownError } from '../../common/server.responses';
import { User } from './user.model';
import { io } from 'socket.io-client';

export class ChatMessage implements IChatMessage {
  public timestamp: string;

  public _id: string;

  constructor(
    public author: string,
    public text: string
  ) {
    this.timestamp = new Date().toISOString();
    this._id = uuidV4();
  }

  async post(): Promise<IChatMessage> {
    // post a message to the chat
    const newMessage = await DAO._db.saveChatMessage(this);
    return newMessage;
  }

  static async getAllChatMessages(): Promise<IChatMessage[]> {
    // get all chat messages
    const messages = await DAO._db.findAllChatMessages();
    return messages;
  }

  // TODO
}
