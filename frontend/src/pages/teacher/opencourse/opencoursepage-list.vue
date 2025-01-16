<template>
    
    <div class="q-pa-md">
        <q-table flat bordered ref="tableRef" :class="tableClass" :loading="loading" tabindex="0" title="Open Courses"
            :rows="opencourses" :columns="columns" row-key="id" :selected-rows-label="getSelectedString"
            selection="multiple" v-model:selected="selected" v-model:pagination="pagination" :filter="filter"
            @focusin="activateNavigation" @focusout="deactivateNavigation">
            <template v-slot:body-cell-actions="props">
                <q-td :props="props" auto-width style="min-width: 120px;">
                    <q-btn round icon="visibility" :to="'./opencourse/' + props.row.id + '/viewstudent'"
                        color="primary" flat />
                </q-td>
            </template>
            <template v-slot:body-cell-is_open="props">
                <q-td :props="props">
                    <div>
                        <q-badge :color="props.row.is_open ? 'green' : 'grey'"/>
                    </div>
                </q-td>
            </template>
        </q-table>
    </div>
</template>

<script setup lang="ts">
// import { ref, computed, nextTick, toRaw } from 'vue'
import { ref, computed, onMounted } from 'vue'
import { Opencourse,OpencourseCreate,OpencourseUpdate,Course,Account,Semester,Classroom,UserSelected } from 'src/services/api'
import { api } from 'src/services/client'
import { useCurrentuser } from 'src/share/currentuser'
const currentuser = useCurrentuser()
const info = currentuser.info
const opencourses = ref<Opencourse[]>([])
const tableRef = ref(null)
const loading = ref(false)
const navigationActive = ref(false)
const pagination = ref({})
const selected = ref([])



const filter = ref('')
const columns = [
    { name: 'id', label: 'ID', field: 'id', sortable: true },
    { name: 'course', label: 'Course', field: 'course', sortable: true },
    { name: 'capacity', label: 'Capacity', field: 'capacity', sortable: true },
    { name: 'instructor_theory', label: 'Instructor theory', field: 'instructor_theory', sortable: true },
    {name: 'instructor_practice', label: 'Instructor practice', field: 'instructor_practice', sortable: true },
    {name: 'semester', label: 'Semester', field: 'semester', sortable: true },
    {name: 'classroom', label: 'Classroom', field: 'classroom', sortable: true },
    {name: 'timetheory', label: 'Time theory', field: 'timetheory', sortable: true },
    {name: 'timepractice', label: 'Time practice', field: 'timepractice', sortable: true },
    {name: 'status', label: 'Status', field: 'status', sortable: true },
    {name: 'number_of_student', label: 'Number Student', field: 'number_of_student', sortable: true },
    { name: 'createddated', label: 'Created date', field: 'createddated', sortable: true },
    { name: 'createdby', label: 'created by', field: 'createdby', sortable: true },
    {name: 'is_open', label: 'Is open', field: 'is_open', sortable: true },
    { name: 'actions', label: 'Actions', field: 'actions', sortable: false, align: 'center' as const }
]

async function fetchopencourse() {
   
    loading.value = true
    
    const res_opencourses = await api.opencourse.getopencourseTeacherOpencourseTeacherGet()
        .then(res => res.data)
        .finally(() => { loading.value = false })
    opencourses.value = res_opencourses
    
}


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




onMounted(async () => {
    await fetchopencourse()
})

</script>