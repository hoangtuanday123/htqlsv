<template>
    <div class="q-pa-md">

        <q-btn push color="primary" label="Create">

            <q-popup-proxy>
                <q-banner>
                    <q-form @submit="onSubmit" class="q-gutter-md">
                        <q-input filled v-model="major_value.name" label="Major *" hint="Major" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Please type something']" />
                        <q-select v-model="modelhead" :options="headOptions" label="Head">

                            <template v-slot:append>
                                <q-icon name="close" @click.stop.prevent="modelhead = null" class="cursor-pointer" />
                            </template>


                        </q-select>
                        <q-select v-model="modeldeputyhead" :options="deputyheadOptions" label="Deputy Head">
                            <template v-slot:append>
                                <q-icon name="close" @click.stop.prevent="modeldeputyhead = null"
                                    class="cursor-pointer" />
                            </template>
                        </q-select>
                        <q-select v-model="modeldepartment" :options="departmentOptions" label="Department">
                            <template v-slot:append>
                                <q-icon name="close" @click.stop.prevent="modeldepartment = null"
                                    class="cursor-pointer" />
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
                        <q-input dense v-model="major_value.name" autofocus @keyup.enter="prompt = false" />
                        <q-select v-model="modelhead" :options="headOptions" label="Head">
                            <template v-slot:append>
                                <q-icon name="close" @click.stop.prevent="modelhead = null" class="cursor-pointer" />
                            </template>
                        </q-select>
                        <q-select v-model="modeldeputyhead" :options="deputyheadOptions" label="Deputy Head">
                            <template v-slot:append>
                                <q-icon name="close" @click.stop.prevent="modeldeputyhead = null"
                                    class="cursor-pointer" />
                            </template>
                        </q-select>
                        <q-select v-model="modeldepartment" :options="departmentOptions" label="Department">
                            <template v-slot:append>
                                <q-icon name="close" @click.stop.prevent="modeldepartment = null"
                                    class="cursor-pointer" />
                            </template>
                        </q-select>
                    </q-card-section>

                    <q-card-actions align="right" class="text-primary">
                        <q-btn flat label="Cancel" v-close-popup @click="canceledit" />
                        <q-btn flat label="Edit" @click="editmajor" v-close-popup />
                    </q-card-actions>
                </q-card>
            </q-dialog>

        </div>
    </div>

    <div class="q-pa-md">
        <q-table flat bordered ref="tableRef" :class="tableClass" :loading="loading" tabindex="0" title="Majors"
            :rows="majors" :columns="columns" row-key="id" :selected-rows-label="getSelectedString" selection="multiple"
            v-model:selected="selected" v-model:pagination="pagination" :filter="filter" @focusin="activateNavigation"
            @focusout="deactivateNavigation">
            <template v-slot:body-cell-actions="props">
                <q-td :props="props" auto-width style="min-width: 120px;">
                    <q-btn round icon="edit" @click="updatemajor(props.row)" color="primary" flat />
                    <q-btn round icon="delete" color="red" class="q-ml-sm" @click="deletemajor(props.row)" flat />
                </q-td>
            </template>
        </q-table>
    </div>
</template>

<script setup lang="ts">
// import { ref, computed, nextTick, toRaw } from 'vue'
import { ref, computed, onMounted } from 'vue'
import { Major, MajorCreate, MajorUpdate, Department, UserSelected } from '../../../services/api'
import { api } from '../../../services/client'
import { useCurrentuser } from '../../../share/currentuser'
const currentuser = useCurrentuser()
const info = currentuser.info
const departments = ref<Department[]>([])
const heads = ref<UserSelected[]>([])
const deputyheads = ref<UserSelected[]>([])
const majors = ref<Major[]>([])
const tableRef = ref(null)
const loading = ref(false)
const navigationActive = ref(false)
const pagination = ref({})
const selected = ref([])

