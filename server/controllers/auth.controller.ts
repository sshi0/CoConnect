// Controller serving the athentication page and handling user registration and login
// Note that controllers don't access the DB direcly, only through the models

import { ILogin, IUser } from '../../common/user.interface';
import { User } from '../models/user.model';
import Controller from './controller';
import { Request, Response } from 'express';
// import jwt from 'jsonwebtoken';
import {
  ISuccess,
  YacaError,
  UnknownError,
  isClientError,
  isISuccess,
  isUnknownError
} from '../../common/server.responses';

export default class AuthController extends Controller {
  public constructor(path: string) {
    super(path);
  }

  public initializeRoutes(): void {
    // this should define the routes handled by the middlewares authPage, register, and login
    // TODO
  }

  public async authPage(req: Request, res: Response) {
    // res.redirect('/pages/auth.html');
  }

  public async register(req: Request, res: Response) {
    // TODO
  }

  public login(req: Request, res: Response) {
    // TODO
  }
}
