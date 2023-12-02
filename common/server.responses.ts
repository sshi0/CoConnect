import { IUser, ILogin } from './user.interface';
import { IChatMessage } from './chatMessage.interface';

// IResponse is the data type carried in a server response's body
// Note that it's a union type
// To be type-safe, let's specify a valid response body in terms of what it can be
export type IResponse = ISuccess | YacaError | UnknownError;

// in a response, the password property of an ILogin object should always be objustcated, e.g., replaced by '*******';

export interface IAuthenticatedUser {
  // when the user is authenticated through a login request, this is the response's payload
  user: IUser;
  token: string; // the JWT token generated in response to successfull authentication
}

export interface ISuccess {
  // a successful response
  // name, message, authorizedUser are meta-data
  // the actual data returned is in payload property
  name: string; // name describing the action that succeeded
  message?: string; // an optional, informative message about the success condition
  authorizedUser?: string; // the username of the authorized user, for information purposes
  /* 
     payload is the actual data returned in the response;
     if there is no such data, payload should be set to null
  */
  payload:
    | IUser
    | IChatMessage
    | ILogin
    | IChatMessage[]
    | IUser[]
    | IAuthenticatedUser
    | null;
}

export class YacaError extends Error {
  // generated by server code in response to invalid client requests, typically originating from a model
  name: string;
  constructor(errName: string, errMessage: string) {
    super(errMessage);
    this.name = errName;
    this.message = errMessage;
  }
}

export class UnknownError extends Error {
  // captured by server code in response to a runtime error
  name: string;
  constructor(errName: string, errMessage: string) {
    super(errMessage);
    this.name = errName;
    this.message = errMessage;
  }
}

// type guards to reduce a value of union type IResponse to a specific subtype
// use type guards or type assertions as needed and appropriate

export function isClientError(err: Error): err is YacaError {
  if (!(err instanceof YacaError)) return false;
  return true;
}

export function isUnknownError(err: Error): err is UnknownError {
  if (!(err instanceof UnknownError)) return false;
  return true;
}

export function isISuccess(obj: IResponse): obj is ISuccess {
  if (!(isUnknownError(obj as Error) && !isClientError(obj as Error))) {
    return 'name' in obj && 'payload' in obj;
  }
  return false;
}

// See usage examples in trials/ts-eg/types.ts
