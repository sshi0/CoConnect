import { v4 as uuidV4 } from 'uuid';

export interface IFriend {
  id: string;
  displayName: string;
  email: string;
  invited: boolean;
}

let friends: IFriend[] = loadFriends();
loadFriendsIntoDocument();
const addFriendButton = document.getElementById('addFriendButton');
if (addFriendButton) addFriendButton.addEventListener('click', onAddFriend);

function loadFriends(): IFriend[] { 
  // read friends from local storage
  const friendList = localStorage.getItem('friends');
  let parsedFriends: IFriend[];
  if (friendList) {
    parsedFriends = JSON.parse(friendList);
  } else {
    parsedFriends = [
      {
        id: uuidV4(),
        displayName: 'John Doe',
        email: 'john.doe@somewhere.com',
        invited: false,
      },
      {
        id: uuidV4(),
        displayName: 'Sarah Smith',
        email: 'sarahs@blah.org',
        invited: false,
      }
    ]
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
  newFriend.setAttribute('id', friend.id);
  if (friend.invited) newFriend.setAttribute('invited', 'yes');
  else newFriend.setAttribute('invited', 'no');
  newFriend.innerHTML = `
    <div class="friendDets">
      <input type="checkbox" class="inviteCheck">
      Name: ${friend.displayName}
    </div>
    <button class="button crossButton" id="removeFriendButton">&times</button>
    <div class="friendDets">Email:${friend.email}</div>
  `;
  return newFriend;
}

function addBehaviorToFriendElement(friendEmnt: HTMLElement): HTMLElement {
  // add required listeners to the HTML friend element
  console.log(friendEmnt.id);
  let friend = friends.find(f => f.id === friendEmnt.id);
  const delButton: HTMLButtonElement | null = 
                   friendEmnt.querySelector('input[type="button"]');
  const invButton: HTMLInputElement | null = 
                   friendEmnt.querySelector('input[type="checkbox"]');
  if (invButton && friend)
    invButton.checked = friend.invited;
    invButton.addEventListener('change', () => {
      friend.invited = invButton.checked;
      if (friend.invited) {
        const subject = 'I am inviting you to join YACA to chat with us!';
        const mailtoLink = 
        `mailto:${friend.email}?subject=${encodeURIComponent(subject)}`;
        const newWindow: Window | null = window.open(
        mailtoLink, '_blank', 
        'toolbar=no,scrollbars=no,width=300px,height=400px');
        if (newWindow) { // Shift focus on the new window
          newWindow.focus();
          }
      }
    });
  console.log(delButton.id);
  if (delButton) {
    delButton.addEventListener('click', () => {
      const friendElement = document.getElementById(friendEmnt.id);
      if (friendElement) {
        alert('Are you sure you want to remove this friend?');
        onDeleteFriend(friendEmnt.id);
        saveFriends();
        loadFriendsIntoDocument();
      }
    });
  }
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

function onDeleteFriend(id: String): void {
  // event handler to remove an existing friend from local storage and the document
  console.log(id);
  friends = friends.filter((friend) => friend.id !== id);
}

function onInviteFriend(): void {
  // event handler to invite a friend by email when a checkbox is checked
}

// TODO

// Split into multiple submodules if appropriate