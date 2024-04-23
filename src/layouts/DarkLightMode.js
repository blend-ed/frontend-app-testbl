// import node module libraries
import { gql, useMutation, useQuery } from '@apollo/client';
import { useContext, useEffect, useState } from 'react';

// import context file
import { AppConfigContext } from '../context/Context';

// import media file
import { useAuth0 } from '@auth0/auth0-react';
import { ReactComponent as Moon } from '../assets/images/svg/moon.svg';
import { ReactComponent as Sun } from '../assets/images/svg/sun.svg';

const GET_THEME = gql`
    query getTheme($user_id: uuid = "", $domain: String = "") {
        user_details(where: {user_id: {_eq: $user_id}, organisation: {domain: {_eq: $domain}}}) {
            theme
        }
    }
`

const CHANGE_THEME = gql`
    mutation MyMutation($user_id: uuid = "", $domain: String = "", $new_theme: String = "") {
        update_user_details(where: {user_id: {_eq: $user_id}, organisation: {domain: {_eq: $domain}}}, _set: {theme: $new_theme}) {
            affected_rows
        }
    }
`

const DarkLightMode = () => {

    const { user } = useAuth0()
    const org = window.location.origin.split('.')[1]
    const [changeTheme] = useMutation(CHANGE_THEME)
    const ConfigContext = useContext(AppConfigContext);
    const [Theme, setTheme] = useState(skinThemeCalc(ConfigContext.appState.skin));
    const [skin, setSkin] = useState(null);

    const { data: themeData } = useQuery(GET_THEME, {
        variables: {
            user_id: user?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
            domain: window.location.origin
        }
    })

    useEffect(() => {
        console.log('theme data in hasura', themeData?.user_details[0]?.theme);
        setTheme(themeData?.user_details[0]?.theme)
    }, [themeData])

    function skinThemeCalc(skin) {
        if (skin === 'dark') {
            return 'dark'
        } else {
            return 'light'
        }
    }

    function themeSkinCalc(theme) {
        if (theme !== 'dark') {
            if (org === 'blend-ed' || org === 'localhost' || org === undefined) {
                return 'light'
            } else {
                return org
            }
        }
        return theme
    }

    const themeChangeToggle = () => {
        if (Theme === 'light') {
            setTheme('dark')
        } else {
            setTheme('light')
        }
    }

    // calculate the skin of the application when theme changes
    useEffect(() => {
        if (Theme) {
            setSkin(themeSkinCalc(Theme));
        }
    }, [Theme])

    // change the skin of the application when skin changes
    useEffect(() => {

        // save this in the context
        ConfigContext.appStateDispatch({
            type: 'CHANGE_SKIN',
            payload: {
                skin: skin
            }
        })

        //update in localstorage
        localStorage.setItem('skin', skin);
        document.querySelector('html').setAttribute('data-theme', localStorage.getItem('skin'));

        // update in hasura
        changeTheme({
            variables: {
                user_id: user?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
                domain: window.location.origin,
                new_theme: Theme
            }
        })
    }, [skin])

    return (
        <div className='dark_mode'>
            <input
                className='dark_mode_input'
                type='checkbox'
                id='darkmode-toggle'
                checked={Theme === 'dark'}
                onChange={themeChangeToggle}
            />
            <label className='dark_mode_label' for='darkmode-toggle'>
                <Sun />
                <Moon />
            </label>
        </div>
    )
}

export default DarkLightMode