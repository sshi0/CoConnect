// these are TS types required by socket.io
// will be explained in class

import { IChatMessage } from './chatMessage.interface';

export interface ServerToClientEvents {
  newChatMessage: (chatMessage: IChatMessage) => void;
}

export interface ClientToServerEvents {
  ping: () => void;
}
