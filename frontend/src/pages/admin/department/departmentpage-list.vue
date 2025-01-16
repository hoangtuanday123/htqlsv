<template>
    <div class="q-pa-md">

        <q-btn push color="primary" label="Create">

            <q-popup-proxy>
                <q-banner>
                    <q-form @submit="onSubmit" class="q-gutter-md">
                        <q-input filled v-model="department_value.name" label="Department *" hint="department" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Please type something']" />
                        <q-select v-model="modelhead" :options="headOptions" label="Head" >
                            
                            <template v-slot:append>
                                <q-icon name="close" @click.stop.prevent="modelhead = null" class="cursor-pointer" />
                            </template>

                            
                        </q-select>
                        <q-select v-model="modeldeputyhead" :options="deputyheadOptions" label="Deputy Head" >
                            <template v-slot:append>
                                <q-icon name="close" @click.stop.prevent="modeldeputyhead = null" class="cursor-pointer" />
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
                        <div class="text-h6">Course</div>
                    </q-card-section>

                    <q-card-section class="q-pt-none">
                        <q-input dense v-model="department_value.name" autofocus @keyup.enter="prompt = false" />
                        <q-select  v-model="modelhead" :options="headOptions" label="Head">
                            <template v-slot:append>
                                <q-icon name="close" @click.stop.prevent="modelhead = null" class="cursor-pointer" />
                            </template>
                        </q-select>
                        <q-select v-model="modeldeputyhead" :options="deputyheadOptions" label="Deputy head" >
                            <template v-slot:append>
                                <q-icon name="close" @click.stop.prevent="modeldeputyhead = null" class="cursor-pointer" />
                            </template>
                        </q-select>
                    </q-card-section>

                    <q-card-actions align="right" class="text-primary">
                        <q-btn flat label="Cancel" v-close-popup @click="canceledit" />
                        <q-btn flat label="Edit" @click="editdepartment" v-close-popup />
                    </q-card-actions>
                </q-card>
            </q-dialog>

        </div>
    </div>

    <div class="q-pa-md">
        <q-table flat bordered ref="tableRef" :class="tableClass" :loading="loading" tabindex="0" title="Departments"
            :rows="departments" :columns="columns" row-key="id" :selected-rows-label="getSelectedString"
            selection="multiple" v-model:selected="selected" v-model:pagination="pagination" :filter="filter"
            @focusin="activateNavigation" @focusout="deactivateNavigation">
            <template v-slot:body-cell-actions="props">
                <q-td :props="props" auto-width style="min-width: 120px;">
                    <q-btn round icon="edit" @click="updatedepartment(props.row)" color="primary" flat />
                    <q-btn round icon="delete" color="red" class="q-ml-sm" @click="deletedepartment(props.row)" flat />
                </q-td>
            </template>
        </q-table>
    </div>
</template>

<script setup lang="ts">
// import { ref, computed, nextTick, toRaw } from 'vue'
import { ref, computed, onMounted } from 'vue'
import { Department,DepartmentCreate,DepartmentUpdate,Account,UserSelected } from 'src/services/api'
import { api } from 'src/services/client'
import { useCurrentuser } from 'src/share/currentuser'
const currentuser = useCurrentuser()
const info = currentuser.info
const departments = ref<Department[]>([])
const heads = ref<UserSelected[]>([])
const deputyheads = ref<UserSelected[]>([])
const tableRef = ref(null)
const loading = ref(false)
const navigationActive = ref(false)
const pagination = ref({})
const selected = ref([])

const department_value = ref<Department>({
    id: 0,
    name: '',
    createddated: new Date().toISOString(),
    createdby: '',
    head_id: 0,
    deputy_head_id: 0,

})
const prompt = ref(false)


