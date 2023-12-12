// data for the user model

import { IFriend } from "./friend.interface";

export interface ILogin {
  // represents a user's authentication credentials
  username: string; // stores the user's email provided in a request
  password: string;
}

export interface IUser {
  // represents a user's data
  credentials: ILogin;
  friends?: IFriend[]; // stores the user's friends
  _id?: string; // a unique user id
  extra?: string; // stores the user's displayName provided in a request
}
