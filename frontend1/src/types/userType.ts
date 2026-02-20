

 export interface ApiUser {
    userId: string;
    email: string;
    fullName: string;
    userName: string;
    about?: string;
    avatar?: string;
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
    userName: ApiUser ['userName'];
    about?: ApiUser ['about'];
    website?: ApiUser ['website'];
    avatar?: ApiUser ['avatar'];
}

export interface UpdateUserArg {
    userId: string,
    userData: UpdateUserPayload
}

export interface resetPasswordArg {
    newPassword: string,
    token: string
}


export interface searchUsersResponse {
    userId: string
    userName: string,
    avatar?: string,
    fullName: string,
    
}


 export interface AuthState {
    token: string | null,
    user: ApiUser | null,
    loading: boolean,
    errors: {
    authError: unknown | null,
    profileError: unknown | null,
    forgotPassError: unknown | null,
    resetPassError: unknown | null,
    },
    success: boolean, 
}