const filter = ref('')
const columns = [
    { name: 'id', label: 'ID', field: 'id', sortable: true },
    { name: 'name', label: 'Department', field: 'name', sortable: true },
    { name: 'createddated', label: 'Created date', field: 'createddated', sortable: true },
    { name: 'createdby', label: 'created by', field: 'createdby', sortable: true },
    { name: 'head', label: 'Head', field: 'head', sortable: true },
    { name: 'deputy_head', label: 'Deputy head', field: 'deputy_head', sortable: true },
    { name: 'actions', label: 'Actions', field: 'actions', sortable: false, align: 'center' as const }
]
const modelhead = ref(null)
const modeldeputyhead = ref(null)
async function fetchdepartment() {
    loading.value = true
    const res_departments = await api.department.getdepartmentDepartmentGet()
        .then(res => res.data)

    const res_heads = await api.user.getteacherUserTeacherGet()
        .then(res => res.data)
    
    const res_deputyheads = await api.user.getteacherUserTeacherGet()
    .then(res => res.data)
    .finally(() => { loading.value = false })
    departments.value = res_departments
    heads.value = res_heads
    deputyheads.value = res_deputyheads
    
}
const headOptions = computed(() => {
    return heads.value.map(head => ({
        value: head.id,       // Giá trị sẽ được lưu trong modelteacher
        label: head.fullname   // Tên hiển thị trong dropdown
    }));
});

const deputyheadOptions = computed(() => {
    return deputyheads.value.map(deputyhead => ({
        value: deputyhead.id,       // Giá trị sẽ được lưu trong modelteacher
        label: deputyhead.fullname   // Tên hiển thị trong dropdown
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

async function deletedepartment(department: Department) {
    if (confirm('Are you sure? This cannot be undone')) {
        loading.value = true
        await api.department.deletedepartmentDepartmentIdDeleteDelete(department.id)
            .then(() => {
                departments.value.splice(departments.value.indexOf(department), 1);
            })
            .finally(() => { loading.value = false })
    }
}

async function updatedepartment(department: Department) {
    department_value.value.id = department.id
    department_value.value.name = department.name
   
    if (department.head_id) {
        modelhead.value = {};
        modelhead.value.value = department.head_id
        modelhead.value.label = department.head

    }
    else {
        modelhead.value = null
    }
    if (department.deputy_head_id) {
        modeldeputyhead.value = {}
        modeldeputyhead.value.value = department.deputy_head_id
        modeldeputyhead.value.label = department.deputy_head
    }
    else {
        modeldeputyhead.value = null
    }

    prompt.value = true

}

async function editdepartment() {

    loading.value = true
    var a: DepartmentUpdate = {
        name: department_value.value.name,
        createddated: new Date().toISOString(),
        createdby: info.value.fullname || '',
        head_id: modelhead.value ? modelhead.value.value : null,
        deputy_head_id: modeldeputyhead.value ? modeldeputyhead.value.value : null,
    }

    const res = await api.department.updatedepartmentDepartmentIdUpdatePatch(Number(department_value.value.id), a)
    let index = departments.value.findIndex(item => item.id === department_value.value.id);
    departments.value.splice(index, 1)
    departments.value.push(res.data)
 
    department_value.value = {
        id: 0,
        name: '',
        createddated: new Date().toISOString(),
        createdby: '',
        head_id: 0,
        deputy_head_id: 0,

    }
    modelhead.value = null
    modeldeputyhead.value = null
    loading.value = false

}
async function onSubmit() {
    var a: DepartmentCreate = {
        name: department_value.value.name || '',
        createddated: new Date().toISOString(),
        createdby: info.value.fullname || '',
        head_id: modelhead.value ? modelhead.value.value : null,
        deputy_head_id: modeldeputyhead.value ? modeldeputyhead.value.value : null
    }
    const res = await api.department.createdepartmentDepartmentPost(a)
        .then(res => res.data).finally(() => { loading.value = false })
    departments.value.push(res)
    department_value.value.name = ''
    modelhead.value = null
    modeldeputyhead.value = null

}
function canceledit() {
    department_value.value.id = 0
    department_value.value.name = ''
    department_value.value.createddated = new Date().toISOString()
    department_value.value.createdby = ''
    department_value.value.head_id = 0
    department_value.value.deputy_head_id = 0
    modelhead.value = null
    modeldeputyhead.value = null
}

onMounted(async () => {
    await fetchdepartment()
})

</script>