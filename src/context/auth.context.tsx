import axios from 'axios'
import {createContext, PropsWithChildren, useCallback, useContext, useEffect, useState} from 'react'
import {loginHandler} from "../handlers/auth/login.handler"
import {User} from '../types/user'
import {meHandler} from "../handlers/auth/me.handler";
import {logoutHandler} from "../handlers/auth/logout.handler";
import {useRouter} from "next/router";

type AuthLoginParams = {
    email: string
    password: string
}

interface AuthContext {
    loggedIn: boolean
    login: (credentials: AuthLoginParams, onSuccess?: () => void, onError?: (err: any) => void) => void
    logout: (onLogout?: () => void) => void
    user?: User
    setUser: (user: User | undefined) => void
    setLoggedIn: (status: boolean) => void
    isInitialized: boolean
}

const authContext = createContext<AuthContext>({
    loggedIn: false,
    isInitialized: false,
    login: () => null,
    logout: () => null,
    setUser: () => null,
    setLoggedIn: () => null,
})

export function ProvideAuth({children}: PropsWithChildren) {
    const auth = useProvideAuth()
    const router = useRouter()
    const loggedIn = auth.loggedIn;
    const isInitialized = auth.isInitialized;
    const logout = auth.logout;
    const user = auth.user;

    useEffect(() => {
        if (isInitialized && !loggedIn && !router.pathname.startsWith('/auth')) {
            router.push('/dashboard')
        }
        if (isInitialized && loggedIn) {
            router.push(window.location.pathname.startsWith('/dashboard') ? window.location.pathname : '/dashboard');
        }
    }, [isInitialized, loggedIn])

    return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
    return useContext(authContext)
}

function useProvideAuth() {
    const [apiToken, setApiToken] = useState<string | null>()
    const [user, setUser] = useState<User | undefined>()
    const [loggedIn, setLoggedIn] = useState(false)
    const [isInitialized, setIsInitialized] = useState(false)

    useEffect(() => {
        const apiToken = localStorage.getItem('@auth/apiToken')
        const user = JSON.parse(localStorage.getItem('@auth/user') as string ?? '{}')
        setApiToken(apiToken)
        setUser(user)
    }, [])

    const login = useCallback(
        (credentials: AuthLoginParams, onSuccess?: () => void, onError?: (err: any) => void) => {
            setIsInitialized(false);
            const action = async () => {
                const {email, password} = credentials;
                const response = await loginHandler({email, password})
                if (response.data.token) {
                    axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`
                } else {
                    delete axios.defaults.headers.common.Authorization
                }
                const me = await meHandler()
                setUser(me)
                setApiToken(response.data.token)
                setLoggedIn(true)
                setIsInitialized(true)
                localStorage.setItem('@auth/apiToken', response.data.token)
            }
            action().then(() => {
                onSuccess && onSuccess()
            }).catch(err => onError && onError(err));
        },
        []
    )

    const logout = useCallback((onLogout?: () => void) => {
        setIsInitialized(false);
        const action = async () => {
            await logoutHandler()
        }
        action().finally(() => {
            setLoggedIn(false)
            setApiToken('')
            localStorage.removeItem('@auth/apiToken')
            localStorage.removeItem('@auth/user')
            if (onLogout) {
                onLogout()
            }
            setIsInitialized(true);
        })
    }, [])

    useEffect(() => {
        const token = localStorage.getItem('@auth/apiToken')
        if (token) {
            axios.defaults.headers.common.Authorization = `Bearer ${token}`
        } else {
            delete axios.defaults.headers.common.Authorization
        }

        meHandler().then(me => {
            if (!me || !me.id) {
                throw new Error('not logged in')
            }
            setUser(me)
            setLoggedIn(true)
            localStorage.setItem('@auth/user', JSON.stringify(me))
        }).catch(() => {
            localStorage.removeItem('@auth/apiToken')
            localStorage.removeItem('@auth/user')
            setUser(undefined)
            setApiToken(undefined)
            setLoggedIn(false)
            delete axios.defaults.headers.common.Authorization
        }).finally(() => setIsInitialized(true));
    }, [])

    return {loggedIn, login, logout, user, setUser, setLoggedIn, apiToken, isInitialized}
}