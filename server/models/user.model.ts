// This is the model for users
// It is used by the controllers to access functionality related users, including database access

import { ILogin, IUser } from '../../common/user.interface';
import { v4 as uuidV4 } from 'uuid';
import DAO from '../db/dao';
import { ClientError, UnknownError } from '../../common/server.responses';
import bcrypt from 'bcrypt';
import { IFriend } from 'common/friend.interface';

export class User implements IUser {
  credentials: ILogin;

  extra?: string; // this carries the displayName of the user

  _id?: string; // this carries the unique id of the user

  friends?: IFriend[]; // this carries the list of friends of the user

  constructor(credentials: ILogin, extra?: string, friends?: IFriend[]) {
    this.credentials = credentials;
    this.extra = extra;
    this.friends = friends;
  }

  async join(): Promise<IUser> {
    // join coConnect as a user, serving the register request
    console.log('Display Name: ' + this.extra + ' ' + !this.extra);
    const isValidPassword = await User.checkPassword(this.credentials);
    if (!this.credentials.username) {
      throw new ClientError('Username empty', 'Username cannot be empty');
    }
    else if (!this.credentials.password) {
      throw new ClientError('Password empty', 'Password cannot be empty');
    }
    else if (!this.extra) {
      throw new ClientError('Display Name empty', 'Choose a display name');
    }
    else if (isValidPassword != null) {
      throw new ClientError('Invalid Password', isValidPassword);
    }
    const username = this.credentials.username;
    const existingUsername = await User.getUserForUsername(this.credentials.username);
    const existingDisplayName = await User.getUserForDisplayName(this.extra);
    if (existingUsername || existingDisplayName) {
      throw new ClientError('User Exists', 'User already exists');
    }
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(this.credentials.password, salt);
    const extra = this.extra;
    const user = { credentials: { username, password }, extra: extra };
    await DAO._db.saveUser(user);
    return user;
  }

  async login(): Promise<IUser> {
    // login to  coConnect with user credentials
    if (this.credentials.username == '') {
      throw new ClientError('Username empty', 'Username cannot be empty');
    }
    else if (this.credentials.password == '') {
      throw new ClientError('Password empty', 'Password cannot be empty');
    }
    const user = await User.getUserForUsername(this.credentials.username);
    if (!user) {
      throw new ClientError('Invalid Username', 'User not found');
    }
    else {
      const match = await bcrypt.compare(this.credentials.password, user.credentials.password);
      if (!match) {
        throw new ClientError('Password Error', 'Incorrect password');
      }
    }
    return this;
  }

  static async addNewFriend(username: string, friend: IFriend): Promise<IUser | null> {
    // add a new friend to the user's friend list
    const user = await DAO._db.findUserByUsername(username);
    let updatedUser;
    if (user) {
      const friendExists = user.friends?.find((f) => f.email === friend.email);
      if (friendExists) {
        throw new ClientError('FriendExists', 'This friend already exists');
      }
      else if (friend.email === user.credentials.username) {
        throw new ClientError('Adding ownself as friend', 'User trying to add himself as friend');
      }
      else {
        user.friends?.push(friend);
        updatedUser = await DAO._db.updateUser(user);
      }
    }
    else {
      throw new ClientError('UserNotFound', 'User not found');
    }
    return updatedUser;
  }

  static async deleteFriend(username: string, friend: IFriend): Promise<IUser | null> {
    const user = await DAO._db.findUserByUsername(username);
    let updatedUser;
    if (user) {
      console.log("Friend list: " + user.friends);
      console.log("Friend to delete: " + friend.email);
      const friendExists = user.friends?.find((f) => f.email === friend.email);
      if (!friendExists) {
        throw new ClientError('FriendNotFound', 'Unable to delete non-existent friend');
      }
      else {
        user.friends = user.friends?.filter((f) => f.email !== friend.email);
        updatedUser = await DAO._db.updateUser(user);
      }
    }
    else {
      throw new ClientError('UserNotFound', 'User not found');
    }
    return updatedUser;
  }
  
  static async clearFriends(username: string): Promise<IUser | null> {
    // clear the user's friend list
    const user = await DAO._db.findUserByUsername(username);
    if (user) {
      user.friends = [];
      await DAO._db.updateUser(user);
    }
    else {
      throw new ClientError('UserNotFound', 'User not found');
    }
    return user;
  }


  static async getAllUsers(): Promise<IUser[]> {
    // get the usernames of all users
    const users = await DAO._db.findAllUsers();
    return users;
  }

  static async getUserForUsername(username: string): Promise<IUser | null> {
    // get the user having a given username
    const user = await DAO._db.findUserByUsername(username);
    return user;
  }

  static async getUserForDisplayName(username: string): Promise<IUser | null> {
    // get the user having a given username
    const user = await DAO._db.findUserByDisplayName(username);
    return user;
  }

  static async validateCredentials(credentials: ILogin): Promise<IUser> {
    // validate the credentials of a user
    const user = await DAO._db.findUserByUsername(credentials.username);
    if (!user) {
      throw new ClientError('Invalid Token', 'Token is invalid');
    }
    return user;
  }

  static async updateUser(user: IUser): Promise<IUser | null> {
    // update the data for a user
    const updatedUser = await DAO._db.updateUser(user);
    return updatedUser;
  }

  static async checkPassword(credentials: ILogin): Promise<string | null> {
    // check the password of a user
    if (credentials.password.length < 4) {return "Password too short, at least 4 characters"}
    if (!/\d/.test(credentials.password)) {return "Pasword too weak, at least one digit"}
    if (!/[a-zA-Z]/.test(credentials.password)) {return "Password too weak, at least one letter"}
    const special = /['!', '@', '#', '$', '%', '^', '&', '~', '*', '-', '+']/;
    if (!special.test(credentials.password)) {return "Password too weak, at least one special character"}
    const invalid = /[^a-zA-Z\d\!\@\#\$\%\^\&\~\*\-\+]/;
    if (invalid.test(credentials.password)) {return "Password contains invalid characters"}
    return null;
  }
}
