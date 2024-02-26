
type Role = 'admin' | 'staff' | 'user';
type Status = 'active' | 'inactive';

export interface IUserInfo {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: Role;
}

export interface IMenu {
    show: boolean;
    mode: "create" | "edit" | "delete" | "";
    id: number;
}

export interface IAppStore {
    isAuthenticated: boolean;
    isLoading: boolean;
    userInfo: IUserInfo;
}
