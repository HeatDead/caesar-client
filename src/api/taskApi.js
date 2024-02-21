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

const addTask = (task) => {
    instance.post("/task", {
        name: task.name,
        description: task.description,
        projectId: task.projectId
    }).then(() => {
        router.push('/tasks')
    }).catch((e) => {
        console.log(e)
    })
}

export default {
    getTasks, addTask, getTask, getTasksByProject
}