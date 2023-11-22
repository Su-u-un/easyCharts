import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useUserStore = defineStore('user', () => {
    const username = ref('')

    function setUsername(newUsername) {
        username.value = newUsername
    }

    return{
        username,
        setUsername
    }
})
