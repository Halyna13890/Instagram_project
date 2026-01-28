import axios from "axios";


export const getErrorMessage = (error : unknown, fallbackMessage : string) =>  {
        if (axios.isAxiosError(error)) {
            return error.response?.data?.message || "Serverfehler"
        } 

        if(error instanceof Error){
            return error.message || "Serverfehler"
        }

        return fallbackMessage
}