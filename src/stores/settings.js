import { defineStore } from 'pinia'
import {ref} from "vue";
import {useDark, useToggle} from "@vueuse/core";

export const useSettingsStore = defineStore('settings', () => {
    const isDark = useDark()
    const toggleDark = useToggle(isDark)

    return {isDark, toggleDark}
})