
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

export interface AppStore {
    checkValue: number;
    userInfo: IUserInfo;
}