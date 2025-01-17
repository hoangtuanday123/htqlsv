<template>
    <div class="q-pa-md">

        <q-btn push color="primary" label="Create">

            <q-popup-proxy>
                <q-banner>
                    <q-form @submit="onSubmit" class="q-gutter-md">
                        <q-input filled v-model="opencourse_value.capacity" label="Capacity *" hint="capacity"
                            lazy-rules :rules="[val => val && val.length > 0 || 'Please type something']" />
                        <q-input filled v-model="opencourse_value.timetheory" label="Time theory *"
                            hint="time theory" />
                        <q-input filled v-model="opencourse_value.timepractice" label="Time practice *"
                            hint="time practice" />
                        <q-select v-model="modelcourse" :options="courseOptions" label="Course">

                            <template v-slot:append>
                                <q-icon name="close" @click.stop.prevent="modelcourse = null" class="cursor-pointer" />
                            </template>


                        </q-select>
                        <q-select v-model="modeltheory" :options="theoryOptions" label="Instructor Theory">
                            <template v-slot:append>
                                <q-icon name="close" @click.stop.prevent="modeltheory = null" class="cursor-pointer" />
                            </template>
                        </q-select>
                        <q-select v-model="modelpractice" :options="practiceOptions" label="Instructor practice">
                            <template v-slot:append>
                                <q-icon name="close" @click.stop.prevent="modelpractice = null"
                                    class="cursor-pointer" />
                            </template>
                        </q-select>
                        <q-select v-model="modelsemester" :options="semesterOptions" label="Semester">
                            <template v-slot:append>
                                <q-icon name="close" @click.stop.prevent="modelsemester = null"
                                    class="cursor-pointer" />
                            </template>
                        </q-select>
                        <q-select v-model="modelclassroom" :options="classroomOptions" label="Classroom">
                            <template v-slot:append>
                                <q-icon name="close" @click.stop.prevent="modelclassroom = null"
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
                        <div class="text-h6">Open course</div>
                    </q-card-section>

                    <q-card-section class="q-pt-none">
                        <q-input filled v-model="opencourse_value.capacity" label="Capacity *" hint="capacity"
                            lazy-rules :rules="[val => val && val.length > 0 || 'Please type something']" />
                        <q-input filled v-model="opencourse_value.timetheory" label="Time theory *"
                            hint="time theory" />
                        <q-input filled v-model="opencourse_value.timepractice" label="Time practice *"
                            hint="time practice" />
                        <q-select v-model="modelcourse" :options="courseOptions" label="Course">

                            <template v-slot:append>
                                <q-icon name="close" @click.stop.prevent="modelcourse = null" class="cursor-pointer" />
                            </template>


                        </q-select>
                        <q-select v-model="modeltheory" :options="theoryOptions" label="Instructor Theory">
                            <template v-slot:append>
                                <q-icon name="close" @click.stop.prevent="modeltheory = null" class="cursor-pointer" />
                            </template>
                        </q-select>
                        <q-select v-model="modelpractice" :options="practiceOptions" label="Instructor practice">
                            <template v-slot:append>
                                <q-icon name="close" @click.stop.prevent="modelpractice = null"
                                    class="cursor-pointer" />
                            </template>
                        </q-select>
                        <q-select v-model="modelsemester" :options="semesterOptions" label="Semester">
                            <template v-slot:append>
                                <q-icon name="close" @click.stop.prevent="modelsemester = null"
                                    class="cursor-pointer" />
                            </template>
                        </q-select>
                        <q-select v-model="modelclassroom" :options="classroomOptions" label="Classroom">
                            <template v-slot:append>
                                <q-icon name="close" @click.stop.prevent="modelclassroom = null"
                                    class="cursor-pointer" />
                            </template>
                        </q-select>
                        <q-checkbox v-model="opencourse_value.is_open" label="Is Open" />
                        <q-checkbox v-model="opencourse_value.is_end" label="Is End" />
                    </q-card-section>

                    <q-card-actions align="right" class="text-primary">
                        <q-btn flat label="Cancel" v-close-popup @click="canceledit" />
                        <q-btn flat label="Edit" @click="editopencourse" v-close-popup />
                    </q-card-actions>
                </q-card>
            </q-dialog>

        </div>
    </div>

    <div class="q-pa-md">
        <q-table flat bordered ref="tableRef" :class="tableClass" :loading="loading" tabindex="0" title="Open Courses"
            :rows="opencourses" :columns="columns" row-key="id" :selected-rows-label="getSelectedString"
            selection="multiple" v-model:selected="selected" v-model:pagination="pagination" :filter="filter"
            @focusin="activateNavigation" @focusout="deactivateNavigation">
            <template v-slot:body-cell-actions="props">
                <q-td :props="props" auto-width style="min-width: 120px;">
                    <q-btn round icon="visibility" :to="'./opencourse/' + props.row.id + '/viewstudent'" color="primary"
                        flat />
                    <q-btn round icon="edit" @click="updateopencourse(props.row)" color="primary" flat />
                    <q-btn round icon="delete" color="red" class="q-ml-sm" @click="deleteopencourse(props.row)" flat />
                </q-td>
            </template>
            <template v-slot:body-cell-is_open="props">
                <q-td :props="props">
                    <div>
                        <q-badge :color="props.row.is_open ? 'green' : 'grey'" />
                    </div>
                </q-td>
            </template>
            <template v-slot:body-cell-is_end="props">
                <q-td :props="props">
                    <div>
                        <q-badge :color="props.row.is_end ? 'green' : 'grey'" />
                    </div>
                </q-td>
            </template>
        </q-table>
    </div>
