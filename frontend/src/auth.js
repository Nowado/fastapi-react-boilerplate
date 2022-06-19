// util to signin with jwt via localstorage

function signInToken(token, expiresIn) {
    localStorage.setItem('_authmain', JSON.stringify({
        token,
    }));
    const now = new Date().getTime();
    localStorage.setItem('_authmain_expiresIn', JSON.stringify(now + expiresIn * 1000));
    return true;
}

function signOut() {
    localStorage.removeItem('_authmain');
    localStorage.removeItem('_authmain_expiresIn');
    return true;
}

function isAuthenticated() {
    const token = localStorage.getItem('_authmain');
    if (token) {
        const expiresIn = localStorage.getItem('_authmain_expiresIn');
        const now = new Date().getTime();
        if (now < expiresIn) {
            return true;
        }
    }
}

export { signInToken, signOut, isAuthenticated };