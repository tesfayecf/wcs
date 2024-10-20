import { create } from 'zustand';

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
        firstName: "",
        lastName: "",
        editedAt: "",
        createdAt: "",
        isActive: false,
        isStaff: false,
        isSuperuser: false,
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

const useAppStore = create<App.IAppStore & IAppStoreActions>((set) => ({
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
    setLoadingState: (isLoading: boolean) => set((prev) => ({ status: { ...prev.status, isLoading, isWaiting: false, isError: false, isIdle: false } })),
    setWaitingState: (isWaiting: boolean) => set((prev) => ({ status: { ...prev.status, isLoading: false, isWaiting, isError: false, isIdle: false } })),
    setErrorState: (isError: boolean) => set((prev) => ({ status: { ...prev.status, isLoading: false, isWaiting: false, isError, isIdle: false } })),
    setIdleState: (isIdle: boolean) => set((prev) => ({ status: { ...prev.status, isLoading: false, isWaiting: false, isError: false, isIdle } })),
    // Connection
    setConnectionState: (isConnected: boolean) => set((prev) => ({ connection: { isConnected, isReconnecting: false, isIdle: false, isError: false } })),
    setReconnectingState: (isReconnecting: boolean) => set((prev) => ({ connection: { isConnected: false, isReconnecting, isIdle: false, isError: false } })),
    setConnectionErrorState: (isError: boolean) => set((prev) => ({ connection: { isConnected: false, isReconnecting: false, isIdle: false, isError } })),
    setConnectionIdleState: (isIdle: boolean) => set((prev) => ({ connection: { isConnected: false, isReconnecting: false, isIdle, isError: false } })),
    // Authentication
    setAuthenticationState: (isAuthenticated: boolean) => set(() => ({ isAuthenticated })),
    // User
    setUserInfo: (userInfo: Api.Users.User) => set((prev) => ({ userInfo })),
    resetUserInfo: () => set(() => ({ userInfo: defaultStore.userInfo })),
    // Permissions
    setPermissions: (permissions: any) => set((prev) => ({ permissions })),
    resetPermissions: () => set(() => ({ permissions: [] })),
}));

export default useAppStore;

