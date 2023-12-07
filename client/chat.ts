import { IChatMessage } from '../common/chatMessage.interface';
// import { io, Socket } from 'socket.io-client';
import axios, { AxiosResponse } from 'axios';
import { IResponse } from '../common/server.responses';
import { IUser } from '../common/user.interface';
// import {ServerToClientEvents, ClientToServerEvents} from '../common/socket.interface';
// const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

const token = localStorage.getItem('token');

function onLogout(e: Event): void {
  e.preventDefault();
  // logout by deleting locally stored token and current user
  // decode token see who signed and compare with author of message so owner of author must be person posting the message
  localStorage.removeItem('token');
  // remove curr User
  window.location.href = "auth.html"
}

async function postChatMessage(chatMsg: IChatMessage): Promise<void> {
  // TODO: save chat message on the server
}

//
function onPost(e: Event): void {
  // TODO: post button event handler
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
  // TODO: get all chat messages from the server
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
