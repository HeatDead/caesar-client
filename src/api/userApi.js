import axios from "axios";
import {instance} from "@/config/axiosConfig";
import {throwSuccess} from "@/config/notifications";

export const getUsers = async () => {
    let res = await instance.get("/user")
    return res.data
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