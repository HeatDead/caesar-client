import axios from "axios";
import {useAuthStore} from "@/stores/user";
import {ElNotification} from "element-plus";
import {throwError} from "@/config/notifications";

export const instance = axios.create({
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
    console.log(error)
    if (error.response.status === 401) {
        useAuthStore().logout()
    } else if(error.response.status === 403) {
        throwError('Вам не доступно данное действие. Если это не так, обратитесь к администратору.')
    }
})