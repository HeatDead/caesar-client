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

const editDesk = async (desk) => {
    await instance.post("/desk/edit", {
        id: desk.id,
        name: desk.name
    }).then((response) => {
        if(response.status === 200)
            throwSuccess('Изменения внесены')
    })
}

const addPanel = async (panelName, deskId, status) => {
    await instance.post("/desk/panel", {
        name: panelName,
        deskId: deskId,
        status: status
    }).then((response) => {
        if(response.status === 200)
            throwSuccess('Панель создана')
    })
}

const getAvailableStatuses = async (deskId) => {
    let res = await instance.get("/desk/statuses?id=" + deskId)
    return res.data
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

const deletePanel = async (id) => {
    await instance.delete("/desk/panel/delete?id=" + id).then((response) => {
        if(response.status === 200)
            throwSuccess('Панель удалена')
    })
}

const deleteDesk = async (id) => {
    await instance.delete("/desk/delete?id=" + id).then((response) => {
        if(response.status === 200)
            throwSuccess('Доска удалена')
    })
}
export default {
    getDesks, getDesk, editDesk, getDesksByProject, addDesk, addPanel, getPanelsByDesk,
    addTaskToPanel, removeTaskFromPanel, getAvailableStatuses, deletePanel, deleteDesk
}