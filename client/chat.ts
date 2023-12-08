import { IChatMessage } from '../common/chatMessage.interface';
import { io, Socket } from 'socket.io-client';
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
import { ILogin, IUser } from '../common/user.interface';
import { get } from 'jquery';
import {ServerToClientEvents, ClientToServerEvents} from '../common/socket.interface';
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

const token = localStorage.getItem('token');
const userCreds = localStorage.getItem('userCreds');
socket.on('newChatMessage', onNewChatMessage);

function onLogout(e: Event): void {
  e.preventDefault();
  // logout by deleting locally stored token and current user
  // decode token see who signed and compare with author of message so owner of author must be person posting the message
  localStorage.removeItem('token');
  localStorage.removeItem('userCreds');
  window.location.href = "auth.html"
}

async function postChatMessage(chatMsg: IChatMessage): Promise<void> {
  // save chat message on the server
  try {
    const jwtToken = localStorage.getItem('token');
    const res: AxiosResponse = await axios.request({
      method: 'post',
      headers: { Authorization: `Bearer ${jwtToken}` }, // add the token to the header
      data: chatMsg,
      url: '/chat/messages',
      validateStatus: () => true // this allows axios to resolve the request and prevents axios from throwing an error
      });
    console.log(res.data + " " + res.status);
    if (res.status === 201) {
      const data: ISuccess = res.data;
      const payload = data?.payload as IChatMessage;
      const chatContainer = document.getElementById('chatContainer');
      const msgElement = makeChatMessage(payload.author, payload.timestamp as string, payload.text);
      chatContainer?.appendChild(msgElement);
    }
    else if (res.status === 400) {
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
async function onPost(e: Event) {
  // post button event handler
  e.preventDefault();
  const msgInput = document.getElementById('messageBox') as HTMLInputElement;
  const userCreds = localStorage.getItem('userCreds');
  const parsedUserCreds: ILogin = JSON.parse(userCreds as string);
  const newChatMessage: IChatMessage = {author: parsedUserCreds.username, text: msgInput.value};
  await postChatMessage(newChatMessage);
  msgInput.value = '';
}

function makeChatMessage(
  author: string,
  timestamp: string,
  text: string
): HTMLElement {
  // create an HTML element that contains a chat message
  const msgElement = document.createElement('div');
  const userCreds = localStorage.getItem('userCreds');
  const parsedUserCreds: ILogin = JSON.parse(userCreds as string);
  if (author === parsedUserCreds.username) {
    msgElement.setAttribute('class', 'message user');
  }
  else {
    msgElement.setAttribute('class', 'message bot');
  }
  msgElement.innerHTML = `
  <div class="messagerDetails">
      <div class="avatar">${author}</div>
      <div class="timeStamp">${timestamp}</div> 
    </div>
  <div class="bubble">${text}</div>
  `;
  return msgElement;
}

function onNewChatMessage(chatMsg: IChatMessage): void {
  // eventhandler for websocket incoming new-chat-message
  const userCreds = localStorage.getItem('userCreds');
  const parsedUserCreds: ILogin = JSON.parse(userCreds as string);
  if (chatMsg.author !== parsedUserCreds.username) {
  const chatContainer = document.getElementById('chatContainer');
  const msgElement = makeChatMessage(chatMsg.author, chatMsg.timestamp as string, chatMsg.text);
  chatContainer?.appendChild(msgElement);
  }
}

async function getChatMessages(): Promise<void> {
  // get all chat messages from the server
  try {
    const jwtToken = localStorage.getItem('token');
    const res: AxiosResponse = await axios.request({
      method: 'get',
      headers: { Authorization: `Bearer ${jwtToken}` }, // add the token to the header
      url: '/chat/messages',
      validateStatus: () => true // this allows axios to resolve the request and prevents axios from throwing an error
      });
      if (res.status === 201) {
        const data: ISuccess = res.data;
        console.log("Get all messages success" + data);
        const payload = data?.payload as IChatMessage[];
        let chatMessages = payload;
        const chatContainer = document.getElementById('chatContainer');
        chatMessages.forEach((message) => {
          const msgElement = makeChatMessage(message.author, message.timestamp as string, message.text);
          chatContainer?.appendChild(msgElement);
        })
      }
      else if (res.status === 400) {
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
  // determine whether the user is logged in
  return true;
}

document.addEventListener('DOMContentLoaded', async function (e: Event) {
  // Document-ready event handler
  e.preventDefault();
  const logoutButton = document.getElementById('logOutBtn');
  logoutButton?.addEventListener('click', onLogout);
  const postButton = document.getElementById('postBtn');
  postButton?.addEventListener('click', onPost);
});

getChatMessages();