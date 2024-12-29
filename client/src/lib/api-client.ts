import { HOST } from "@/utils/constants";
import axios from "axios";
import {getCookie} from "@/utils/operations.ts";

const apiClient = axios.create({
    baseURL: HOST
})

apiClient.interceptors.request.use(config => {
    const tokenCookie = getCookie("token")

    if (tokenCookie) {
        config.headers["Authorization"] = `Bearer ${tokenCookie}`
    }
    
    return config;
}, error => {
    return Promise.reject(error);
})

export default apiClient