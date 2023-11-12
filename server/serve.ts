import path from 'path';
import App from './app';

// import { MongoDB } from './db/mongo.db'; // for later
import { InMemoryDB } from './db/inMemory.db';
import { PORT, HOST } from './env';
import { DB_CONN_STR as dbURL } from './env'; // for later
import AuthController from './controllers/auth.controller';
import ChatController from './controllers/chat.controller';
import HomeController from './controllers/home.controller';
import FriendsController from './controllers/friends.controller';

const app = new App(
  [
    // TODO: Add initialized controllers here
  ],
  {
    clientDir: path.join(__dirname, '../.dist/client'),
    /* 
      for now using an IMemeoryDB instance, but later change the following so that
      if ENV !== 'EARLY', a MongoDB instance new MongoDB(dbURL) is used...
    */
    db: ENV === 'EARLY' ? new InMemoryDB() : new InMemoryDB(),
    port: PORT,
    host: HOST
  }
);

app.listen();
