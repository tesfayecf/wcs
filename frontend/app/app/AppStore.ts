import { IAppEndpoints, IAppStore } from "./AppTypes";

export const AppStoreDefault: IAppStore = {
    isAuthenticated: false,
    isLoading: true,
    isAdmin: false,
    isStaff: false,
    isUser: false,
    checkValue: 0,
    userInfo: {
        id: -1,
        name: '',
        email: '',
        role: 'user',
        status: 'inactive',
        lastLogin: '',
    }
}

export const AppEndpoints: IAppEndpoints = {
    retrieveUser: async () => {
        try {
            const response = await fetch('/users/me/');
            const user = await response.json();
            return user;
        } catch (error) {
            console.error('Failed to retrieve user:', error);
            return undefined;
        }
    },
};