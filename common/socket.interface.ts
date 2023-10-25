// these are TS types required by socket.io
// will be explained in class

import { IChatMessage } from './chatMessage.interface';

export interface ServerToClientEvents {
  newMessage: (message: IChatMessage) => void;
}

export interface ClientToServerEvents {
  ping: () => void;
}
