<template>

    <div class="q-pa-md">
        <q-table flat bordered ref="tableRef" :class="tableClass" :loading="loading" tabindex="0" title="Enrollments"
            :rows="enrollments" :columns="Enrollmentcolumns" row-key="id" :selected-rows-label="getSelectedString"
            selection="multiple" v-model:selected="selected" v-model:pagination="pagination" :filter="filter"
            @focusin="activateNavigation" @focusout="deactivateNavigation">
            <template v-slot:body-cell-actions="props">
                <q-td :props="props" auto-width style="min-width: 120px;">
                    <q-btn round icon="delete" color="red" class="q-ml-sm" @click="deleteenrollment(props.row)" flat />
                </q-td>
            </template>
        </q-table>
    </div>

    <div class="q-pa-md">
        <q-table flat bordered ref="tableRef" :class="tableClass" :loading="loading" tabindex="0" title="Open Courses"
            :rows="opencourses" :columns="Opencoursecolumns" row-key="id" :selected-rows-label="getSelectedString"
            selection="multiple" v-model:selected="selected" v-model:pagination="pagination" :filter="filter"
            @focusin="activateNavigation" @focusout="deactivateNavigation">
            <template v-slot:body-cell-actions="props">
                <q-td :props="props" auto-width style="min-width: 120px;">
                    <q-btn round icon="add" @click="addenrollment(props.row)" color="primary" flat />
                    
                </q-td>
            </template>
            
        </q-table>
    </div>
</template>

<script setup lang="ts">
// import { ref, computed, nextTick, toRaw } from 'vue'
import { ref, computed, onMounted } from 'vue'
import { Enrollment,Account,UserSelected,Opencourse, EnrollmentCreate } from 'src/services/api'
import { api } from 'src/services/client'
import { useCurrentuser } from 'src/share/currentuser'
import { it } from 'node:test';
import { NONAME } from 'node:dns';
const currentuser = useCurrentuser()
const info = currentuser.info
const enrollments = ref<Enrollment[]>([])

const opencourses=ref<Opencourse[]>([])
const tableRef = ref(null)
const loading = ref(false)
const navigationActive = ref(false)
const pagination = ref({})
const selected = ref([])

const prompt = ref(false)


const filter = ref('')
const Enrollmentcolumns = [
    { name: 'id', label: 'ID', field: 'id', sortable: true },
    { name: 'course', label: 'Course name', field: 'course', sortable: true },
    { name: 'student', label: 'Student', field: 'student', sortable: true },
    { name: 'instructor_theory', label: 'Instructor Theory', field: 'instructor_theory', sortable: true },
    { name: 'instructor_practice', label: 'Instructor Practice', field: 'instructor_practice', sortable: true },
    { name: 'semester', label: 'Semester', field: 'semester', sortable: true },
    { name: 'classroom', label: 'Classroom', field: 'classroom', sortable: true },
    { name: 'timetheory', label: 'Timetheory', field: 'timetheory', sortable: true },
    { name: 'timepractice', label: 'Timepractice', field: 'timepractice', sortable: true },
    { name: 'grade_theory', label: 'Grade Theory', field: 'grade_theory', sortable: true },
    { name: 'grade_practice', label: 'Grade Practice', field: 'grade_practice', sortable: true },
    { name: 'grade_bonus', label: 'Grade Bonus', field: 'grade_bonus', sortable: true },
    { name: 'GPA', label: 'GPA', field: 'GPA', sortable: true },
    { name: 'createddated', label: 'Created date', field: 'createddated', sortable: true },
    { name: 'createdby', label: 'created by', field: 'createdby', sortable: true },
    { name: 'status', label: 'Status', field: 'status', sortable: true },
    { name: 'actions', label: 'Actions', field: 'actions', sortable: false, align: 'center' as const }
]

const Opencoursecolumns = [
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
    { name: 'createddated', label: 'Created date', field: 'createddated', sortable: true },
    { name: 'createdby', label: 'created by', field: 'createdby', sortable: true },
    {name: 'number_of_student', label: 'Number Student', field: 'number_of_student', sortable: true },
    {name: 'is_open', label: 'Is open', field: 'is_open', sortable: true },
    { name: 'actions', label: 'Actions', field: 'actions', sortable: false, align: 'center' as const }
]

async function fetchenrollment() {
    loading.value = true
    const res_courses = await api.enrollment.getenrollmentStudentEnrollmentStudentGet()
        .then(res => res.data)
   
    const res_opencourse_open=await api.opencourse.getopencourseOpenOpencourseOpenGet()
    .then(res=>res.data)
        .finally(() => { loading.value = false })
    enrollments.value=res_courses
   
    opencourses.value=res_opencourse_open
   
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

async function deleteenrollment(enrollment:Enrollment) {
    if (confirm('Are you sure? This cannot be undone')) {
        loading.value = true
        const result=await api.enrollment.deleteenrollmentEnrollmentIdDeleteDelete(enrollment.id)
            .then(res => res.data)
      
        if( result>0){
                enrollments.value.splice(enrollments.value.indexOf(enrollment), 1);
                const res_opencourse=await api.opencourse.decreasedopencourseOpencourseIdDecreasedPatch(Number(enrollment.open_course_id))
                .then(res=>res.data)
                let index = opencourses.value.findIndex(item => item.id === Number(enrollment.open_course_id));
                opencourses.value.splice(index, 1)
                opencourses.value.push(res_opencourse)
            }
        loading.value=false  
            
    }

}

async function addenrollment(opencourse:Opencourse) {
    loading.value=true
    
    const a:EnrollmentCreate={
        createddated: new Date().toISOString(),
        createdby: info.value.fullname || '',
        grade_bonus:0,
        grade_practice:0,
        grade_theory:0,
        GPA:0,
        status:'registering',
        student_id:Number(info.value.id),
        open_course_id:Number(opencourse.id)
    }
    const res = await api.enrollment.registerenrollmentEnrollmentPost(a)
        .then(res => res.data)
    const res_opencourse=await api.opencourse.increasedopencourseOpencourseIdIncreasedPatch(Number(opencourse.id))
    .then(res=>res.data)
    let index = opencourses.value.findIndex(item => item.id === Number(opencourse.id));
    opencourses.value.splice(index, 1)
    opencourses.value.push(res_opencourse)
    
    
    
    enrollments.value.push(res);
    loading.value=false
}

onMounted(async () => {
    await fetchenrollment()
})

</script>