// This is the model for chat messages
// It is used by the controllers to access functionality related chat messages, including database access

import DAO from '../db/dao';
import { v4 as uuidV4 } from 'uuid';
import { IChatMessage } from '../../common/chatMessage.interface';
import { IFriend } from '../../common/friend.interface';
import { IUser } from '../../common/user.interface';
import { ClientError, UnknownError } from '../../common/server.responses';
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

  static async getAllFriendChatMessages(user: IUser): Promise<IChatMessage[]> {
    // get all chat messages
    const messages = await DAO._db.findAllChatMessages();
    const friends = user.friends as IFriend[];
    const friendNames = friends.map((friend) => friend.displayName);
    const friendMessages = (messages.filter((message) => (friendNames.includes(message.author) || message.author === user.extra as string)));
    console.log(friendNames.includes(messages[0].author));
    console.log(messages[0].author);
    console.log("All Messages " + messages);
    console.log("Friend Message " + friendMessages);
    console.log("Friend Names " + friendNames);
    return friendMessages;
  }

  // TODO
}
