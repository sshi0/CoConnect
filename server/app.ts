import express, { Express, Request, Response, NextFunction } from 'express';
import { Server as HttpServer, createServer } from 'http';
import DAO, { IDatabase } from './db/dao';
import Controller from './controllers/controller';
import { ENV } from './env'; // for later
import { JWT_KEY as secretKey, JWT_EXP as tokenExpiry } from './env'; 
import { Server as SocketServer, Socket } from 'socket.io'; 
import { ClientToServerEvents, ServerToClientEvents } from '../common/socket.interface'; 
// other imports you need

interface InterServerEvents {
  ping: () => void; // unused
}


class App {
  public app: Express;

  public port: number;

  public db: IDatabase;

  public host: string;

  public clientDir: string; // pathname for the client folder

  public url: string;

  public server: HttpServer;

  public io: SocketServer; // for later

  constructor(
    controllers: Controller[],
    params: {
      port: number;
      host: string;
      clientDir: string;
      db: IDatabase;
    }
  ) {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new SocketServer<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents
      //SocketData
      >(this.server); 
    this.port = params.port;
    this.db = params.db;
    this.host = params.host;
    this.clientDir = params.clientDir;
    this.url = `${this.host}:${this.port}`; // construct the URL from the host and port
    this.configureApp();
    this.configureMiddlewares();
    this.configureControllers(controllers);
    // more TODO here?
  }

  private configureApp() {
    DAO.db = this.db;
    DAO.db.connect().then(() => {
      // typically should initialize the DB to a blank state here if ENV === 'DEV' or ENV === 'EARLY'
      if (ENV === 'DEV' || ENV === 'EARLY') {
        DAO.db.init();
      }
    });
  }

  private configureMiddlewares() {
    // TODO
    this.app.use(express.static(this.clientDir)); // serve the static assets from the client folder
    this.app.use(express.json()); // for parsing request's json body
    this.app.use(express.urlencoded({ extended: true })); // for decoding the encoded url
    this.app.use(this.serverLogger); // add a logging middleware
  }

  private configureControllers(controllers: Controller[]) {
    Controller.io = this.io; 
    controllers.forEach((controller) => {
      this.app.use(controller.path, controller.router);
    });
  }

  public serverLogger(req: Request, res: Response, next: NextFunction) {
    console.log(req.method + ' ' + req.url)
    console.log(res.statusCode)
    console.log(req.body)
    next();
  }

  public async listen(): Promise<HttpServer> {
    // listen for incoming requests
    return new Promise<HttpServer>((resolve, reject) => {
      this.io.on('connection', (socket: Socket) => {
         console.log('⚡️[Server]: A client connected to the socket server with id' + socket.id);
        });
      try {
        this.server.listen(this.port, () => {
          // must listen on http server, not express ap, for socket.io to work
          console.log(`⚡️[Server]: Running at ${this.url}...`);
          resolve(this.server);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}

export default App;
