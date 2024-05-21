import {createContext} from 'react';

//credintials context
export const CredentialsContext = createContext({storedCredentials: {}, setStoredCredentials: () =>{}});