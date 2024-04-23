// import node module libraries
import React, { useEffect, useReducer } from 'react';

// import app config file
import { settings } from 'AppConfig';

// import context file
import { AppConfigContext } from 'context/Context';

// import reducer file
import { AppConfigReducer } from 'reducers/AppConfigReducer';

const AppProvider = ({ children }) => {
    
    const Theme = origin.split('.')[1]

    const initialSkin = localStorage.getItem('skin') || (Theme ? Theme : settings.theme.skin);

    const initialState = {
        version: settings.app.version,
        skin: initialSkin
    }
    localStorage.setItem('skin', (localStorage.getItem('skin')===null ? (Theme ? Theme : settings.theme.skin) : localStorage.getItem('skin'))); 
    const [appState, appStateDispatch] = useReducer(AppConfigReducer,initialState);

    useEffect(() => {
        // Apply the initial skin to the global HTML attribute
        document.querySelector('html').setAttribute('data-theme', initialSkin);
    }, []);

    return (
        <AppConfigContext.Provider value={{ appState, appStateDispatch }}>                    
            {children}
        </AppConfigContext.Provider>
    )
}

export default AppProvider