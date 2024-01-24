import axios from "axios";
import router from "@/router";

const getTasks = async () => {
    let res = await axios.get("http://localhost:8080/task")
    return res.data
}

const addTask = (task) => {
    axios.post("http://localhost:8080/task", {
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
    getTasks, addTask
}