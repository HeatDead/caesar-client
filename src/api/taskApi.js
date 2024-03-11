import axios from "axios";
import router from "@/router";
import {instance} from "@/config/axiosConfig";

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
        projectId: projectId
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
    getTasks, addTask, addTaskToPanel, getTask, getTasksByProject
}