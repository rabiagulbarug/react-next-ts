import axios from 'axios'
import {createContext, PropsWithChildren, useCallback, useContext, useEffect, useState} from 'react'

import {loginHandler} from "../handlers/auth/login.handler"
import {User} from '../types/user'
import {meHandler} from "../handlers/auth/me.handler";
import {logoutHandler} from "../handlers/auth/logout.handler";
import {useRouter} from "next/router";
import Swal from 'sweetalert2';

type AuthLoginParams = {
    email: string
    password: string
    remember_me: number
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
            router.push('/auth/login')
        }
        if (isInitialized && loggedIn) {
            if (user?.email_verified === 1) {
                router.push(window.location.pathname.startsWith('/auth/login') ? window.location.pathname : '/auth/login');
            } else {
                router.push(window.location.pathname.startsWith('/auth/verify-mail') ? window.location.pathname : '/auth/verify-mail');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInitialized, loggedIn])

    axios.interceptors.response.use(response => response, error => {
        if ([401, 403].includes(error.response.status)) {
            logout();
            router.push('/auth/login');
        } else if (error.response.status == 400) {
            Swal.fire({
                title: "Error",
                text: error.response.data.messages.map((t: any) => Object.values(t).join('\n')),
                icon: "error",
            });
        }
    });
    axios.interceptors.request.use((config) => {
        config.params = {...config.params, lang: 'en'}
        return config;
    })

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
                const {email, password, remember_me} = credentials;
                const response = await loginHandler({email, password})
                if (response.token) {
                    axios.defaults.headers.common.Authorization = `Bearer ${response.token}`
                } else {
                    delete axios.defaults.headers.common.Authorization
                }
                const me = await meHandler()
                setUser(me)
                setApiToken(response.token)
                setLoggedIn(response.logged_in)
                setIsInitialized(true)
                localStorage.setItem('@auth/apiToken', response.token)
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
            if (!me || !me.username || me.username === 'guest') {
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