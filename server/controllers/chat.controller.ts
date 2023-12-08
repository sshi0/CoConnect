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
import { Socket } from 'socket.io';
import { io } from 'socket.io-client';

export default class ChatController extends Controller {
  public router: Router = Router();
  
  public constructor(path: string) {
    super(path);
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    // this should define the routes handled by the middlewares chatRoomPage,
    // authenticate, getAllUsers, getUser, postMessage, and getAllMessages
    this.router.get('/', this.chatRoomPage);
    this.router.post('/messages', this.authenticate, this.postMessage);
    this.router.get('/messages', this.authenticate, this.getAllMessages);
    this.router.get('/users/:username', this.authenticate, this.getUser);
    this.router.get('/users', this.authenticate, this.getAllUsers);
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
        console.log(token + " " + secretKey)
        const decodedToken = jwt.verify(token, secretKey) as ILogin;
        console.log(decodedToken);
        const user = User.validateCredentials(decodedToken);
        res.locals.authorizedUser = decodedToken.username;
        next();
      }
      catch (err) {
        console.log("Caught error in token")
        console.log(err);
        const jwtError = new YacaError('AuthenticationError', 'Token is invalid');
        res.status(401).json(jwtError); 
      }
    }
    else {
      const err = new YacaError('AuthenticationError', 'Missing authentication token');
      res.status(401).json({name: err.name, message:err.message}); // user already exists, sends error response
    }
  }

  public async getAllUsers(req: Request, res: Response) {
    // gets all users from the database
    try {
      const users = await User.getAllUsers();
      if (users) {
        const successRes: ISuccess = {
          name: 'UsersRetrieved',
          message: 'Successfully retrieved all users',
          authorizedUser: res.locals.authorizedUser,
          payload: users
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

  public async updateUser(req: Request, res: Response) {
    // update data for one user
    if (req.body.credentials.username != res.locals.authorizedUser) {
      const err = new YacaError('Authorization Error', 'User is not authorized to update this user');
      res.status(401).json({name: err.name, message:err.message}); // user already exists, sends error response
    }
    try {
      const updatedUser = await User.updateUser(req.body);
      if (updatedUser) {
        const successRes: ISuccess = {
          name: 'UserUpdated',
          message: 'Successfully updated user',
          authorizedUser: res.locals.authorizedUser,
          payload: updatedUser
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

  public async getUser(req: Request, res: Response) {
    // gets one user with username given in url
    try {
      const username = req.params.username;
      const user = await User.getUserForUsername(username);
      if (user) {
        const successRes: ISuccess = {
          name: 'UserFound',
          message: 'Successfully found user',
          authorizedUser: res.locals.authorizedUser,
          payload: user
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

  public async postMessage(req: Request, res: Response) {
    // Post a new chat message
    if (req.body.author != res.locals.authorizedUser) {
      const err = new YacaError('Authorization Error', 'User is not authorized to post this message under this username');
      res.status(401).json({name: err.name, message:err.message}); // user already exists, sends error response
    }
    try {
      const message = req.body;
      const newMessage = new ChatMessage( message.author, message.text );
      const postedMessage = await newMessage.post();
      console.log("Posted Message: " + postedMessage);
      if (postedMessage) {
        const successRes: ISuccess = {
          name: 'MessagePosted',
          message: 'Message has been posted',
          authorizedUser: res.locals.authorizedUser,
          payload: postedMessage
        };
        Controller.io.emit('newChatMessage', postedMessage);
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
      console.log("Sent request for messages");
      const messages = await ChatMessage.getAllChatMessages();
      if (messages) {
        const successRes: ISuccess = {
          name: 'MessagesRetrieved',
          message: 'Successfully retrieved all messages',
          authorizedUser: res.locals.authorizedUser,
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
