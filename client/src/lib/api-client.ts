import { HOST } from "@/utils/constants";
import axios from "axios";
import {getCookie} from "@/utils/operations.ts";

const apiClient = axios.create({
    baseURL: HOST,
    headers: {
        Authorization: `Bearer ${getCookie("token")}`,
    }
})

export default apiClient