</template>

<script setup lang="ts">
// import { ref, computed, nextTick, toRaw } from 'vue'
import { ref, computed, onMounted } from 'vue'
import { Opencourse, OpencourseCreate, Course, Semester, Classroom, UserSelected } from '../../../services/api'
import { api } from '../../../services/client'
import { useCurrentuser } from '../../../share/currentuser'
const currentuser = useCurrentuser()
const info = currentuser.info
const opencourses = ref<Opencourse[]>([])
const courses = ref<Course[]>([])
const theorys = ref<UserSelected[]>([])
const practices = ref<UserSelected[]>([])
const semesters = ref<Semester[]>([])
const classrooms = ref<Classroom[]>([])
const tableRef = ref(null)
const loading = ref(false)
const navigationActive = ref(false)
const pagination = ref({})
const selected = ref([])

const opencourse_value = ref<Opencourse>({
    id: 0,
    createddated: new Date().toISOString(),
    createdby: '',
    capacity: 0,
    timetheory: '',
    timepractice: '',
    status: '',
    is_open: false,
    is_end: false,
    course_id: 0,
    instructor_theory_id: 0,
    instructor_practice_id: 0,
    semester_id: 0,
    classroom_id: 0,

})
const prompt = ref(false)


const filter = ref('')
const columns = [
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
    { name: 'number_of_student', label: 'Number Student', field: 'number_of_student', sortable: true },
    { name: 'createddated', label: 'Created date', field: 'createddated', sortable: true },
    { name: 'createdby', label: 'created by', field: 'createdby', sortable: true },
    { name: 'is_open', label: 'Is open', field: 'is_open', sortable: true },
    { name: 'is_end', label: 'Is end', field: 'is_end', sortable: true },
    { name: 'actions', label: 'Actions', field: 'actions', sortable: false, align: 'center' as const }
]
const modelcourse = ref(null)
const modeltheory = ref(null)
const modelpractice = ref(null)
const modelsemester = ref(null)
const modelclassroom = ref(null)
async function fetchopencourse() {
    loading.value = true
    const res_opencourses = await api.opencourse.getopencourseOpencourseGet()
        .then(res => res.data)

    const res_courses = await api.course.getcourseCourseGet()
        .then(res => res.data)

    const res_theories = await api.user.getteacherUserTeacherGet()
        .then(res => res.data)
    const res_practices = await api.user.getteacherUserTeacherGet()
        .then(res => res.data)
    const res_semesters = await api.semester.getsemesterSemesterGet()
        .then(res => res.data)

    const res_classrooms = await api.classroom.getclassroomClassroomGet()
        .then(res => res.data)
        .finally(() => { loading.value = false })
    opencourses.value = res_opencourses
    courses.value = res_courses
    theorys.value = res_theories
    practices.value = res_practices
    semesters.value = res_semesters
    classrooms.value = res_classrooms

}
const courseOptions = computed(() => {
    return courses.value.map(course => ({
        value: course.id,       // Giá trị sẽ được lưu trong modelteacher
        label: course.name   // Tên hiển thị trong dropdown
    }));
});

const theoryOptions = computed(() => {
    return theorys.value.map(theory => ({
        value: theory.id,       // Giá trị sẽ được lưu trong modelteacher
        label: theory.fullname   // Tên hiển thị trong dropdown
    }));
});

const practiceOptions = computed(() => {
    return practices.value.map(practice => ({
        value: practice.id,       // Giá trị sẽ được lưu trong modelteacher
        label: practice.fullname   // Tên hiển thị trong dropdown
    }));
});

const semesterOptions = computed(() => {
    return semesters.value.map(semester => ({
        value: semester.id,       // Giá trị sẽ được lưu trong modelteacher
        label: semester.semester   // Tên hiển thị trong dropdown
    }));
});

