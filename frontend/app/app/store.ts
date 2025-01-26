import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { Api } from "@/app/lib/api/types";
import { App } from '@/app/app/types';

const defaultStore: App.IAppStore = {
    status: {
        isLoading: true,
        isWaiting: false,
        isError: false,
        isIdle: false,
    },
    connection: {
        isConnected: false,
        isReconnecting: false,
        isIdle: false,
        isError: false,
    },
    isAuthenticated: false,
    userInfo: {
        id: -1,
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        edited_at: "",
        created_at: "",
        is_active: false,
        is_staff: false,
        is_superuser: false,
    },
    permissions: {}
}

interface IAppStoreActions {
    setState: (state: Partial<App.IAppStore>) => void;
    // App
    setLoadingState: (isLoading: boolean) => void;
    setWaitingState: (isWaiting: boolean) => void; // Added waiting state
    setErrorState: (isError: boolean) => void; // Added error state
    setIdleState: (isIdle: boolean) => void; // Added idle state
    setAuthenticationState: (isAuthenticated: boolean) => void;
    // Connection
    setConnectionState: (isConnected: boolean) => void; // Added connection state
    setReconnectingState: (isReconnecting: boolean) => void; // Added reconnecting state
    setConnectionIdleState: (isIdle: boolean) => void; // Added connection idle state
    setConnectionErrorState: (isError: boolean) => void; // Added connection error state
    // User
    setUserInfo: (userInfo: Api.Users.User) => void;
    resetUserInfo: () => void;
    // Permissions
    setPermissions: (permissions: any) => void;
    resetPermissions: () => void;
}

export const useAppStore = create<App.IAppStore & IAppStoreActions>()(
    immer((set) => ({
        /// Store ///
        // Status
        status: defaultStore.status,
        // Connection
        connection: defaultStore.connection,
        // Authentication
        isAuthenticated: false,
        // User
        userInfo: defaultStore.userInfo,
        // Permissions
        permissions: defaultStore.permissions,

        /// Actions ///
        setState: (state: Partial<App.IAppStore>) => set((prev) => ({ ...prev, ...state })),
        // Status
        setLoadingState: (isLoading: boolean) => set((prev) => { prev.status.isLoading = isLoading; prev.status.isWaiting = false; prev.status.isError = false; prev.status.isIdle = false; }),
        setWaitingState: (isWaiting: boolean) => set((prev) => { prev.status.isLoading = false; prev.status.isWaiting = isWaiting; prev.status.isError = false; prev.status.isIdle = false; }),
        setErrorState: (isError: boolean) => set((prev) => { prev.status.isLoading = false; prev.status.isWaiting = false; prev.status.isError = isError; prev.status.isIdle = false; }),
        setIdleState: (isIdle: boolean) => set((prev) => { prev.status.isLoading = false; prev.status.isWaiting = false; prev.status.isError = false; prev.status.isIdle = isIdle; }),
        // Connection
        setConnectionState: (isConnected: boolean) => set((prev) => { prev.connection.isConnected = isConnected; prev.connection.isReconnecting = false; prev.connection.isIdle = false; prev.connection.isError = false; }),
        setReconnectingState: (isReconnecting: boolean) => set((prev) => { prev.connection.isConnected = false; prev.connection.isReconnecting = isReconnecting; prev.connection.isIdle = false; prev.connection.isError = false; }),
        setConnectionErrorState: (isError: boolean) => set((prev) => { prev.connection.isConnected = false; prev.connection.isReconnecting = false; prev.connection.isIdle = false; prev.connection.isError = isError; }),
        setConnectionIdleState: (isIdle: boolean) => set((prev) => { prev.connection.isConnected = false; prev.connection.isReconnecting = false; prev.connection.isIdle = isIdle; prev.connection.isError = false; }),
        // Authentication
        setAuthenticationState: (isAuthenticated: boolean) => set(() => ({ isAuthenticated })),
        // User
        setUserInfo: (userInfo: Api.Users.User) => set((prev) => { prev.userInfo = userInfo; }),
        resetUserInfo: () => set(() => ({ userInfo: defaultStore.userInfo })),
        // Permissions
        setPermissions: (permissions: any) => set((prev) => { prev.permissions = permissions; }),
        resetPermissions: () => set(() => ({ permissions: [] })),
    }))
);