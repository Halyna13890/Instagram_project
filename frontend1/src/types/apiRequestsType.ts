
export interface ApiError {
    message: string;
    code?: string;
    status?: number;
    timestamp: string;
    stack?: string;

}


export interface ApiMessageResponse {
    message: string
}