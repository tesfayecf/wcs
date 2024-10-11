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
    rePassword: string;
}

export interface Signup {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    rePassword: string;
}

export interface UpdateUser {
    firstName?: string;
    lastName?: string;
}

export interface UserInfo {
    email: string;
    firstName?: string;
    lastName?: string;
    createdAt?: string;
    isActive?: boolean;
    isStaff?: boolean;
    isSuperuser?: boolean;
}

