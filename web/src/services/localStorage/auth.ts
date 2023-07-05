const keyAccessToken = 'accessToken' 

const setAccessToken = (value: string) => {
    localStorage.setItem(keyAccessToken, value)
}

const getAccessToken = (): string | null => {
    return localStorage.getItem(keyAccessToken)
}

const removeAccessToken = (): void => {
    localStorage.removeItem(keyAccessToken)
}


export const AuthLocalStorage = {
    setAccessToken,
    getAccessToken,
    removeAccessToken
}