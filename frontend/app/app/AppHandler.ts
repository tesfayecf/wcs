import { Mutex } from 'async-mutex';
import { useStore } from '../utils/store/store';
import { usePathname, redirect } from 'next/navigation';
class AppHandler {
    private static instance: AppHandler;
    private constructor() {
        console.log("App handler constructor");
    }

    public static getInstance(): AppHandler {
        if (!AppHandler.instance) {
            AppHandler.instance = new AppHandler();
        }
        console.log("App handler getInstance()");
        return AppHandler.instance;
    }

    public init(): void {
        console.log("Initialising app handler...");
    }

    public getInitialStoreData = () => {
        return {
            isAuthenticated: false,
            isConnected: false,
            isLoading: true,
            isAdmin: false,
            isStaff: false,
            isUser: false,
            checkValue: 255,
            userInfo: userSessionInfo // TODO: Api request
        }
    }

    public setInitialAppInfo() {
        useStore.setState((state) => ({
            // Not default data. Data fetched from API
            AppStore: {
                ...state.AppStore,
                store: this.getInitialStoreData()
            }
        }));

        return useStore.getState().AppStore.store;
    }

    public async authenticateUser() {
        try {
            this.startAuthentication();
            // const verification = this.verify()
            const verification = true;
            if (verification) {
                this.setAuth();
                console.log("user authenticated")
                if (window.location.pathname === "/login") {
                    window.location.replace("/dashboard");
                } else {
                    this.finishAuthentication();
                }
            } else {
                this.logout();
                console.log("user NOT authenticated")
                if (window.location.pathname !== "/login") {
                    window.location.replace("/login")
                } else {
                    this.finishAuthentication();
                }
            }
        } catch (error) {
            this.logout();
            console.log("user NOT authenticated -- Error")
            if (window.location.pathname !== "/login") {
                window.location.replace("/login")
            } else {
                this.finishAuthentication();
            }
        }
    }

    public startAuthentication() {
        useStore.getState().AppStore.actions.startAuthentication();
    }

    public setAuth() {
        useStore.getState().AppStore.actions.setAuth();
    }

    public logout() {
        useStore.getState().AppStore.actions.logout();
    }

    public finishAuthentication() {
        useStore.getState().AppStore.actions.finishAuthentication();
    }

    public verify = async () => {
        const mutex = new Mutex();
        const baseQuery = async (args: any, extraOptions: any) => {
            await mutex.acquire();
            let result = await fetch(`${process.env.API_BASE_URL_DEV}/api${args.url}`, {
                method: args.method,
                credentials: 'include',
            });

            if (result.status === 401) {
                if (!mutex.isLocked()) {
                    const release = await mutex.acquire();
                    try {
                        const refreshResult = await fetch(`${process.env.API_BASE_URL_DEV}/api/jwt/refresh/`, {
                            method: 'POST',
                            credentials: 'include',
                        });
                        if (refreshResult.ok) {
                            this.setAuth();
                            result = await fetch(`${process.env.API_BASE_URL_DEV}/api${args.url}`, {
                                method: args.method,
                                credentials: 'include',
                            });
                        } else {
                            this.logout();
                        }
                    } finally {
                        release();
                    }
                } else {
                    await mutex.waitForUnlock();
                    result = await fetch(`${process.env.API_BASE_URL_DEV}/api${args.url}`, {
                        method: args.method,
                        credentials: 'include',
                    });
                }
            }
            return result.json();
        };
        return baseQuery;
    };
}

export default AppHandler;

// dummy app user session info 
const userSessionInfo: any = {
    user: {
        id: 1,
        name: 'John Doe',
        email: 'tesfayecarreras02@gmail.com',
        role: 'admin',
        status: 'active',
        lastLogin: '2021-01-01',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    }
}
