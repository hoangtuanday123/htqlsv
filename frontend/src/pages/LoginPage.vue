<template>
    <q-page class="row items-center justify-evenly">

        <q-card >
            <q-card-section>
                <div class="text-h6">Login</div>

            </q-card-section>
            <q-card-section>
                <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
                    <q-input filled v-model="email" label="Your email *" hint="email" lazy-rules
                        :rules="[val => val && val.length > 0 || 'Please type something']" />

                    <q-input filled v-model="password" label="Your password *" hint="Your password" lazy-rules
                        :rules="[val => val && val.length > 0 || 'Please type something']" />

                    <!-- <q-toggle v-model="accept" label="I accept the license and terms" /> -->

                    <div>
                        <q-btn label="Login" type="submit" :loading="loading" color="primary" />
                        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
                    </div>
                </q-form>
            </q-card-section>

        </q-card>
    </q-page>
</template>
<script setup lang="ts">
import { api } from '../services/client';
import { ref } from 'vue'

import {userStore} from '../stores/user'
import { storeToRefs } from 'pinia';
import pinia from '../stores'
import router from 'src/router/index'

const email = ref('')
const password = ref('')
// const accept = ref(false)

const loading=ref(false)

const _userStore = userStore(pinia())
const {authToken,userInfo}=storeToRefs(_userStore)

async function  onSubmit(){
    loading.value=true
    const loginreq={
        username:email.value,
        password:password.value,
        grant_type:'password'
      
    }
    try{
        let auth
        auth=await api.auth.loginAuthLoginPost(loginreq)
        .then(res=>res.data)
      
        if(auth &&auth.access_token){
            _userStore.saveToken(auth.access_token)
        
            let user
            user=await api.currentUser.getMeCurrentUserGet().then(res => res.data)
            _userStore.saveUserInfo(user)
            if (userInfo.value.role=='admin'){
                router.push('/admin')
            }
            else if (userInfo.value.role=='teacher'){
                router.push('/teacher')
            }
            else{
                router.push('/student')
            }
            
        }
    }
    catch (error) {
        if (error)
            alert(error)
        else
            alert('Unknown error occured')
    }
    finally{
        
        loading.value=false
    }
    
}

async function  onReset(){
    email.value = ''
    password.value = ''
    // accept.value = false
}

</script>