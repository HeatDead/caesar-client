import axios from "axios";
import { instance } from "@/config/axiosConfig";
import {useAuthStore} from "@/stores/user";
import {throwSuccess} from "@/config/notifications";

const getGroups = async () => {
    let res = await instance.get("/group")
    return res.data
}

const addGroup = async (name) => {
    await instance.post("/group", {
        name: name
    }).then((response) => {
        if(response.status === 200)
            throwSuccess('Группа создана')
    })
}

export default {
    getGroups, addGroup
}