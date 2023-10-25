// This is the model for chat messages
// It is used by the controllers to access functionality related chat messages, including database access

import DAO from '../db/dao';
import { v4 as uuidV4 } from 'uuid';
import { IChatMessage } from '../../common/chatMessage.interface';
import { IUser } from '../../common/user.interface';
import { YacaError, UnknownError } from '../../common/server.responses';
import { User } from './user.model';

export class ChatMessage implements IChatMessage {
  // public timestamp: string;

  // public _id: string;

  constructor(
    public author: string,
    public text: string
  ) {
    // TOOD
  }

  async post(): Promise<IChatMessage> {
    // TODO
    return { _id: '', author: '', text: '', timestamp: '' };
  }

  static async getAllChatMessages(): Promise<IChatMessage[]> {
    // TODO
    return [];
  }

  // TODO
}
