import { useAuth0 } from "@auth0/auth0-react";
import { Loading } from "./Loading";

export const Logout = () => {

    const { logout } = useAuth0()

    localStorage.removeItem('subOrg');
    localStorage.removeItem('userData');
    localStorage.removeItem('freeTrialFormSubmitted');
    
    if(window.Android && typeof window.Android.logout == 'function'){
        window.Android.logout();
        // logout();
    }

    if (window.webkit && typeof window.webkit.messageHandlers.logout.postMessage === 'function') {
        window.webkit.messageHandlers.logout.postMessage("Logging out");
    
        // Perform the JavaScript action
        // logout();
    }    

    logout({logoutParams: {
        returnTo: location.origin.includes('demo') ?
                    location.origin.replace('demo', 'marketing')
                    : location.origin.includes('localhost') ?
                        'http://localhost:3000'
                        : location.origin.includes('edutalim') ?
                            location.origin.replace('dashboard', 'www')
                            : location.origin.replace('dashboard', 'www')
    }})

    return(
        <Loading/>
    )
}