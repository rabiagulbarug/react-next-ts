import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";
import {ProvideAuth, useAuth} from '../context/auth.context';
import axios from "axios";
import {Fragment, PropsWithChildren, useEffect, useState} from "react";
import "bootstrap/dist/css/bootstrap.css"
import {useRouter} from "next/router";

const Providers = ({children}: PropsWithChildren) => {
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

    return (
        <QueryClientProvider client={new QueryClient()}>
            <ProvideAuth>
                {children}
            </ProvideAuth>
        </QueryClientProvider>
    )
}

const ComponentWrapper = ({Component, pageProps}: Partial<AppProps>) => {
    const {isInitialized, loggedIn} = useAuth();
    const router = useRouter();
    const path = router.asPath;
    const [, updateState] = useState({});

    useEffect(() => updateState({}), [isInitialized, loggedIn]);

    if (path.startsWith('/dashboard')) {
        if (isInitialized && loggedIn) {
            // @ts-ignore
            return <Component {...pageProps} />
        }
        // @ts-ignore
        return <Fragment/>
    }
    // @ts-ignore
    return <Component {...pageProps} />
}

export default function App({Component, pageProps}: AppProps) {
    return (
        <Providers>
            <ComponentWrapper pageProps={pageProps} Component={Component}/>
        </Providers>
    )
}


