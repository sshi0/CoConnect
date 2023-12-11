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
    this.router.post('/users', this.register);
    this.router.post('/users/:username', this.login);
  }

  public async authPage(req: Request, res: Response) {
    res.redirect('/pages/auth.html');
  }

  public async register(req: Request, res: Response) {
    try {
      console.log("Req: " + req);
      const username = req.body.credentials.username;
      const password = req.body.credentials.password;
      const newUser = new User( { username, password });
      newUser.extra = req.body.extra;
      
      const user = await newUser.join(); // checks if user already registered
      if (user) {
        const tokenPayload: ILogin = user.credentials;
        console.log("Token Expiry: " + tokenExpiry);
        const getToken = () => {
          if (tokenExpiry === 'never') {
            return jwt.sign(tokenPayload, secretKey); // just omit expiresIn to specify never
          } 
          else {
            return jwt.sign(tokenPayload, secretKey, {expiresIn: tokenExpiry});
          }
        };
        const token = getToken();
        console.log("Token: " + token);
        
        const successRes: ISuccess = {
          name: 'RegistrationSuccess',
          message: 'User has registered',
          authorizedUser: user.credentials.username,
          payload: {user, token}
        };
        res.status(201).json(successRes); // join success, sends success response
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

  public async login(req: Request, res: Response) {
    // Middleware to log users in
    try {
      const credentials: ILogin = {
        username: req.params.username,
        password: req.body.password
      };
      console.log('credentials: ' + credentials.username + ' ' + credentials.password);
      const newUser = new User(credentials);
      const user = await newUser.login();
      if (user) {
        const tokenPayload: ILogin = user.credentials;
        const getToken = () => {
          if (tokenExpiry === 'never') {
            return jwt.sign(tokenPayload, secretKey); // just omit expiresIn to specify never
          } 
          else {
            return jwt.sign(tokenPayload, secretKey, {expiresIn: tokenExpiry});
          }
        };
        const token = getToken();
        console.log("Token: " + token);
        const successRes: ISuccess = {
          name: 'LoginSuccess',
          message: 'User is authenticated',
          authorizedUser: user.credentials.username,
          payload: {user, token}
        };
        res.status(200).json(successRes); // login success, sends success response
      }
    }
    catch (err){
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
