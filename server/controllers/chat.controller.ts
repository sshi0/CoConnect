// Controller serving the chat room page and handling the loading, posting, and update of chat messages
// Note that controllers don't access the DB direcly, only through the models

import Controller from './controller';
import { ILogin, IUser } from '../../common/user.interface';
import { User } from '../models/user.model';
import { ChatMessage } from '../models/chatMessage.model';
import { IChatMessage } from '../../common/chatMessage.interface';
import { NextFunction, Request, Response } from 'express';
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

  public initializeRoutes(): void {
    // this should define the routes handled by the middlewares chatRoomPage,
    // authenticate, getAllUsers, getUser, postMessage, and getAllMessages
    this.router.get('/', this.chatRoomPage);
  }

  public chatRoomPage(req: Request, res: Response) {
    res.redirect('/pages/chat.html');
  }

  public authenticate(req: Request, res: Response, next: NextFunction) {
    // TODO
    next();
  }

  public async getAllUsers(req: Request, res: Response) {
    // TODO
  }

  public async getUser(req: Request, res: Response) {
    // TODO
  }

  public async postMessage(req: Request, res: Response) {
    // TODO
  }

  public async getAllMessages(req: Request, res: Response) {
    // TODO
  }
}
