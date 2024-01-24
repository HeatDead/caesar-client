import axios from "axios";
import router from "@/router";

const getProjects = async () => {
    let res = await axios.get("http://localhost:8080/project")
    return res.data
}

const addProject = (project) => {
    axios.post("http://localhost:8080/project", {
        name: project.name,
        description: project.description,
    }).then(() => {
        router.push('/admin/projects')
    }).catch((e) => {
        console.log(e)
    })
}

export default {
    getProjects, addProject
}