
import {userStore} from '../stores/user'
import { storeToRefs } from 'pinia';
import route from 'src/router/index'
export function useCurrentuser(){
    const _userStore=userStore()
    const {userInfo}=storeToRefs(_userStore)
    const info = userInfo
    const hasloggedIn=():boolean=>{
        if(info.value.id){
            return true
        }
        return false
    }
    const logout=()=>{
        if (confirm('Are your sure'))
            {
        _userStore.clearToken()
        _userStore.clearUserInfo()
        route.push('/')
            }

    }
   
    return {
        info,
        hasloggedIn,
        logout
    }
}