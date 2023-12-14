// This is the real database, using MongoDB and Mongoose
// It can be initialized with a MongoDB URL pointing to a production or development/test database

import { IDatabase } from './dao';
import mongoose from 'mongoose';
import { v4 as uuidV4 } from 'uuid';
import { Schema, model } from 'mongoose';
import { IUser } from '../../common/user.interface';
import { IChatMessage } from '../../common/chatMessage.interface';
import { IFriend } from '../../common/friend.interface';
import { ClientError, UnknownError } from '../../common/server.responses'; // if needed

const UserSchema = new Schema<IUser>({
  credentials : {
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
  },
  extra: {type: String, required: false},
  friends: {type: Array, required: false}
});

const ChatMessageSchema = new Schema<IChatMessage>({
  timestamp: {type: String, required: true},
  _id: {type: String, required: true},
  author: {type: String, required: true},
  text: {type: String, required: true}
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
    // connect to MongoDB 
    console.log(this.dbURL);
    mongoose.connect(this.dbURL);
    const db = mongoose.connection;
    db.on('error', (err) => { // listen on connection errors
      console.error(err); // if there is an error in connection, log it!
    });
    db.once('open', () => console.log('Connected to MongoDB'));
  }

  async init(): Promise<void> {
    // Initializes empty database for EARLY/DEV 
    console.log("Initializing DB");
    await MUser.deleteMany({});
    await MChatMessage.deleteMany({});
  }

  async close(): Promise<void> {
    // TODO
  }

  async saveUser(user: IUser): Promise<IUser> {
    // Save user to MongoDB
    const newUser = new MUser(user);
    const savedUser: IUser = await newUser.save();
    return savedUser;
  }

  async findUserByUsername(username: string): Promise<IUser | null> {
    // Find one user by username
    const user: IUser | null = await MUser.findOne({'credentials.username': username}).exec();
    return user;
  }

  async findUserByDisplayName(displayName: string): Promise<IUser | null> {
    // Find one user by username
    const user: IUser | null = await MUser.findOne({'extra': displayName}).exec();
    return user;
  }

  async findAllUsers(): Promise<IUser[]> {
    // Find all users
    const users: IUser[] = await MUser.find({}).exec();
    return users;
  }

  async updateUser(user: IUser): Promise<IUser | null> {
    // Update data for one user
    const findUser = await MUser.findOne({'credentials.username': user.credentials.username}).exec();
    const newUser = new MUser(user);
    if (findUser) {
      findUser.extra = newUser.extra;
      findUser.friends = newUser.friends;
      await findUser.save();
    }
    const updatedUser = await MUser.findOne({'credentials.username': user.credentials.username}).exec();
    return updatedUser;
  }

  async saveChatMessage(message: IChatMessage): Promise<IChatMessage> {
    const newMessage = new MChatMessage(message);
    const savedMessage = await newMessage.save();
    return savedMessage;
  }

  async findAllChatMessages(): Promise<IChatMessage[]> {
    const messages: IChatMessage[] = await MChatMessage.find().exec();
    return messages;
  }

  async findChatMessageById(_id: string): Promise<IChatMessage | null> {
    const message = await MChatMessage.findOne({'_id': _id}).exec();
    return message;
  }
}
