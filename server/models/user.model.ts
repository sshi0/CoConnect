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
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(this.credentials.password, salt);
    const extra = this.extra;
    console.log('Username: ' + username + ' Password: ' + password + ' Display Name: ' + extra);
    const user = { credentials: { username, password }, extra: extra };
    await DAO._db.saveUser(user);
    return user;
  }

  async login(): Promise<IUser> {
    // login to  YACA with user credentials
    const user = await User.getUserForUsername(this.credentials.username);
    console.log('DB Username: ' + user?.credentials.username)
    console.log('DB Password: ' + user?.credentials.password)
    console.log('DB Extra: ' + user?.extra)
    if (!user) {
      throw new YacaError('Invalid Username', 'User not found');
    }
    else {
      const match = await bcrypt.compare(this.credentials.password, user.credentials.password);
      if (!match) {
        throw new YacaError('Password Error', 'Incorrect password');
      }
    }
    return user;
  }

  static async getAllUsernames(): Promise<string[]> {
    // get the usernames of all users
    // TODO
    return [];
  }

  static async getUserForUsername(username: string): Promise<IUser | null> {
    // get the user having a given username
    return await DAO._db.findUserByUsername(username);
  }

  static async validateUser(credentials: ILogin): Promise<IUser> {
    // validate the credentials of a user
    return {credentials};
  }
}
