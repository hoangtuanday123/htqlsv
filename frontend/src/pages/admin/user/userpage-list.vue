<template>
    <div class="q-pa-md">

        <q-btn push color="primary" label="Create">

            <q-popup-proxy>
                <q-banner>
                    <q-form @submit="onSubmit" class="q-gutter-md">
                        <q-input filled v-model="user_value.email" label="Email *" hint="Email" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Please type something']" />
                            <q-input filled v-model="user_value.fullname" label="Fullname*" hint="Fullname" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Please type something']" />
                            <q-input filled v-model="user_value.gender" label="Gender*" hint="Gender" 
                            />
                            <q-input filled v-model="user_value.personalID" label="PersonalID*" hint="PersonalID"  />
                            <q-input filled v-model="user_value.phone" label="Phone*" hint="Phone"  />
                            <q-input filled v-model="user_value.address" label="Address*" hint="Address"  />
                            <q-input filled v-model="user_value.banknumber" label="Banknumber*" hint="Banknumber"  />
                            <q-input filled v-model="user_value.bankname" label="Bankname*" hint="Bankname"  />
                            <q-input filled v-model="user_value.bankbranch" label="Bankbranch*" hint="Bankbranch"  />
                            <q-input v-model="user_value.startdate" filled type="date" hint="Start date" />
                        <q-select v-model="modelrole" :options="roleOptions" label="Role" >
                            
                            <template v-slot:append>
                                <q-icon name="close" @click.stop.prevent="modelrole = null" class="cursor-pointer" />
                            </template>

                            
                        </q-select>
                        <q-select v-model="modelmajor" :options="majorOptions" label="Major" >
                            
                            <template v-slot:append>
                                <q-icon name="close" @click.stop.prevent="modelmajor = null" class="cursor-pointer" />
                            </template>

                            
                        </q-select>
                        <div>
                            <q-btn label="Submit" type="submit" color="primary" />

                        </div>
                    </q-form>
                </q-banner>
            </q-popup-proxy>

        </q-btn>
        <div>

            <q-dialog v-model="prompt" persistent>
                <q-card style="min-width: 350px">
                    <q-card-section>
                        <div class="text-h6">User</div>
                    </q-card-section>

                    <q-card-section class="q-pt-none">
                        <q-input dense v-model="user_value.fullname" autofocus @keyup.enter="prompt = false" />
                        <q-input filled v-model="user_value.fullname" label="Fullname*" hint="Fullname" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Please type something']" />
                            <q-input filled v-model="user_value.gender" label="Gender*" hint="Gender" 
                            />
                            <q-input filled v-model="user_value.personalID" label="PersonalID*" hint="PersonalID"  />
                            <q-input filled v-model="user_value.phone" label="Phone*" hint="Phone"  />
                            <q-input filled v-model="user_value.address" label="Address*" hint="Address"  />
                            <q-input filled v-model="user_value.banknumber" label="Banknumber*" hint="Banknumber"  />
                            <q-input filled v-model="user_value.bankname" label="Bankname*" hint="Bankname"  />
                            <q-input filled v-model="user_value.bankbranch" label="Bankbranch*" hint="Bankbranch"  />
                            <q-input v-model="user_value.startdate" filled type="date" hint="Start date" />
                        <q-select v-model="modelrole" :options="roleOptions" label="Role" >
                            
                            <template v-slot:append>
                                <q-icon name="close" @click.stop.prevent="modelrole = null" class="cursor-pointer" />
                            </template>

                            
                        </q-select>
                        <q-select v-model="modelmajor" :options="majorOptions" label="Major" >
                            
                            <template v-slot:append>
                                <q-icon name="close" @click.stop.prevent="modelmajor = null" class="cursor-pointer" />
                            </template>

                            
                        </q-select>
                        <q-checkbox v-model="user_value.is_active" label="Is Active" />
                    </q-card-section>

                    <q-card-actions align="right" class="text-primary">
                        <q-btn flat label="Cancel" v-close-popup @click="canceledit" />
                        <q-btn flat label="Edit" @click="editclass" v-close-popup />
                    </q-card-actions>
                </q-card>
            </q-dialog>

        </div>
    </div>

    <div class="q-pa-md">
        <q-table flat bordered ref="tableRef" :class="tableClass" :loading="loading" tabindex="0" title="Users"
            :rows="users" :columns="columns" row-key="id" :selected-rows-label="getSelectedString"
            selection="multiple" v-model:selected="selected" v-model:pagination="pagination" :filter="filter"
            @focusin="activateNavigation" @focusout="deactivateNavigation">
            <template v-slot:body-cell-actions="props">
                <q-td :props="props" auto-width style="min-width: 120px;">
                    <q-btn round icon="edit" @click="updateuser(props.row)" color="primary" flat />
                    <!-- <q-btn round icon="delete" color="red" class="q-ml-sm" @click="deleteclass(props.row)" flat /> -->
                </q-td>
            </template>
            <template v-slot:body-cell-is_active="props">
                <q-td :props="props">
                    <div>
                        <q-badge :color="props.row.is_active ? 'green' : 'grey'"/>
                    </div>
                </q-td>
            </template>
        </q-table>
    </div>
