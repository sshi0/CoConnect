import path from 'path';
import App from './app';

import { MongoDB } from './db/mongo.db'; 
import { InMemoryDB } from './db/inMemory.db';
import { PORT, HOST, ENV } from './env';
import { DB_CONN_STR as dbURL } from './env'; 
import AuthController from './controllers/auth.controller';
import ChatController from './controllers/chat.controller';
import HomeController from './controllers/home.controller';
import FriendsController from './controllers/friends.controller';

const app = new App(
  [
    new AuthController('/auth'),
    new ChatController('/chat'),
    new FriendsController('/friends'),
    new HomeController('/'),
  ],
  {
    clientDir: path.join(__dirname, '../.dist/client'),
    db: ENV === 'EARLY' ? new InMemoryDB() : new MongoDB(dbURL),
    port: PORT,
    host: HOST
  }
);

app.listen();
