import { v4 as uuidV4 } from 'uuid';
import { IFriend } from '../common/friend.interface';
import axios, { AxiosResponse } from 'axios';
import { IResponse } from '../common/server.responses';
import { ILogin, IUser } from '../common/user.interface';
import {
  ISuccess,
  YacaError,
  UnknownError,
  isClientError,
  isISuccess,
  isUnknownError
} from '../common/server.responses';

function onInviteFriend(friend: IFriend): void {
  // event handler to invite a friend by email when a checkbox is checked
  const subject = 'I am inviting you to join YACA to chat with us!';
  const mailtoLink = 
  `mailto:${friend.email}?subject=${encodeURIComponent(subject)}`;
  const newWindow: Window | null = window.open(
  mailtoLink, '_blank', 
  'toolbar=no,scrollbars=no,popup=yes,width=300px,height=400px');
  if (newWindow) { // Shift focus on the new window
    newWindow.focus();
  }
}

function createRawFriendElement(friend: IFriend): HTMLElement {
  // create an HTML friend element without any listeners attached
  const newFriend = document.createElement('div');
  newFriend.setAttribute('class', 'friend');
  newFriend.setAttribute('id', friend.email as string);
  newFriend.innerHTML = `
    <div class="friendDets">
      Name: ${friend.displayName}
    </div>
    <button class="crossButton" id="removeFriendButton">&times</button>
    <div class="friendDets">Email:${friend.email}</div>
  `;
  return newFriend;
}

function appendFriendElementToDocument(friendEmnt: HTMLElement): void {
  // add HTML friend element with listeners 
  // to the right HTML elememnt in the document
  const friendListContainer = document.getElementById('friendListContainer'); 
  if (friendListContainer) {
    friendListContainer.appendChild(friendEmnt);
  }
}

async function onDeleteFriend(id: string): Promise<void> {
  // event handler to remove an existing friend from ldatabase
  try {
    const jwtToken = localStorage.getItem('token');
    const res: AxiosResponse = await axios.request({
      method: 'patch',
      headers: { Authorization: `Bearer ${jwtToken}` }, // add the token to the header
      url: ('/friends/' + id),
      validateStatus: () => true // this allows axios to resolve the request and prevents axios from throwing an error
      });
      if (res.status === 201) {
        const data: ISuccess = res.data;
        const payload = data?.payload as IUser;
        const user = payload as IUser;
        const friends = user.friends as IFriend[];
        const friendNames = friends.map((friend) => friend.displayName);
        localStorage.setItem('friendNames', JSON.stringify(friendNames));
      }
      else if (res.status === 400) {
        const data: YacaError = res.data;
        alert('Delete friends failed, YACA Error: ' + data.message);
      }
      else {
        const data: UnknownError = res.data;
        alert('Delete friends failed, Unknown Error: ' + data.message);
      }
  }
  catch (err) {
    console.log("Unknown Error: " + err.message);
  }
}

function addBehaviorToFriendElement(friendEmnt: HTMLElement): HTMLElement {
  // add required listeners to the HTML friend element
  const delButton: HTMLButtonElement | null = 
                   friendEmnt.querySelector('button');
  if (delButton) {
    delButton.addEventListener('click', () => {
      const friendElement = document.getElementById(friendEmnt.id);
      if (friendElement) {
        const delConfirm = confirm('Are you sure you want to remove this friend?')
        if (delConfirm) {
          onDeleteFriend(friendEmnt.id);
          friendElement.remove();
        }
        else {
          return friendEmnt;
        }
      }
    });
  }
  return friendEmnt;
}

async function loadFriendsIntoDocument(): Promise<void> {
  // read friends from database and add them to the document
  try {
    const jwtToken = localStorage.getItem('token');
    const userCreds = JSON.parse(localStorage.getItem('userCreds') as string);
    const res: AxiosResponse = await axios.request({
      method: 'get',
      headers: { Authorization: `Bearer ${jwtToken}` }, // add the token to the header
      url: ('/friends/' + userCreds.username),
      validateStatus: () => true // this allows axios to resolve the request and prevents axios from throwing an error
      });
      if (res.status === 201) {
        const data: ISuccess = res.data;
        const payload = data?.payload as IFriend[];
        const friends = payload;
        const friendNames = friends.map((friend) => friend.displayName);
        localStorage.setItem('friendNames', JSON.stringify(friendNames));
        const friendListContainer = document.getElementById('friendListContainer');
        if (friendListContainer) {
          friendListContainer.innerHTML = '';
          friends.forEach((friend) => {
            const friendElmnt = createRawFriendElement(friend);
            const friendWithBehavior = addBehaviorToFriendElement(friendElmnt);
            appendFriendElementToDocument(friendWithBehavior);
          });
        }
      }
      else if (res.status === 400) {
        const data: YacaError = res.data;
        alert('Load friends failed, YACA Error: ' + data.message);
      }
      else {
        const data: UnknownError = res.data;
        alert('Load friends failed, Unknown Error: ' + data.message);
      }
  }
  catch (err) {
    console.log("Unknown Error: " + err.message);
  }
}

