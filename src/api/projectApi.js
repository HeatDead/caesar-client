import axios from "axios";
import router from "@/router";
import {instance} from "@/config/axiosConfig";
import {useAuthStore} from "@/stores/user";
import {throwSuccess} from "@/config/notifications";

const getProjects = async () => {
    let res = await instance.get("/project/list")
    return res.data
}

const getProject = async (id) => {
    let res = await instance.get("/project?id=" + id)
    return res.data
}

const addProject = async (projectName) => {
    await instance.post("/project", {
        name: projectName,
        author: useAuthStore().userDetails.username
    }).then((response) => {
        if(response.status === 200)
            throwSuccess('Проект создан')
    })
}

export default {
    getProjects, getProject, addProject
}