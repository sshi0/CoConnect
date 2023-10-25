import axios, { AxiosResponse } from 'axios';
import { IResponse } from '../common/server.responses';
import { IUser } from '../common/user.interface';

async function login() {
  // TODO: authenticate the user
}

async function register() {
  // TODO: register the user
}

async function onSubmitForm(e: SubmitEvent) {
  // form submission event handler
  e.preventDefault(); // prevent default form submission
  const whichButton: HTMLButtonElement = e.submitter as HTMLButtonElement;
  if (false) {
    // login button clicked
    // TODO
  } else if (false) {
    // submit button clicked
    // TODO
  } else {
    // TODO
  }
}

document.addEventListener('DOMContentLoaded', async function (e: Event) {
  // document-ready event handler
  console.log('Page loaded successfully');
  // TODO: anything else?
});