</template>

<script setup lang="ts">
// import { ref, computed, nextTick, toRaw } from 'vue'
import { ref, computed, onMounted } from 'vue'
import {  Account ,AccountCreate,AccountUpdate,Role,Major} from 'src/services/api'
import { api } from 'src/services/client'
import { useCurrentuser } from 'src/share/currentuser'
const currentuser = useCurrentuser()
const info = currentuser.info
const users = ref<Account[]>([])
const roles = ref<Role[]>([])
const majors=ref<Major[]>([])
const tableRef = ref(null)
const loading = ref(false)
const navigationActive = ref(false)
const pagination = ref({})
const selected = ref([])

const user_value = ref<Account>({
    id: 0,
    email: '',
    fullname:'',
    gender:'',
    personalID:'',
    phone:'',
    address:'',
    banknumber:'',
    bankname:'',
    bankbranch:'',
    startdate:'',
    hashpassword:'',
    role_id:0,
    role:'',
    major_id:0,
    major:'',
    is_active:true,
    createddated:'',
    Createdby:'',
})
const prompt = ref(false)


const filter = ref('')
const columns = [
    { name: 'id', label: 'ID', field: 'id', sortable: true },
    { name: 'fullname', label: 'Fullname', field: 'fullname', sortable: true },
    { name: 'email', label: 'Email', field: 'email', sortable: true },
    { name: 'gender', label: 'Gender', field: 'gender', sortable: true },
    { name: 'personalID', label: 'PersonalID', field: 'personalID', sortable: true },
    { name: 'phone', label: 'Phone', field: 'phone', sortable: true },
    { name: 'address', label: 'Address', field: 'address', sortable: true },
    { name: 'banknumber', label: 'Banknumber', field: 'banknumber', sortable: true },
    { name: 'bankname', label: 'Bankname', field: 'bankname', sortable: true },
    { name: 'bankbranch', label: 'Bankbranch', field: 'bankbranch', sortable: true },
    { name: 'startdate', label: 'Startdate', field: 'startdate', sortable: true },
    { name: 'createddated', label: 'Createddated', field: 'createddated', sortable: true },
    { name: 'Createdby', label: 'Createdby', field: 'Createdby', sortable: true },
    { name: 'role', label: 'Role', field: 'role', sortable: true },
    { name: 'major', label: 'Major', field: 'major', sortable: true },
    { name: 'is_active', label: 'Status', field: 'is_active', sortable: true },
    { name: 'actions', label: 'Actions', field: 'actions', sortable: false, align: 'center' as const }
]
const modelrole = ref(null)
const modelmajor = ref(null)
async function fetchuser() {
    loading.value = true
    const res_user = await api.user.getuserUserGet()
        .then(res => res.data)
    const res_majors = await api.major.getmajorMajorGet()
        .then(res => res.data)
    const res_roles = await api.role.getroleRoleGet()
        .then(res => res.data)
        .finally(() => { loading.value = false })
    users.value = res_user;
    roles.value = res_roles
    majors.value = res_majors
}
const roleOptions = computed(() => {
    return roles.value.map(role => ({
        value: role.id,       // Giá trị sẽ được lưu trong modelteacher
        label: role.rolename   // Tên hiển thị trong dropdown
    }));
});

const majorOptions = computed(() => {
    return majors.value.map(major => ({
        value: major.id,       // Giá trị sẽ được lưu trong modelteacher
        label: major.name   // Tên hiển thị trong dropdown
    }));
});




function getSelectedString() {

    return selected.value.length === 0 ? '' : `${selected.value.length} record`
}

const tableClass = computed<string | null>(() =>
    navigationActive.value === true ? 'shadow-8 no-outline' : null
)

async function activateNavigation() {
    navigationActive.value = true
}

async function deactivateNavigation() {
    navigationActive.value = false
}

// async function deleteclass(course: Course) {
//     if (confirm('Are you sure? This cannot be undone')) {
//         loading.value = true
//         await api.course.updatecourseCourseIdDeleteDelete(course.id)
//             .then(() => {
//                 courses.value.splice(courses.value.indexOf(course), 1);
//             })
//             .finally(() => { loading.value = false })
//     }
// }

async function updateuser(user: Account) {
    user_value.value.id = user.id
    user_value.value.fullname = user.fullname
    user_value.value.gender= user.gender
    user_value.value.personalID= user.personalID
    user_value.value.phone= user.phone
    user_value.value.address= user.address
    user_value.value.banknumber= user.banknumber
    user_value.value.bankname= user.bankname
    user_value.value.bankbranch= user.bankbranch
    user_value.value.startdate= user.startdate
    user_value.value.is_active= user.is_active
    user_value.value.role_id = user.role_id
    user_value.value.major_id = user.major_id
   
    if (user.role_id) {
        modelrole.value = {};
        modelrole.value.value = user.role_id
        modelrole.value.label = user.role

    }
    else {
        modelrole.value = null
    }
    if (user.major_id) {
        modelmajor.value = {};
        modelmajor.value.value = user.major_id
        modelmajor.value.label = user.major

    }
    else {
        modelmajor.value = null
    }

    prompt.value = true

}

