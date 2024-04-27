import {ElNotification} from "element-plus";

export const throwError = (message) => {
    ElNotification({
        title: 'Ошибка',
        message: message,
        type: 'error',
    })
}

export const throwWarning = (message) => {
    ElNotification({
        title: 'Внимание',
        message: message,
        type: 'warning',
    })
}

export const throwInfo = (message) => {
    ElNotification({
        title: 'Информация',
        message: message,
        type: 'info',
    })
}

export const throwSuccess = (message) => {
    ElNotification({
        title: 'Выполнено',
        message: message,
        type: 'success',
    })
}