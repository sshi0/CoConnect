// Controller serving the chat room page and handling the loading, posting, and update of chat messages
// Note that controllers don't access the DB direcly, only through the models

import Controller from './controller';
import { ILogin, IUser } from '../../common/user.interface';
import { User } from '../models/user.model';
import { ChatMessage } from '../models/chatMessage.model';
import { IChatMessage } from '../../common/chatMessage.interface';
import { NextFunction, Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_KEY as secretKey, JWT_EXP as tokenExpiry } from '../env';
import {
  ISuccess,
  YacaError,
  UnknownError,
  isClientError,
  isISuccess,
  isUnknownError
} from '../../common/server.responses';
export default class ChatController extends Controller {
  public constructor(path: string) {
    super(path);
    this.initializeRoutes();
  }

  public router: Router = Router();

  public initializeRoutes(): void {
    // this should define the routes handled by the middlewares chatRoomPage,
    // authenticate, getAllUsers, getUser, postMessage, and getAllMessages
    this.router.get('/', this.chatRoomPage);
    this.router.post('/messages', this.authenticate, this.postMessage);
    this.router.get('/messages', this.authenticate, this.getAllMessages);
    this.router.get('/users/:username', this.getUser);
    this.router.get('/users', this.getAllUsers);
    this.router.patch('/user/:username', this.updateUser);
  }

  public chatRoomPage(req: Request, res: Response) {
    res.redirect('/pages/chat.html');
  }

  public authenticate(req: Request, res: Response, next: NextFunction) {
    // authenticate the user(validate if token is valid)
    const token = req.headers.authorization?.split(' ')[1]; //extracts token from header

    if (token) {
      try {
        const decodedToken = jwt.verify(token, secretKey) as ILogin;
        const user = User.validateCredentials(decodedToken);
        
        // const browserCreds = localStorage.getItem('userCreds');
        // const userCreds = JSON.parse(browserCreds || '{}') as ILogin;
        // if (userCreds) {
        //   const user = new User(userCreds);
        // }
        next();
      }
      catch (err) {
        if (err instanceof Error) {
          if (isClientError(err)) {
            res.status(400).json({name: err.name, message:err.message}); // user already exists, sends error response
          } 
          if (isUnknownError(err)) {
            res.status(500).json({name: err.name, message:err.message}); // unknown error, sends error response
          }
        }
      }
    }
    else {
      const err = new YacaError('AuthenticationError', 'Missing authentication token');
      res.status(401).json({name: err.name, message:err.message}); // user already exists, sends error response
    }
  }

  public async getAllUsers(req: Request, res: Response) {
    // TODO
  }

  public async updateUser(req: Request, res: Response) {
    // TODO
  }

  public async getUser(req: Request, res: Response) {
    // TODO
  }

  public async postMessage(req: Request, res: Response) {
    // Post a new chat message
    try {
      const message = req.body.message;
      const newMessage = new ChatMessage( message.text, message.author );
      const postedMessage = await newMessage.post();
      if (postedMessage) {
        const successRes: ISuccess = {
          name: 'MessagePosted',
          message: 'Message has been posted',
          authorizedUser: req.body.credentials.username,
          payload: postedMessage
        };
        res.status(201).json(successRes); // post success, sends success response
      }
    }
    catch (err) {
      if (err instanceof Error) {
        if (isClientError(err)) {
          res.status(400).json({name: err.name, message:err.message}); // user already exists, sends error response
        } 
        if (isUnknownError(err)) {
          res.status(500).json({name: err.name, message:err.message}); // unknown error, sends error response
        }
      }
    }
  }

  public async getAllMessages(req: Request, res: Response) {
    // returns all chat message
    try {
      const messages = await ChatMessage.getAllChatMessages();
      if (messages) {
        const successRes: ISuccess = {
          name: 'MessagesRetrieved',
          message: 'Successfully retrieved all messages',
          authorizedUser: req.body.credentials.username,
          payload: messages
        };
        res.status(201).json(successRes); // post success, sends success response
      }
    }
    catch (err) {
      if (err instanceof Error) {
        if (isClientError(err)) {
          res.status(400).json({name: err.name, message:err.message}); // user already exists, sends error response
        } 
        if (isUnknownError(err)) {
          res.status(500).json({name: err.name, message:err.message}); // unknown error, sends error response
        }
      }
    }
  }
}
