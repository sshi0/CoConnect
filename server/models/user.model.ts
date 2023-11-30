// This is the model for users
// It is used by the controllers to access functionality related users, including database access

import { ILogin, IUser } from '../../common/user.interface';
import { v4 as uuidV4 } from 'uuid';
import DAO from '../db/dao';
import { YacaError, UnknownError } from '../../common/server.responses';
import bcrypt from 'bcrypt';

export class User implements IUser {
  credentials: ILogin;

  extra?: string; // this carries the displayName of the user

  _id?: string;

  constructor(credentials: ILogin, extra?: string) {
    this.credentials = credentials;
    // TODO
  }

  async join(): Promise<IUser> {
    // join YACA as a user, serving the register request
    const username = this.credentials.username;
    const password = await bcrypt.hash(this.credentials.password, 10);
    await DAO._db.saveUser({ credentials: { username, password }, extra: this.extra });
    return user;
  }

  async login(): Promise<IUser> {
    // login to  YACA with user credentials
    
    return { credentials: { username: '', password: 'obfuscated' } };
  }

  static async getAllUsernames(): Promise<string[]> {
    // get the usernames of all users
    // TODO
    return [];
  }

  static async getUserForUsername(username: string): Promise<IUser | null> {
    // get the user having a given username
    // TODO
    return null;
  }

  static async validateUser(credentials: ILogin): Promise<IUser> {
    // validate the credentials of a user
    const user = await User.getUserForUsername(credentials.username);
    if (!user) {
      throw new YacaError('Invalid Username', 'User not found');
    }
    else {
      const match = await bcrypt.compare(credentials.password, user.credentials.password);
      if (!match) {
        throw new YacaError('Password Error', 'Incorrect password');
      }
    }
    return user;
  }
}
