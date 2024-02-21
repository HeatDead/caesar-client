import axios from "axios";
import router from "@/router";
import {instance} from "@/config/axiosConfig";

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
        name: projectName
    })
}

export default {
    getProjects, getProject, addProject
}