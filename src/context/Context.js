import { createContext } from 'react';
import { settings } from '../AppConfig';

export const AppConfigContext = createContext(settings);
export const SubOrgContext = createContext(settings);
export const ChatContext = createContext();
export const DrawerContext = createContext();