const classroomOptions = computed(() => {
    return classrooms.value.map(classroom => ({
        value: classroom.id,       // Giá trị sẽ được lưu trong modelteacher
        label: classroom.name   // Tên hiển thị trong dropdown
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

async function deleteopencourse(opencourse: Opencourse) {
    if (confirm('Are you sure? This cannot be undone')) {
        loading.value = true
        await api.opencourse.deleteopencourseOpencourseIdDeleteDelete(opencourse.id)
            .then(() => {
                opencourses.value.splice(opencourses.value.indexOf(opencourse), 1);
            })
            .finally(() => { loading.value = false })
    }
}

async function updateopencourse(opencourse: Opencourse) {
    opencourse_value.value.id = opencourse.id
    opencourse_value.value.capacity = opencourse.capacity
    opencourse_value.value.timetheory = opencourse.timetheory
    opencourse_value.value.timepractice = opencourse.timepractice
    opencourse_value.value.is_open = opencourse.is_open
    opencourse_value.value.is_end = opencourse.is_end
    if (opencourse.course_id) {
        modelcourse.value = {};
        modelcourse.value.value = opencourse.course_id
        modelcourse.value.label = opencourse.course

    }
    else {
        modelcourse.value = null
    }
    if (opencourse.instructor_theory_id) {
        modeltheory.value = {}
        modeltheory.value.value = opencourse.instructor_theory_id
        modeltheory.value.label = opencourse.instructor_theory
    }
    else {
        modeltheory.value = null
    }
    if (opencourse.instructor_practice_id) {
        modelpractice.value = {}
        modelpractice.value.value = opencourse.instructor_practice_id
        modelpractice.value.label = opencourse.instructor_practice
    }
    else {
        modelpractice.value = null
    }
    if (opencourse.semester_id) {
        modelsemester.value = {}
        modelsemester.value.value = opencourse.semester_id
        modelsemester.value.label = opencourse.semester
    }
    else {
        modelsemester.value = null
    }
    if (opencourse.classroom_id) {
        modelclassroom.value = {}
        modelclassroom.value.value = opencourse.classroom_id
        modelclassroom.value.label = opencourse.classroom
    }
    else {
        modelclassroom.value = null
    }

    prompt.value = true

}

async function editopencourse() {

    loading.value = true
    var a: OpencourseCreate = {
        capacity: opencourse_value.value.capacity,
        timetheory: opencourse_value.value.timetheory,
        timepractice: opencourse_value.value.timepractice,
        createddated: new Date().toISOString(),
        createdby: info.value.fullname || '',
        is_open: opencourse_value.value.is_open,
        is_end: opencourse_value.value.is_end,
        course_id: modelcourse.value.value,
        instructor_theory_id: modeltheory.value ? modeltheory.value.value : null,
        instructor_practice_id: modelpractice.value ? modelpractice.value.value : null,
        semester_id: modelsemester.value ? modelsemester.value.value : null,
        classroom_id: modelclassroom.value ? modelclassroom.value.value : null,
        status: ''
    }

    const res = await api.opencourse.updateopencourseOpencourseIdUpdatePatch(Number(opencourse_value.value.id), a)
    let index = opencourses.value.findIndex(item => item.id === opencourse_value.value.id);
    opencourses.value.splice(index, 1)
    opencourses.value.push(res.data)

    opencourse_value.value = {
        id: 0,
        createddated: new Date().toISOString(),
        createdby: '',
        capacity: 0,
        timetheory: '',
        timepractice: '',
        status: '',
        is_open: false,
        is_end: false,
        course_id: 0,
        instructor_theory_id: 0,
        instructor_practice_id: 0,
        semester_id: 0,
        classroom_id: 0,

    }
    modelcourse.value = null
    modeltheory.value = null
    modelpractice.value = null
    modelsemester.value = null
    modelclassroom.value = null
    loading.value = false

}
async function onSubmit() {
    var a: OpencourseCreate = {
        capacity: opencourse_value.value.capacity || 0,
        timetheory: opencourse_value.value.timetheory || '',
        timepractice: opencourse_value.value.timepractice || '',
        createddated: new Date().toISOString(),
        createdby: info.value.fullname || '',
        status: 'created',
        is_open: false,
        is_end: false,
        course_id: modelcourse.value.value,
        instructor_theory_id: modeltheory.value ? modeltheory.value.value : null,
        instructor_practice_id: modelpractice.value ? modelpractice.value.value : null,
        semester_id: modelsemester.value ? modelsemester.value.value : null,
        classroom_id: modelclassroom.value ? modelclassroom.value.value : null,
    }
    console.log(a)
    const res = await api.opencourse.createopencourseOpencoursePost(a)
        .then(res => res.data).finally(() => { loading.value = false })
    opencourses.value.push(res)
    opencourse_value.value.capacity = 0
    opencourse_value.value.timetheory = ''
    opencourse_value.value.timepractice = ''
    modelcourse.value = null
    modeltheory.value = null
    modelpractice.value = null
    modelsemester.value = null
    modelclassroom.value = null

}
function canceledit() {
    opencourse_value.value.id = 0
    opencourse_value.value.capacity = 0
    opencourse_value.value.timetheory = ''
    opencourse_value.value.timepractice = ''
    opencourse_value.value.is_open = false
    opencourse_value.value.createddated = new Date().toISOString()
    opencourse_value.value.createdby = ''
    opencourse_value.value.course_id = 0
    opencourse_value.value.instructor_theory_id = 0
    opencourse_value.value.instructor_practice_id = 0
    opencourse_value.value.semester_id = 0
    opencourse_value.value.classroom_id = 0
    modelcourse.value = null
    modeltheory.value = null
    modelpractice.value = null
    modelsemester.value = null
    modelclassroom.value = null
}

onMounted(async () => {
    await fetchopencourse()
})

</script>