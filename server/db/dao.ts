// dao = Data Access Object
// This is the access point to the database
// It is used to decouple the database from the rest of the application
// It is accessed by the models, which are used by the controllers

import { IFriend } from 'common/friend.interface';
import { IChatMessage } from '../../common/chatMessage.interface';
import { IUser } from '../../common/user.interface';

export interface IDatabase {
  connect(): Promise<void>;

  init(): Promise<void>;

  close(): Promise<void>;

  saveUser(userData: IUser): Promise<IUser>;

  findUserByUsername(username: string): Promise<IUser | null>;

  findUserByDisplayName(username: string): Promise<IUser | null>;

  findAllUsers(): Promise<IUser[]>;

  updateUser(user: IUser): Promise<IUser | null> 

  findAllChatMessages(): Promise<IChatMessage[]>;

  findChatMessageById(_id: string): Promise<IChatMessage | null>;

  saveChatMessage(message: IChatMessage): Promise<IChatMessage>;
}

class DAO {
  static _db: IDatabase;

  static get db(): IDatabase {
    return DAO._db;
  }

  static set db(db: IDatabase) {
    DAO._db = db;
  }
}

export default DAO;
