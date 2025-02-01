export interface CreateUser {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    is_staff?: boolean;
    is_superuser?: boolean;
}

export interface DeleteUser {
    id: number;
}

export interface Login {
    email: string;
    password: string;
}

export interface Recover {
    email: string;
}

export interface Reset {
    uid: string;
    token: string;
    password: string;
    re_password: string;
}

export interface Signup {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    re_password: string;
}

export interface UpdateUser {
    id: number;
    first_name?: string;
    last_name?: string;
    is_active?: boolean;
    is_staff?: boolean;
    is_supseruser?: boolean;
}

export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    edited_at: string;
    created_at: string;
    is_active: boolean;
    is_staff: boolean;
    is_superuser: any;
    password: string;
    last_login?: string | null;
    groups?: number[];
    user_permissions?: number[];
}

