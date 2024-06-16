import { create } from 'zustand';
import { IAppStore, IUserInfo } from '@/app/app/types';

const defaultUserInfo: IUserInfo = {
    id: -1,
    first_name: '',
    last_name: '',
    email: '',
    role: 'user',
}

interface IAppStoreActions {
    setState: (state: Partial<IAppStore>) => void;
    // App
    setLoadingState: (isLoading: boolean) => void;
    setAuthenticationState: (isAuthenticated: boolean) => void;
    // User
    setUserInfo: (userInfo: IUserInfo) => void;
}

const useAppStore = create<IAppStore & IAppStoreActions>((set) => ({
    /// Store ///
    // App
    isLoading: true,
    isAuthenticated: false,
    // User
    userInfo: defaultUserInfo,

    /// Actions ///
    setState: (state: IAppStore) => set((prev) => ({ prev, ...state })),
    // App
    setLoadingState: (isLoading: boolean) => set((state) => ({ isLoading })),
    setAuthenticationState: (isAuthenticated: boolean) => set(() => ({ isAuthenticated })),
    // User
    setUserInfo: (userInfo) => set((state) => ({ userInfo })),
}));

export default useAppStore;

