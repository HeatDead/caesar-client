import axios from "axios";
import {useAuthStore} from "@/stores/user";

const instance = axios.create({
    baseURL: 'http://localhost:8080/',
    timeout: 1000
});

instance.interceptors.request.use(async (config) => {
    config.headers['Authorization'] = "Bearer " + useAuthStore().token;
    return config;
}, (error) => {
    return Promise.reject(error);
});

instance.interceptors.response.use(null, (error) => {
    if (error.response.status === 403) {
        useAuthStore().logout()
    }
})

export {
    instance
}