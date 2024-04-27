import {instance} from "@/config/axiosConfig";
import {throwSuccess} from "@/config/notifications";

const getDesks = async () => {
    let res = await instance.get("/desk/list")
    return res.data
}

const getDesk = async (id) => {
    let res = await instance.get("/desk?id=" + id)
    return res.data
}

const getDesksByProject = async (id) => {
    let res = await instance.get("/desk/project?id=" + id)
    return res.data
}

const addDesk = async (deskName, projectId) => {
    await instance.post("/desk", {
        name: deskName,
        projectId: projectId
    }).then((response) => {
        if(response.status === 200)
            throwSuccess('Доска создана')
    })
}

const addPanel = async (panelName, deskId) => {
    await instance.post("/desk/panel", {
        name: panelName,
        deskId: deskId
    }).then((response) => {
        if(response.status === 200)
            throwSuccess('Панель создана')
    })
}

const getPanelsByDesk = async (id) => {
    let res = await instance.get("/desk/panels?id=" + id)
    return res.data
}

const addTaskToPanel = async (panelId, taskId) => {
    await instance.post("/desk/panel/task", {
        panelId: panelId,
        taskId: taskId
    })
}

const removeTaskFromPanel = async (panelId, taskId) => {
    await instance.delete("/desk/panel/task", {
        headers: {
        },
        data: {
            panelId: panelId,
            taskId: taskId}
    })
}

export default {
    getDesks, getDesk, getDesksByProject, addDesk, addPanel, getPanelsByDesk, addTaskToPanel, removeTaskFromPanel
}