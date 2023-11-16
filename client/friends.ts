import { v4 as uuidV4 } from 'uuid';

export interface IFriend {
  id: string;
  displayName: string;
  email: string;
  invited: boolean;
}

let friends: IFriend[] = loadFriends();
const addFriendButton = document.getElementById('addFriendButton');
if (addFriendButton) addFriendButton.addEventListener('click', onAddFriend);

function loadFriends(): IFriend[] { 
  // read friends from local storage
  const friendList = localStorage.getItem('friends');
  let parsedFriends: IFriend[];
  if (friendList) {
    parsedFriends = JSON.parse(friendList);
  } else {
    parsedFriends = []
  }
  return parsedFriends;
}

function saveFriends(): void { 
  // save friends to local storage
  localStorage.setItem('friends', JSON.stringify(friends));
}

function createRawFriendElement(friend: IFriend): HTMLElement {
  // create an HTML friend element without any listeners attached
  const newFriend = document.createElement('div');
  newFriend.setAttribute('class', 'friend');
  newFriend.innerHTML = `
    <div class="friendDets">Name: ${friend.displayName}</div>
    <div class="friendDets">Email:${friend.email}</div>
  `;
  return newFriend;
}

function addBehaviorToFriendElement(friendEmnt: HTMLElement): HTMLElement {
  // add required listeners to the HTML friend element
  return friendEmnt;
}

function appendFriendElementToDocument(friendEmnt: HTMLElement): void {
  // add HTML friend element with listeners 
  // to the right HTML elememnt in the document
  const friendListContainer = document.getElementById('friendListContainer'); 
  if (friendListContainer) {
    friendListContainer.appendChild(friendEmnt);
  }
}

function loadFriendsIntoDocument(): void {
  // read friends from local storage and add them to the document
  loadFriends();
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

function onAddFriend(): void {
  // event handler to create a new friend from form info and 
  // append it to right HTML element in the document
  const displayNameInput = 
        <HTMLInputElement>document.getElementById('nameInput');
  const emailInput = 
        <HTMLInputElement>document.getElementById('emailInput');
  if (displayNameInput && emailInput) {
    const displayName = displayNameInput.value;
    const email = emailInput.value;
    const newFriend: IFriend = {
      id: uuidV4(),
      displayName: displayName,
      email: email,
      invited: false,
    };
    friends.push(newFriend);
    saveFriends();
    loadFriendsIntoDocument();

    // Reset the form after adding a friend
    displayNameInput.value = '';
    emailInput.value = '';
  }
}

function onDeleteFriend(): void {
  // TODO: event handler to remove an existing friend from local storage and the document
}

function onInviteFriend(): void {
  // TODO: event handler to invite a friend by email when a checkbox is checked
}

// TODO

// Split into multiple submodules if appropriate
