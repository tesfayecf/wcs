
type Role = 'admin' | 'staff' | 'user';
type Status = 'active' | 'inactive';

export interface IUserInfo {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: Role;
    status: Status;
    avatar?: string;
}

export interface IAppStore {
    session: {
        isConnected: boolean;
        isAdmin: boolean;
        isStaff: boolean;
        isUser: boolean;
    };
    authenticationState: {
        accesToken: string;
        refreshToken: string;
        isAuthenticated: boolean;
    }
    loadingState: {
        isLoading: boolean;
        isFormLoading: boolean;
        loadingText: string;
    }
    userInfo: IUserInfo;
}