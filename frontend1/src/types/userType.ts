

 export interface ApiUser {
    userId: string;
    email: string;
    fullName: string;
    username: string;
    about?: string;
    image?: string;
    website?: string; 
    followers: number;
    following: number;
}

export interface LoginCredentials {
    password: string;
    login: string;
}

export interface RegisterCredentials {
    password: string;
    email: string;
    userName: string;
    fullName: string;
}

 
export interface AuthResponse {
    token: string,
    user: ApiUser,
}


export interface UpdateUserPayload {
    username: ApiUser ['username'];
    about?: ApiUser ['about'];
    website?: ApiUser ['website'];
    image?: ApiUser ['image'];
}

export interface UpdateUserArg {
    userId: string,
    userData: UpdateUserPayload
}

export interface resetPasswordArg {
    newPassword: string,
    token: string
}

 export interface AuthState {
    token: string | null,
    user: ApiUser | null,
    loading: boolean,
    authError: unknown | null,
    profileError: unknown | null,
    success: boolean, 
}

