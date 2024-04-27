import {instance} from "@/config/axiosConfig";
import axios from "axios";
import {ElMessage} from "element-plus";
import {throwSuccess} from "@/config/notifications";

const login = async (username, password) => {
    let res = await instance.post("/api/v1/auth/authenticate", {
        username: username,
        password: password
    }).catch((error) => {
        if(error.response.status === 401) {
            ElMessage.error('Не удалось войти. Возможно вы ввели неверные данные.')
        }
    })

    return res.data
}

export const register = async (user) => {
    await instance.post("/api/v1/auth/register", {
        username: user.lgn,
        password: user.psw,
        name: user.name,
        surname: user.surname,
        patronymic: user.patronymic,
        role: user.role
    }).then((response) => {
        if(response.status === 200)
            throwSuccess('Пользователь добавлен')
    })
}

export default {
    login
}