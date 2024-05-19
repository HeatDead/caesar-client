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

const getEmployees = async (id) => {
    let res = await instance.get("/project/employees?id=" + id)
    return res.data
}

const addEmployees = async (id, data) => {
    await instance.post("/project/employees?id=" + id, data).then((response) => {
        if(response.status === 200)
            throwSuccess('Изменения внесены')
    })
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

const editProject = async (project) => {
    await instance.post("/project/edit", {
        id: project.id,
        name: project.name,
        description: project.description,
        responsible: project.responsible,
        status: project.status,
        startDate: project.startDate,
        deadline: project.deadline
    }).then((response) => {
        if(response.status === 200)
            throwSuccess('Изменения внесены')
    })
}

const deleteProject = async (id) => {
    await instance.delete("/project/delete?id=" + id).then((response) => {
        if(response.status === 200)
            throwSuccess('Проект удален')
    })
}

export default {
    getProjects, getProject, addProject, editProject, getEmployees, addEmployees, deleteProject
}