async function editclass() {

    loading.value = true
    const a: AccountUpdate = {
    email: user_value.value.email || '',
    fullname: user_value.value.fullname || '',
    gender: user_value.value.gender || null, // Nếu không có giá trị, có thể là null
    personalID: user_value.value.personalID || null, // Có thể là null nếu không có
    phone: user_value.value.phone || null, // Có thể là null nếu không có
    address: user_value.value.address || null, // Có thể là null nếu không có
    banknumber: user_value.value.banknumber || null, // Có thể là null nếu không có
    bankname: user_value.value.bankname || null, // Có thể là null nếu không có
    bankbranch: user_value.value.bankbranch || null, // Có thể là null nếu không có
    startdate: user_value.value.startdate || null, // Đảm bảo đúng định dạng ngày, hoặc null
    hashpassword: user_value.value.hashpassword || '', // Bạn có thể loại bỏ trường này nếu không cần thiết
    createddated: new Date().toISOString(), // Sử dụng thời gian hiện tại với định dạng ISO 8601
    Createdby: info.value.fullname || 'admin', // Đảm bảo có giá trị hợp lệ
    role_id: modelrole.value.value, // Kiểm tra role_id hợp lệ
    is_active: user_value.value.is_active, // Có thể là true hoặc false
    major_id: modelmajor.value ? modelmajor.value.value : null, // Có thể là null nếu không có
    password:'', // Cung cấp giá trị cho password nếu cần
};

    const res = await api.user.updateUserUserIdUpdatePatch(Number(user_value.value.id), a)
    let index = users.value.findIndex(item => item.id === user_value.value.id);
    users.value.splice(index, 1)
    users.value.push(res.data)
    
    user_value.value = {
    id: 0,
    email: '',
    fullname:'',
    gender:'',
    personalID:'',
    phone:'',
    address:'',
    banknumber:'',
    bankname:'',
    bankbranch:'',
    startdate:'',
    hashpassword:'',
    role_id:0,
    role:'',
    major_id:0,
    major:'',
    is_active:true,
    createddated:'',
    Createdby:'',
}
    modelrole.value = null
    modelmajor.value = null
   
   
    loading.value = false

}
async function onSubmit() {
    loading.value = true
    const a: AccountCreate = {
        email: user_value.value.email || '',
        fullname: user_value.value.fullname || '',
        gender: user_value.value.gender || null, // Nếu không có giá trị, có thể là null
        personalID: user_value.value.personalID || null, // Có thể là null nếu không có
        phone: user_value.value.phone || null, // Có thể là null nếu không có
        address: user_value.value.address || null, // Có thể là null nếu không có
        banknumber: user_value.value.banknumber || null, // Có thể là null nếu không có
        bankname: user_value.value.bankname || null, // Có thể là null nếu không có
        bankbranch: user_value.value.bankbranch || null, // Có thể là null nếu không có
        startdate: user_value.value.startdate || null, // Đảm bảo đúng định dạng ngày, hoặc null
        hashpassword: user_value.value.hashpassword || '', // Đảm bảo có giá trị hợp lệ
        createddated: new Date().toISOString(), // Sử dụng thời gian hiện tại với định dạng ISO 8601
        Createdby: info.value.fullname || 'admin', // Đảm bảo có giá trị hợp lệ
        role_id: modelrole.value.value , // Kiểm tra role_id hợp lệ
        is_active: true, // Có thể là true hoặc false
        major_id: modelmajor.value ? modelmajor.value.value : null, // Có thể là null nếu không có
    };
    
    console.log(a)
    const res = await api.user.createUserUserPost(a)
        .then(res => res.data).finally(() => { loading.value = false })
       
    users.value.push(res)
    user_value.value.fullname = ''
    user_value.value.email=''
    user_value.value.gender= ''
    user_value.value.personalID= ''
    user_value.value.phone= ''
    user_value.value.address= ''
    user_value.value.banknumber= ''
    user_value.value.bankname= ''
    user_value.value.bankbranch= ''
    user_value.value.startdate= ''
    modelrole.value = null
    modelmajor.value = null
   

 }
function canceledit() {
    user_value.value.id = 0
    user_value.value.fullname = ''
    user_value.value.email=''
    user_value.value.gender= ''
    user_value.value.personalID= ''
    user_value.value.phone= ''
    user_value.value.address= ''
    user_value.value.banknumber= ''
    user_value.value.bankname= ''
    user_value.value.bankbranch= ''
    user_value.value.startdate= ''
    modelrole.value = null
    modelmajor.value = null
}

onMounted(async () => {
    await fetchuser()
})

</script>