import type {ApiError} from "./apiErrorType"

 export interface User {
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

 
export interface RegisterResponse {
    id: string,
    email: string,
    fullName: string,
    username: string,
    about: string,
    image: string, 
    website: string,
    token: string,
}

export interface LoginResponse {
    id: string,
    token: string,
}

