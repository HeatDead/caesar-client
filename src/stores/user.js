import { defineStore } from 'pinia'
import {ref} from "vue";

export const useAuthStore = defineStore('auth', () => {
    const token = ref('')
    function setToken(tk) {
        token.value = tk
        localStorage.token = tk
    }

    function loadToken() {
        token.value = localStorage.token
    }

    function logout() {
        token.value = ''
        localStorage.removeItem('token')
    }

    return {token, setToken, loadToken, logout}
})