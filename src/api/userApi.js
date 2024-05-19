import axios from "axios";
import {instance} from "@/config/axiosConfig";
import {throwError, throwSuccess} from "@/config/notifications";

export const getUsers = async () => {
    let res = await instance.get("/user")
    return res.data
}

export const getUserByUsername = async (username) => {
    let res = await instance.get("/user/get?username=" + username)
    return res.data
}

export const editUser = async (user, groups) => {
    await instance.post("/user/edit", {
        username: user.username,
        name: user.name,
        surname: user.surname,
        patronymic: user.patronymic,
        role: user.role.id,
        groups: groups
    }).then((response) => {
        if(response.status === 200)
            throwSuccess('Изменения внесены')
    })
}

export const editPassword = async (user) => {
    await instance.post("/user/password", {
        username: user.username,
        password: user.password
    }).then((response) => {
        if(response.status === 200)
            throwSuccess('Изменения внесены')
    })
}

export const getMyDetails = async () => {
    let res = await instance.get("/user/details")
    return res.data
}

export const getRoles = async () => {
    let res = await instance.get("/role")
    return res.data
}

export const getPermissions = async () => {
    let res = await instance.get("/role/permissions")
    return res.data
}

export const deleteRole = async (id) => {
    await instance.delete("/role/delete?id=" + id).then((response) => {
        if(response.status === 200)
            throwSuccess('Роль удалена')
        if(response.status === 409)
            throwError('Роль используется')
    })
}

export const blockUser = async (id) => {
    await instance.post("/user/block?username=" + id).then((response) => {
        if(response.status === 200)
            throwSuccess('Пользователь заблокирован')
    })
}

export const unblockUser = async (id) => {
    await instance.post("/user/unblock?username=" + id).then((response) => {
        if(response.status === 200)
            throwSuccess('Пользователь разблокирован')
    })
}

export const getRole = async (id) => {
    let res = await instance.get("/role/get?id=" + id)
    return res.data
}

export const editRole = async (role) => {
    await instance.post("/role/edit", {
        id: role.id,
        name: role.name,
        permissions: role.permissions
    }).then((response) => {
        if(response.status === 200)
            throwSuccess('Изменения внесены')
    })
}

export const addRole = async (roleName) => {
    await instance.post("/role", {
        name: roleName
    }).then((response) => {
        if(response.status === 200)
            throwSuccess('Роль создана')
    })
}