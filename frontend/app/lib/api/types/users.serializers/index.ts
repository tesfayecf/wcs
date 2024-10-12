export interface CreateUser {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    isStaff?: boolean;
    isSuperuser?: boolean;
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
    id: number;
    firstName?: string;
    lastName?: string;
    isActive?: boolean;
    isStaff?: boolean;
    isSupseruser?: boolean;
}

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    editedAt: string;
    createdAt: string;
    isActive: boolean;
    isStaff: boolean;
    isSuperuser: any;
}