const major_value = ref<Major>({
    id: 0,
    name: '',
    createddated: new Date().toISOString(),
    createdby: '',
    head_id: 0,
    deputy_head_id: 0,
    department_id: 0

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
    { name: 'department', label: 'Department', field: 'department', sortable: true },
    { name: 'actions', label: 'Actions', field: 'actions', sortable: false, align: 'center' as const }
]
const modelhead = ref(null)
const modeldeputyhead = ref(null)
const modeldepartment = ref(null)
async function fetchmajor() {
    loading.value = true
    const res_majors = await api.major.getmajorMajorGet()
        .then(res => res.data)

    const res_departments = await api.department.getdepartmentDepartmentGet()
        .then(res => res.data)

    const res_heads = await api.user.getteacherUserTeacherGet()
        .then(res => res.data)

    const res_deputyheads = await api.user.getteacherUserTeacherGet()
        .then(res => res.data)
        .finally(() => { loading.value = false })
    majors.value = res_majors
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
const departmentOptions = computed(() => {
    return departments.value.map(department => ({
        value: department.id,       // Giá trị sẽ được lưu trong modelteacher
        label: department.name   // Tên hiển thị trong dropdown
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

async function deletemajor(major: Major) {
    if (confirm('Are you sure? This cannot be undone')) {
        loading.value = true
        await api.major.deletemajorMajorIdDeleteDelete(major.id)
            .then(() => {
                majors.value.splice(majors.value.indexOf(major), 1);
            })
            .finally(() => { loading.value = false })
    }
}

async function updatemajor(major: Major) {
    major_value.value.id = major.id
    major_value.value.name = major.name

    if (major.head_id) {
        modelhead.value = {};
        modelhead.value.value = major.head_id
        modelhead.value.label = major.head

    }
    else {
        modelhead.value = null
    }
    if (major.deputy_head_id) {
        modeldeputyhead.value = {}
        modeldeputyhead.value.value = major.deputy_head_id
        modeldeputyhead.value.label = major.deputy_head
    }
    else {
        modeldeputyhead.value = null
    }
    if (major.department_id) {
        modeldepartment.value = {}
        modeldepartment.value.value = major.department_id
        modeldepartment.value.label = major.department
    }
    else {
        modeldepartment.value = null
    }

    prompt.value = true

}

async function editmajor() {

    loading.value = true
    var a: MajorUpdate = {
        name: major_value.value.name,
        createddated: new Date().toISOString(),
        createdby: info.value.fullname || '',
        head_id: modelhead.value ? modelhead.value.value : null,
        deputy_head_id: modeldeputyhead.value ? modeldeputyhead.value.value : null,
        department_id: modeldepartment.value ? modeldepartment.value.value : null
    }

    const res = await api.major.updatemajorMajorIdUpdatePatch(Number(major_value.value.id), a)
    let index = majors.value.findIndex(item => item.id === major_value.value.id);
    majors.value.splice(index, 1)
    majors.value.push(res.data)

    major_value.value = {
        id: 0,
        name: '',
        createddated: new Date().toISOString(),
        createdby: '',
        head_id: 0,
        deputy_head_id: 0,
        department_id: 0

    }
    modelhead.value = null
    modeldeputyhead.value = null
    modeldepartment.value = null
    loading.value = false

}
async function onSubmit() {
    var a: MajorCreate = {
        name: major_value.value.name || '',
        createddated: new Date().toISOString(),
        createdby: info.value.fullname || '',
        head_id: modelhead.value ? modelhead.value.value : null,
        deputy_head_id: modeldeputyhead.value ? modeldeputyhead.value.value : null,
        department_id: modeldepartment.value ? modeldepartment.value.value : null
    }
    const res = await api.major.createmajorMajorPost(a)
        .then(res => res.data).finally(() => { loading.value = false })
    majors.value.push(res)
    major_value.value.name = ''
    modelhead.value = null
    modeldeputyhead.value = null
    modeldepartment.value = null

}
function canceledit() {
    major_value.value.id = 0
    major_value.value.name = ''
    major_value.value.createddated = new Date().toISOString()
    major_value.value.createdby = ''
    major_value.value.head_id = 0
    major_value.value.deputy_head_id = 0
    major_value.value.department_id = 0
    modelhead.value = null
    modeldeputyhead.value = null
    modeldepartment.value = null
}

onMounted(async () => {
    await fetchmajor()
})

</script>