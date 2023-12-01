import axios, { AxiosResponse } from 'axios';
import { IResponse } from '../common/server.responses';
import { IUser } from '../common/user.interface';

async function login(user: IUser) {
  // logs the user in
  try {
    const res: AxiosResponse = await axios.request(
      {
      method: 'post',
      headers: { Authorization: `Bearer ${token}` },
      data: user.credentials.password,
      url: '/auth/users/' + user.credentials.username,
      validateStatus: () => true
      }
    );
    if (res) {
      alert('Login successful, welcome to YACA ' + user.extra);
    };
  }
  catch(err) {
    alert('Login failed, error message: ' + err.message);
  }
}

async function register(newUser: IUser) {
  // register the user
  
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
