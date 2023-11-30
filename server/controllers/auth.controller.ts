// Controller serving the authentication page and handling user registration and login
// Note that controllers don't access the DB direcly, only through the models

import { ILogin, IUser } from '../../common/user.interface';
import { User } from '../models/user.model';
import Controller from './controller';
import { Request, Response, Router, NextFunction } from 'express';
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

export default class AuthController extends Controller {
  public constructor(path: string) {
    super(path);
    this.initializeRoutes();
  }

  public router: Router = Router();

  public initializeRoutes(): void {
    // this should define the routes handled by the middlewares authPage, register, and login
    this.router.get('/', this.authPage);
    this.router.post('/users', this.login);
    this.router.post('/users:username', this.register);
  }

  public async authPage(req: Request, res: Response) {
    res.redirect('/pages/auth.html');
  }

  public async register(req: Request, res: Response) {
    try {
      const { username, password, extra } = req.body;
      const newUser = new User({ username, password }, extra);

      const user = await newUser.join(); // checks if user already registered
      res.status(201).json({messages:"Successfully Registered"})); // join success, sends success response
    }
    catch (err: Error) {
      if (isClientError(err)) {
        res.status(400).json({messages:"User already exists"})); // user already exists, sends error response
      } else if (isUnknownError(err)) {
        res.status(500).json({messages:"Unknown Error"})); // unknown error, sends error response
      }
    }
  }

  public login(req: Request, res: Response) {
    // Middleware to log users in
    try {
      const credentials: ILogin = {
        username: req.url[1],
        password: req.body.password
      };
      const user = await User.validateUser(credentials);
      if (user) {
        const tokenPayload: ILogin = user.credentials;
        const token = jwt.sign(tokenPayload, secretKey, {expiresIn: tokenExpiry});
        const success: ISuccess = {
          name: 'LoginSuccess',
          message: 'User is authenticated',
          authorizedUser: user.credentials.username,
          payload: {user, token}
        };
      }
      res.status(200).json({messages:"Successfully Logged In"}); // login success, sends success response
    }
    catch (err: Error){
      if (isClientError(err)) {
        res.status(400).json({messages:"Invalid Credentials"}); // invalid credentials, sends error response
      }
      else if (isUnknownError(err)) {
        res.status(500).json({messages:"Unknown Error"}); // unknown error, sends error response
      }
    }
  }
}
