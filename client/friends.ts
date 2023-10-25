import { v4 as uuidV4 } from 'uuid';

export interface Friend {
  id: string;
  displayName: string;
  email: string;
  invited: boolean;
}

let friends: Friend[];

function loadFriends(): Friend[] {
  // TODO: read friends from local storage
  return [];
}

function saveFriends(): void {
  // TODO: save friends to local storage
}

function createRawFriendElement(friend: Friend): HTMLElement {
  // TODO: create an HTML friend element without any listeners attached
  return new HTMLElement();
}

function addBehaviorToFriendElement(friendEmnt: HTMLElement): HTMLElement {
  // TODO: add required listeners to the  HTML friend element
  return new HTMLElement();
}

function appendFriendElementToDocument(friendEmnt: HTMLElement): void {
  // TODO: add HTML friend element with listeners to the right HTML elememnt in the document
}

function loadFriendsIntoDocument(): void {
  // TODO: read friends from local storage and add them to the document
}

function onAddFriend(): void {
  // TODO: event handler to create a new friend from form info and append it to right HTML element in the document
}

function onDeleteFriend(): void {
  // TODO: event handler to remove an existing friend from local storage and the document
}

function onInviteFriend(): void {
  // TODO: event handler to invite a friend by email when a checkbox is checked
}

// TODO

// Split into multiple submodules if appropriate
