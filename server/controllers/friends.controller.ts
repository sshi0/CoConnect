// Controller serving the friends page and handling friend management

import Controller from './controller';
import { NextFunction, Request, Response, Router } from 'express';
import { ILogin, IUser } from '../../common/user.interface';
import { User } from '../models/user.model';
import { IFriend } from '../../common/friend.interface';
import jwt from 'jsonwebtoken';
import { JWT_KEY as secretKey, JWT_EXP as tokenExpiry } from '../env';
import {
  ISuccess,
  ClientError,
  UnknownError,
  isClientError,
  isISuccess,
  isUnknownError
} from '../../common/server.responses';

export default class FriendsController extends Controller {
  public constructor(path: string) {
    super(path);
    this.initializeRoutes();
  }

  public router: Router = Router();

  public initializeRoutes(): void {
    // this should define the route handled by the middleware friendsPage
    this.router.get('/', this.friendsPage);
    this.router.get('/:username', this.authenticate, this.getFriends)
    this.router.post('/:username', this.authenticate, this.addFriend);
    this.router.patch('/:friendUsername', this.authenticate, this.deleteFriend);
    this.router.patch('/', this.authenticate, this.clearFriends);
  }

  public friendsPage(req: Request, res: Response) {
    res.redirect('/pages/friends.html');
  }

  public authenticate(req: Request, res: Response, next: NextFunction) {
    // authenticate the user(validate if token is valid)
    const token = req.headers.authorization?.split(' ')[1]; //extracts token from header

    if (token) {
      try {
        const decodedToken = jwt.verify(token, secretKey) as ILogin;
        res.locals.authorizedUser = decodedToken.username;
        next();
      }
      catch (err) {
        console.log("Caught error in token")
        console.log(err);
        const jwtError = new ClientError('AuthenticationError', 'Token is invalid');
        res.status(401).json(jwtError); 
      }
    }
    else {
      const err = new ClientError('AuthenticationError', 'Missing authentication token');
      res.status(401).json({name: err.name, message:err.message}); // user already exists, sends error response
    }
  }

  public async getFriends(req: Request, res: Response) {
    // get the user's friend list
    const username = res.locals.authorizedUser;

    try {
      const user = await User.getUserForUsername(username);
      console.log("Get friends: " + user);
      if (user) {
        const successRes: ISuccess = {
          name: 'FriendsRetrieved',
          message: 'Friends have been retrieved',
          authorizedUser: res.locals.authorizedUser,
          payload: user.friends as IFriend[]
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

  public async addFriend(req: Request, res: Response) {
    // add a friend to the user's friend list
    const friend = req.body as IFriend;
    const username = res.locals.authorizedUser;
    try {
      const user = await User.addNewFriend(username, friend);
      const userFriend = await User.getUserForUsername(friend.email);
      if (user) {
        if (userFriend) {
          const successRes: ISuccess = {
            name: 'FriendAdded',
            message: 'Friend has been added',
            authorizedUser: res.locals.authorizedUser,
            payload: user
          };
          res.status(201).json(successRes); 
        }
        else {
          const successRes: ISuccess = {
            name: 'FriendNeedsInvite',
            message: 'Friend has been added but has not registered yet',
            authorizedUser: res.locals.authorizedUser,
            payload: user
          };
          res.status(201).json(successRes); 
        }
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

  public async deleteFriend(req: Request, res: Response) {
    // delete a friend from the user's friend list
    const username = res.locals.authorizedUser;
    const user = await User.getUserForUsername(username) as IUser;
    const friendEmail = req.params.friendUsername;
    const friend = user.friends?.find((f) => f.email === friendEmail);

    try {
      if (!friend) {
        throw new ClientError('FriendNotFound', 'Unable to delete non-existent friend');
      }
      const updatedUser = await User.deleteFriend(username, friend);
      if (updatedUser) {
        const successRes: ISuccess = {
          name: 'FriendDeleted',
          message: 'Friend has been deleted',
          authorizedUser: res.locals.authorizedUser,
          payload: user
        };
        res.status(201).json(successRes); 
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

  public async clearFriends(req: Request, res: Response) {
    // clear the user's friend list
    const username = res.locals.authorizedUser;
    try {
      const user = await User.clearFriends(username);
      if (user) {
        const successRes: ISuccess = {
          name: 'FriendsCleared',
          message: 'Friends have been cleared',
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
}