async function onAddFriend(): Promise<void> {
  // event handler to create a new friend from form info and 
  // save it to database and 
  // append it to right HTML element in the document
  const displayNameInput = 
        <HTMLInputElement>document.getElementById('nameInput');
  const emailInput = 
        <HTMLInputElement>document.getElementById('emailInput');
  const displayName = displayNameInput.value;
  const email = emailInput.value;
  const newFriend: IFriend = {
    id: uuidV4(),
    displayName: displayName,
    email: email,
  }

  try {
    const jwtToken = localStorage.getItem('token');
    const userCreds = JSON.parse(localStorage.getItem('userCreds') as string);
    const res: AxiosResponse = await axios.request({
      method: 'post',
      headers: { Authorization: `Bearer ${jwtToken}` }, // add the token to the header
      data: newFriend,
      url: ('/friends/' + userCreds.username),
      validateStatus: () => true // this allows axios to resolve the request and prevents axios from throwing an error
      });
    if (res.status === 201) {
      const data: ISuccess = res.data;
      const user = data?.payload as IUser;
      const friends = user.friends as IFriend[];
      const friendNames = friends.map((friend) => friend.displayName);
      localStorage.setItem('friendNames', JSON.stringify(friendNames));
      
      const friendListContainer = document.getElementById('friendListContainer');
      if (friendListContainer) {
        const friendElmnt = createRawFriendElement(newFriend);
        const friendWithBehavior = addBehaviorToFriendElement(friendElmnt);
        appendFriendElementToDocument(friendWithBehavior);
      }
      if (data.name === 'FriendNeedsInvite'){
        const inviteConfirm = confirm('This friend has not registered yet. Do you want to invite them?');
        if (inviteConfirm) {
          onInviteFriend(newFriend);
        }
      }
    }
    else if (res.status === 400 || res.status === 401) {
      const data: YacaError = res.data;
      alert('Add Friends failed, ' + data.name + ": " + data.message);
    }
    else {
      const data: UnknownError = res.data;
      alert('Add Friends failed, Unknown Error: ' + data.message);
    }
  }
  catch (err) {
    alert("Unknown Error: " + err.message);
  }
  displayNameInput.value = '';
  emailInput.value = '';
}

async function onClearFriends(): Promise<void> {
  // event handler to clear all friends from database and document
  const clearConfirm = confirm('Are you sure you want to clear all friends? This action is irreversible.');
  if (clearConfirm) {
    try {
      const jwtToken = localStorage.getItem('token');
      const res: AxiosResponse = await axios.request({
        method: 'patch',
        headers: { Authorization: `Bearer ${jwtToken}` }, // add the token to the header
        url: '/friends',
        validateStatus: () => true // this allows axios to resolve the request and prevents axios from throwing an error
        });
      if (res.status === 201) {
        const data: ISuccess = res.data;
        const user = data?.payload as IUser;
        const friends = user.friends as IFriend[];
        const friendNames = friends.map((friend) => friend.displayName);
        localStorage.setItem('friendNames', JSON.stringify(friendNames));
        loadFriendsIntoDocument();
      }
      else if (res.status === 400 || res.status === 401) {
        const data: YacaError = res.data;
        alert('Clear Friends failed, ' + data.name + ": " + data.message);
      }
      else {
        const data: UnknownError = res.data;
        alert('Clear Friends failed, Unknown Error: ' + data.message);
      }
    }
    catch (err) {
      console.log("Unknown Error: " + err.message);
    }

  }
}

async function isLoggedIn(): Promise<boolean> {
  // determine whether the user is logged in
  const jwtToken = localStorage.getItem('token');
  const userCreds = localStorage.getItem('userCreds');
  if (jwtToken && userCreds) {
    return true;
  }
  return false;
}

const isUserLoggedIn = await isLoggedIn();
if (!isUserLoggedIn) {
  alert("You are not logged in, redirecting to authentication page");
  window.location.href = "auth.html";
}
else {
  loadFriendsIntoDocument();
  const addFriendForm = document.getElementById('addFriendButton');
  if (addFriendForm) addFriendForm.addEventListener('click', onAddFriend);
  const clearfriendsButton = document.getElementById('clearfriendsButton');
  if (clearfriendsButton) clearfriendsButton.addEventListener('click', onClearFriends);
}
