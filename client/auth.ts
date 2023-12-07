import axios, { AxiosResponse } from 'axios';
import { IAuthenticatedUser, IResponse } from '../common/server.responses';
import { IUser } from '../common/user.interface';
import {
  ISuccess,
  YacaError,
  UnknownError,
  isClientError,
  isISuccess,
  isUnknownError
} from '../common/server.responses';

async function login(user: IUser) {
  // logs the user in
  try {
    const res = await axios.request(
      {
      method: 'post',
      data: {password: user.credentials.password},
      url: ('/auth/users/'+ user.credentials.username),
      validateStatus: () => true
      }
    );
    console.log(res.data);
    if (res.status === 200) {
      const data: ISuccess = res.data;
      if (data) {
        alert('Login successful, welcome back!');
      }
      const payload = data?.payload as IAuthenticatedUser;
      const signedToken = payload.token;
      localStorage.setItem('token', signedToken);
      window.location.href = "chat.html";
      console.log("res data token:" + signedToken);
      console.log("test");
      localStorage.setItem('token', signedToken);
      window.location.href = "chat.html";
    }
    else if (res.status === 400) {
      const data: YacaError = res.data;
      alert('Registration failed, YACA Error: ' + data.message);
    }
    else {
      const data: UnknownError = res.data;
      alert('Registration failed, Unknown Error: ' + data.message);
    }
  }
  catch(err) {
    console.log("Unknown Error: " + err.message);
  }
}

async function register(newUser: IUser) {
  // register the user
  try {
    const res = await axios.request(
      {
      method: 'post',
      // headers: { Authorization: `Bearer ${token}` },
      data: newUser,
      url: '/auth/users',
      validateStatus: () => true
      }
    );
    if (res.status === 201 && res.data) {
      alert('Registration successful, welcome to YACA ' + newUser.extra);
      const data: ISuccess = res.data;
      const payload = data?.payload as IAuthenticatedUser;
      const signedToken = payload.token;
      localStorage.setItem('token', signedToken);
      window.location.href = "chat.html";
    }
    else if (res.status === 400) {
      const data: YacaError = res.data;
      alert('Registration failed, YACA Error: ' + data.message);
    }
    else if (res.status === 500){
      const data: UnknownError = res.data;
      alert('Registration failed, Unknown Error: ' + data.message);
    }
    else {
      alert('Registration failed, Unknown Error: ' + res);
    }
  }
  catch(err) {
    console.log("Unknown Error: " + err.message);
  }
}

async function onSubmitForm(e: SubmitEvent) {
  // form submission event handler
  e.preventDefault(); // prevent default form submission
  const whichButton: HTMLButtonElement = e.submitter as HTMLButtonElement;
  if (e.submitter) {
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    if (e.submitter.id === 'loginBtn') {
      // login button clicked
      const user: IUser = {
        credentials: {
          username: emailInput.value,
          password: passwordInput.value
        }
      };
      await login(user);
    } else if (e.submitter.id === 'registerBtn') {
      // register button clicked
      const newUser: IUser = {
        credentials: {
          username: emailInput.value,
          password: passwordInput.value
        },
        extra: nameInput.value
      };
      await register(newUser);
    } else {
      // 
    }
    nameInput.value = '';
    emailInput.value = '';
    passwordInput.value = '';
  }
}

document.addEventListener('DOMContentLoaded', async function (e: Event) {
  // document-ready event handler
  console.log('Page loaded successfully');
  const form = document.getElementById('authForm') as HTMLFormElement;
  if (form) {
    form.addEventListener('submit', onSubmitForm);
  }
});
