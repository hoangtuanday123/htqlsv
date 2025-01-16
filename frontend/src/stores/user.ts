import { defineStore } from 'pinia'
import { api } from 'src/services/client'
import {AuthUser} from 'src/services/api'


export const userStore=defineStore('userStore',{
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        authToken: localStorage.getItem('authToken'),
        userInfo:JSON.parse(localStorage.getItem('userInfo')|| '{}') as AuthUser,
    }),
    actions: {
        saveToken(token: string) {
            // update pinia state
            this.authToken = token

            // set api auth header
            api.setSecurityData(token)

            localStorage.setItem('authToken', token)
        },
        saveUserInfo(user: AuthUser) {
            // update pinia state
            this.userInfo = user
            
            localStorage.setItem('userInfo', JSON.stringify(user))
        },
        clearToken(){
            this.authToken=null
            api.setSecurityData(null)
            localStorage.removeItem('authToken')
        },
        clearUserInfo(){
            this.userInfo = {}
            localStorage.removeItem('userInfo')

        }
    }

})