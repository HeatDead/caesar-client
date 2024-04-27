import axios from "axios";
import router from "@/router";
import {instance} from "@/config/axiosConfig";
import {useAuthStore} from "@/stores/user";
import {throwSuccess} from "@/config/notifications";

const getTasks = async () => {
    let res = await instance.get("/task")
    return res.data
}

const getTasksByProject = async (id) => {
    const res = await instance.get("/task/project?id=" + id)
    return res.data
}

const getTask = async (id) => {
    let res = await instance.get("/task/get?id=" + id)
    return res.data
}

const addTask = async (name, projectId) => {
    await instance.post("/task", {
        name: name,
        projectId: projectId,
        author: useAuthStore().userDetails.username
    }).then((response) => {
        if(response.status === 200)
            throwSuccess('Задача создана')
    })
}

const editTask = async (task) => {
    await instance.post("/task/edit", {
        id: task.id,
        name: task.name,
        description: task.description,
        startDate: task.startDate,
        deadline: task.deadline
    }).then((response) => {
        if(response.status === 200)
            throwSuccess('Изменения внесены')
    })
}

const addTaskToPanel = async (name, projectId, panelId) => {
    await instance.post("/task/panel", {
        name: name,
        projectId: projectId,
        panelId: panelId
    })
}

export default {
    getTasks, addTask, addTaskToPanel, getTask, getTasksByProject, editTask
}