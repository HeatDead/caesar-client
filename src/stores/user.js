import { defineStore } from 'pinia'
import {ref} from "vue";
import * as userApi from "@/api/userApi";

export const useAuthStore = defineStore('auth', () => {
    const token = ref('')
    const userDetails = ref({username: "",
    name: "",
    surname: ""})

    async function setToken(tk) {
        token.value = tk
        localStorage.token = tk
    }

    async function loadDetails() {
        let details = await userApi.getMyDetails().then((res) => {
            setDetails(res)
        })
    }

    function setDetails(details) {
        userDetails.value = details
    }

    function loadToken() {
        token.value = localStorage.token
    }

    function logout() {
        token.value = ''
        localStorage.removeItem('token')
    }

    return {token, userDetails, setToken, loadToken, logout, loadDetails}
})