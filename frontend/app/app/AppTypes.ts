
type Role = 'admin' | 'staff' | 'user';
type Status = 'active' | 'inactive';

export interface IUserInfo {
    id: number;
    name: string;
    email: string;
    role: Role;
    status: Status;
    lastLogin: string;
    avatar?: string;
}

export interface IAppStore {
    isAuthenticated: boolean;
    isLoading: boolean;
    isConnected: boolean;

    isAdmin: boolean;
    isStaff: boolean;
    isUser: boolean;

    checkValue: number;
    userInfo: IUserInfo;
}