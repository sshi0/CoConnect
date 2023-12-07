import { IChatMessage } from '../common/chatMessage.interface';
// import { io, Socket } from 'socket.io-client';
import axios, { AxiosResponse } from 'axios';
import { IResponse } from '../common/server.responses';
import {
  ISuccess,
  YacaError,
  UnknownError,
  isClientError,
  isISuccess,
  isUnknownError
} from '../common/server.responses';
import { IUser } from '../common/user.interface';
// import {ServerToClientEvents, ClientToServerEvents} from '../common/socket.interface';
// const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

const token = localStorage.getItem('token');
const userCreds = localStorage.getItem('userCreds');

function onLogout(e: Event): void {
  e.preventDefault();
  // logout by deleting locally stored token and current user
  // decode token see who signed and compare with author of message so owner of author must be person posting the message
  localStorage.removeItem('token');
  // remove curr User
  window.location.href = "auth.html"
}

async function postChatMessage(chatMsg: IChatMessage): Promise<void> {
  // save chat message on the server
  try {
    const jwtToken = localStorage.getItem('token');
    const res: AxiosResponse = await axios.request({
      method: 'post',
      headers: { Authorization: `Bearer ${jwtToken}` }, // add the token to the header
      data: {message: chatMsg, credentials: userCreds},
      url: '/chat/messages',
      validateStatus: () => true // this allows axios to resolve the request and prevents axios from throwing an error
      });
      if (res.status === 400) {
        const data: YacaError = res.data;
        alert('Post message failed, YACA Error: ' + data.message);
      }
      else {
        const data: UnknownError = res.data;
        alert('Post message failed, Unknown Error: ' + data.message);
      }
  }
  catch (err) {
    console.log("Unknown Error: " + err.message);
  }
}

//
function onPost(e: Event): void {
  // post button event handler
}

function makeChatMessage(
  author: string,
  timestamp: string,
  text: string
): HTMLElement {
  // TODO: create an HTML element that contains a chat message
  return document.createElement('div');
}

function onNewChatMessage(chatMsg: IChatMessage): void {
  // TODO: eventhandler for websocket incoming new-chat-message
  // used to update message list
}

async function getChatMessages(): Promise<void> {
  // get all chat messages from the server
  try {
    const jwtToken = localStorage.getItem('token');
    const res: AxiosResponse = await axios.request({
      method: 'post',
      headers: { Authorization: `Bearer ${jwtToken}` }, // add the token to the header
      data: {message: chatMsg, credentials: userCreds},
      url: '/chat/messages',
      validateStatus: () => true // this allows axios to resolve the request and prevents axios from throwing an error
      });
      if (res.status === 400) {
        const data: YacaError = res.data;
        alert('Post message failed, YACA Error: ' + data.message);
      }
      else {
        const data: UnknownError = res.data;
        alert('Post message failed, Unknown Error: ' + data.message);
      }
  }
  catch (err) {
    console.log("Unknown Error: " + err.message);
  }
}

async function isLoggedIn(): Promise<boolean> {
  // TODO: determine whether the user is logged in
  return true;
}

document.addEventListener('DOMContentLoaded', async function (e: Event) {
  // Document-ready event handler
  e.preventDefault();
  const logoutButton = document.getElementById('logoutBtn');
  logoutButton?.addEventListener('click', onLogout);
});
