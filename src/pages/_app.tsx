import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";
import {ProvideAuth, useAuth} from '../context/auth.context';
import axios from "axios";
import {Fragment, PropsWithChildren, useEffect, useState} from "react";
import "bootstrap/dist/css/bootstrap.css"
import {useRouter} from "next/router";

function pushNotificationAvailable() {
    var bAvailable = false;
    if (window.isSecureContext) {
        // running in secure context - check for available Push-API
        bAvailable = (('serviceWorker' in navigator) &&
            ('PushManager' in window) &&
            ('Notification' in window));
    } else {
        console.log('Site have to run in secure context!');
    }
    return bAvailable;
}

async function pnSubscribe() {
    if (pushNotificationAvailable()) {
        navigator.permissions.query({name: 'notifications'}).then(function (notificationPerm) {
            notificationPerm.onchange = function () {
                navigator.serviceWorker.getRegistration()
                    .then(function (registration) {
                        if (notificationPerm.state == "granted") {
                            registration?.unregister().then(() => {
                                location.reload();
                            });
                        }
                    });
            };
        });
        // if not granted or denied so far...
        if (window.Notification.permission === 'default') {
            await window.Notification.requestPermission();
        }
    }
}

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

    if (path.startsWith('/home')) {
        console.log("as")
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
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            pnSubscribe().then(() => {
                navigator.serviceWorker
                    .register('/service-worker.js')
                    .then((res) => console.log('scope: ', res.scope));
            });
        }
    }, []);
    return (
        <Providers>
            <ComponentWrapper pageProps={pageProps} Component={Component}/>
        </Providers>
    )
}


