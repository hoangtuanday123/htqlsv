<template>
    <div class="q-pa-md">


        <div>

            <q-dialog v-model="prompt" persistent>
                <q-card style="min-width: 350px">
                    <q-card-section>
                        <div class="text-h6">{{ enrollment_course }}</div>
                    </q-card-section>

                    <q-card-section class="q-pt-none">
                        <q-select v-model="modelstudent" :options="studentOptions" label="Student">
                            <template v-slot:append>
                                <q-icon name="close" @click.stop.prevent="modelstudent = null" class="cursor-pointer" />
                            </template>
                        </q-select>

                    </q-card-section>

                    <q-card-actions align="right" class="text-primary">
                        <q-btn flat label="Cancel" v-close-popup @click="canceledit" />
                        <q-btn flat label="Add" @click="addenrollment" v-close-popup />
                    </q-card-actions>
                </q-card>
            </q-dialog>

        </div>
    </div>

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
                    <q-btn round icon="add" @click="resgiter(props.row)" color="primary" flat />
                    <!-- <q-btn round icon="delete" color="red" class="q-ml-sm" @click="deleteopencourse(props.row)" flat /> -->
                </q-td>
            </template>

        </q-table>
    </div>
</template>

<script setup lang="ts">
// import { ref, computed, nextTick, toRaw } from 'vue'
import { ref, computed, onMounted } from 'vue'
import { Enrollment, UserSelected, Opencourse, EnrollmentCreate } from '../../../services/api'
import { api } from '../../../services/client'
import { useCurrentuser } from '../../../share/currentuser'

const currentuser = useCurrentuser()
const info = currentuser.info
const enrollments = ref<Enrollment[]>([])
const students = ref<UserSelected[]>([])
const opencourses = ref<Opencourse[]>([])
const tableRef = ref(null)
const loading = ref(false)
const navigationActive = ref(false)
const pagination = ref({})
const selected = ref([])
const modelstudent = ref(null)
const enrollment_course = ref<string>('')
const opencourse_id = ref('')
const prompt = ref(false)
const studentOptions = computed(() => {
    return students.value.map(student => ({
        value: student.id,       // Giá trị sẽ được lưu trong modelteacher
        label: student.fullname   // Tên hiển thị trong dropdown
    }));
});

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
    { name: 'instructor_practice', label: 'Instructor practice', field: 'instructor_practice', sortable: true },
    { name: 'semester', label: 'Semester', field: 'semester', sortable: true },
    { name: 'classroom', label: 'Classroom', field: 'classroom', sortable: true },
    { name: 'timetheory', label: 'Time theory', field: 'timetheory', sortable: true },
    { name: 'timepractice', label: 'Time practice', field: 'timepractice', sortable: true },
    { name: 'status', label: 'Status', field: 'status', sortable: true },
    { name: 'createddated', label: 'Created date', field: 'createddated', sortable: true },
    { name: 'createdby', label: 'created by', field: 'createdby', sortable: true },
    { name: 'number_of_student', label: 'Number Student', field: 'number_of_student', sortable: true },
    { name: 'is_open', label: 'Is open', field: 'is_open', sortable: true },
    { name: 'actions', label: 'Actions', field: 'actions', sortable: false, align: 'center' as const }
]

async function fetchenrollment() {
    loading.value = true
    const res_courses = await api.enrollment.getenrollmentEnrollmentGet()
        .then(res => res.data)
    const res_students = await api.user.getteacherUserStudentGet()
        .then(res => res.data)
    const res_opencourse_open = await api.opencourse.getopencourseOpenOpencourseOpenGet()
        .then(res => res.data)
        .finally(() => { loading.value = false })
    enrollments.value = res_courses
    students.value = res_students
    opencourses.value = res_opencourse_open

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

async function deleteenrollment(enrollment: Enrollment) {
    if (confirm('Are you sure? This cannot be undone')) {
        loading.value = true
        const result = await api.enrollment.deleteenrollmentEnrollmentIdDeleteDelete(enrollment.id)
            .then(res => res.data)

        if (result > 0) {
            enrollments.value.splice(enrollments.value.indexOf(enrollment), 1);
            const res_opencourse = await api.opencourse.decreasedopencourseOpencourseIdDecreasedPatch(Number(enrollment.open_course_id))
                .then(res => res.data)
            let index = opencourses.value.findIndex(item => item.id === Number(enrollment.open_course_id));
            opencourses.value.splice(index, 1)
            opencourses.value.push(res_opencourse)
        }
        loading.value = false

    }

}
async function resgiter(opencourse: Opencourse) {
    prompt.value = true
    if (opencourse.course != null) {
        enrollment_course.value = opencourse.course;
        opencourse_id.value = String(opencourse.id)
    }

}
async function addenrollment() {
    loading.value = true

    const a: EnrollmentCreate = {
        createddated: new Date().toISOString(),
        createdby: info.value.fullname || '',
        grade_bonus: 0,
        grade_practice: 0,
        grade_theory: 0,
        GPA: 0,
        status: 'registering',
        student_id: Number(modelstudent.value.value),
        open_course_id: Number(opencourse_id.value)
    }
    const res = await api.enrollment.registerenrollmentEnrollmentPost(a)
        .then(res => res.data)
        .catch(error => {
            if (error.response)
                console.log('Error: ' + error.response?.data?.detail)
            else
                console.log('Unknown error occured')
        })
    if (res) {
        const res_opencourse = await api.opencourse.increasedopencourseOpencourseIdIncreasedPatch(Number(opencourse_id.value))
            .then(res => res.data)
        let index = opencourses.value.findIndex(item => item.id === Number(opencourse_id.value));
        opencourses.value.splice(index, 1)
        opencourses.value.push(res_opencourse)



        enrollments.value.push(res)
        modelstudent.value = null;
        enrollment_course.value = '';
        opencourse_id.value = '';
        loading.value = false

    }

}
function canceledit() {
    modelstudent.value = null;
    enrollment_course.value = '';
    opencourse_id.value = '';
}
onMounted(async () => {
    await fetchenrollment()
})

</script>