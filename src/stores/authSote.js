import { defineStore } from "pinia";
import api from '@/services/api'
import router from "@/router";

export const useAuthStore = defineStore('auth', {
    state: () =>({
        token: null,
        user: null
    }),

    //aqui se va ha mantener la sesion activa al recaragra la pagina
    persist: true,

    getter: {
    isAuthenticated: (state) => !!state.token,

    //condiciones segun los rolse
    isAdmin: (state) => {
        return state.user?.roles?.some(role => role.name === 'ADMINISTRADOR')
    },
    isCajero: (satate) => {
        return state.user?.roles?.some(role => role.name == 'CAJERO')
    },
    isContador: (satete) => {
        return state.role?.roles?.some(role => role.name === 'CONTADOR')
    },
},
    actions: {
        async login(credentials){
            try {
                const { data } = await api.post('/auth/login', credentials)

                this.token = data.access_token
                this.user = data.user
                
                //los dirigimos segun los roles
                if (this.isAdmin || this.isContador || this.Cajero) {
                    router.push('/admin/dashboard')
                }else {
                    router.push('/') //por si se maneja el rol del cliente en el futuro
                }
            }
            catch(error) {
                console.error("error en login", error)
                throw error;
            }
        },

        async register(payload) {
            try {
                const { data } = await api.post('/auth/register', payload)
                this.token = data.access_token
                this.user = data.user
                router.push = data('/')
            }catch(error) {
                console.error("error al registrarse", error)
                throw error;
            }
        },

        async logout() {
            try {
                if(this.token) {
                    await api.post('/auth/logout')
                }
            }catch(error) {
                console.error("error en cerra las sesión", error)
            }finally {
                this.$reset();
                router.push('/login') 
            }
        }
    }
})

