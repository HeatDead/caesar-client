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

const getTasksByProjectAndStatus = async (id, status) => {
    const res = await instance.get(`/task/status?id=${id}&status=${status}`)
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
        deadline: task.deadline,
        assignee: task.assignee,
        status: task.status,
        difficulty: task.difficulty,
        group: task.group,
        type: task.type,
        priority: task.priority,
    }).then((response) => {
        if(response.status === 200)
            throwSuccess('Изменения внесены')
    })
}

const addTaskToPanel = async (name, projectId, panelId) => {
    await instance.post("/task/panel", {
        name: name,
        projectId: projectId,
        panelId: panelId,
        author: useAuthStore().userDetails.username
    })
}

const deleteTask = async (id) => {
    await instance.delete("/task/delete?id=" + id).then((response) => {
        if(response.status === 200)
            throwSuccess('Задача удалена')
    })
}

const  distribute = async (distribution) => {
    let res = await instance.post("/task/distribute", {
        projectId: distribution.projectId,
        groupId: distribution.groupId,
        difficulty: distribution.difficulty
    })
    return res.data
}

export default {
    getTasks, addTask, addTaskToPanel, getTask, getTasksByProject, editTask, distribute, getTasksByProjectAndStatus, deleteTask
}