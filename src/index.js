import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PublicClientApplication, EventType } from '@azure/msal-browser';
import { msalConfig } from './authConfig';
import { loginRequest } from './authConfig';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css';

/**
 * MSAL should be instantiated outside of the component tree to prevent it from being re-instantiated on re-renders.
 * For more, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
const msalInstance = new PublicClientApplication(msalConfig);

function loginRedirect() {
    msalInstance
        .loginRedirect({
            ...loginRequest,
            prompt: 'create',
        })
        .catch((error) => console.log(error));
  }

// Default to using the first account if no account is active on page load
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
    // Account selection logic is app dependent. Adjust as needed for different use cases.
    msalInstance.setActiveAccount(msalInstance.getActiveAccount()[0]);
}

// Listen for sign-in event and set active account
msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
        const account = event.payload.account;
        msalInstance.setActiveAccount(account);
    } else if (event.eventType === EventType.LOGIN_FAILURE) {
        console.log(event);
        loginRedirect();
    }
});

msalInstance
  .handleRedirectPromise()
  .then(() => {
    if (window.location.pathname.startsWith('/sso_login')) {
      const account = msalInstance.getActiveAccount();
      if (!account) {
        loginRedirect();
      } else {
        window.location.href = '/';
      }
    }
  })
  .catch((err) => {
    console.log(err);
  });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App instance={msalInstance}/>
);