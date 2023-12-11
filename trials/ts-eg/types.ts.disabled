import {
  YacaError,
  UnknownError,
  IResponse,
  ISuccess,
  isUnknownError,
  isClientError,
  isISuccess
} from '../../common/server.responses';

import { IUser, ILogin } from '../../common/user.interface';
import { IChatMessage } from '../../common/chatMessage.interface';

let a: IResponse;

let b = {
  name: 'Hakan',
  message: 'some message',
  resource: {
    username: 'hakan',
    password: 'blah'
  },
  authorizedUser: 'authUser',
  token: 'token'
};

const c = new YacaError('a yaca error', 'error msg');
const d = new UnknownError('an unknown error', 'error msg');

a = b;

console.log('a is ISuccess: ', a);

a = c;

console.log('a is YacaError: ' + a);

a = d;

console.log('ais UnknownError: ' + a);

let e: IResponse;

e = b;

console.log('e is ISuccess: ', e);

e = c;

console.log('e is YacaError: ' + e);

e = d;

console.log('e is UnknownError: ' + e);

let f: unknown;

f = {
  name: 'Hakan',
  message: 'some message',
  resource: {
    username: 'hakan',
    password: 'blah'
  },
  authorizedUser: 'authUser',
  token: 'token'
};

let g: IResponse = f as IResponse;

if (isISuccess(g)) {
  console.log('g.payload is: ', g.payload);
}

console.log('g.payload is: ', (g as ISuccess).payload);
