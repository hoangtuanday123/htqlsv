<template>
    <div class="q-pa-md">

        <q-btn push color="primary" label="Create">
            <q-popup-proxy>
                <q-banner>
                    <q-form @submit="onSubmit" class="q-gutter-md">
                        <q-input filled v-model="course_value.name" label="Course name *" hint="course name" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Please type something']" />
                        <q-input filled v-model="course_value.credit" label="Credit *" hint="credit" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Please type something']" />
                        <q-select v-model="modelmajor" :options="majorOptions" label="Major">
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
                        <div class="text-h6">Course</div>
                    </q-card-section>

                    <q-card-section class="q-pt-none">
                        <q-input dense v-model="course_value.name" autofocus @keyup.enter="prompt = false" />
                        <q-input dense v-model="course_value.credit" autofocus @keyup.enter="prompt = false" />
                        <q-select v-model="modelmajor" :options="majorOptions" label="Teacher">
                            <template v-slot:append>
                                <q-icon name="close" @click.stop.prevent="modelmajor = null" class="cursor-pointer" />
                            </template>
                        </q-select>

                    </q-card-section>

                    <q-card-actions align="right" class="text-primary">
                        <q-btn flat label="Cancel" v-close-popup @click="canceledit" />
                        <q-btn flat label="Edit" @click="editcourse" v-close-popup />
                    </q-card-actions>
                </q-card>
            </q-dialog>

        </div>
    </div>

    <div class="q-pa-md">
        <q-table flat bordered ref="tableRef" :class="tableClass" :loading="loading" tabindex="0" title="Courses"
            :rows="courses" :columns="columns" row-key="id" :selected-rows-label="getSelectedString"
            selection="multiple" v-model:selected="selected" v-model:pagination="pagination" :filter="filter"
            @focusin="activateNavigation" @focusout="deactivateNavigation">
            <template v-slot:body-cell-actions="props">
                <q-td :props="props" auto-width style="min-width: 120px;">
                    <q-btn round icon="edit" @click="updatecourse(props.row)" color="primary" flat />
                    <q-btn round icon="delete" color="red" class="q-ml-sm" @click="deleteclass(props.row)" flat />
                </q-td>
            </template>
        </q-table>
    </div>
</template>

<script setup lang="ts">
// import { ref, computed, nextTick, toRaw } from 'vue'
import { ref, computed, onMounted } from 'vue'
import { Course, Major, CourseCreate, CourseUpdate } from '../../../services/api'
import { api } from '../../../services/client'
import { useCurrentuser } from '../../../share/currentuser'
const currentuser = useCurrentuser()
const info = currentuser.info
const courses = ref<Course[]>([])
const majors = ref<Major[]>([])

const tableRef = ref(null)
const loading = ref(false)
const navigationActive = ref(false)
const pagination = ref({})
const selected = ref([])

const course_value = ref<Course>({
    id: 0,
    name: '',
    credit: 0,
    totalprice: 0,
    createddated: new Date().toISOString(),
    createdby: '',
    major_id: 0

})
const prompt = ref(false)


const filter = ref('')
const columns = [
    { name: 'id', label: 'ID', field: 'id', sortable: true },
    { name: 'name', label: 'Course name', field: 'name', sortable: true },
    { name: 'credit', label: 'Credit', field: 'credit', sortable: true },
    { name: 'totalprice', label: 'Total Price', field: 'totalprice', sortable: true },
    { name: 'createddated', label: 'Created date', field: 'createddated', sortable: true },
    { name: 'createdby', label: 'created by', field: 'createdby', sortable: true },
    { name: 'major', label: 'Major', field: 'major', sortable: true },
    { name: 'actions', label: 'Actions', field: 'actions', sortable: false, align: 'center' as const }
]

const modelmajor = ref(null)
async function fetchcourse() {
    loading.value = true
    const res_courses = await api.course.getcourseCourseGet()
        .then(res => res.data)
    const res_major = await api.major.getmajorMajorGet()
        .then(res => res.data)
        .finally(() => { loading.value = false })

    courses.value = res_courses;
    majors.value = res_major

}

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

async function deleteclass(course: Course) {
    if (confirm('Are you sure? This cannot be undone')) {
        loading.value = true
        await api.course.updatecourseCourseIdDeleteDelete(course.id)
            .then(() => {
                courses.value.splice(courses.value.indexOf(course), 1);
            })
            .finally(() => { loading.value = false })
    }
}

async function updatecourse(course: Course) {
    course_value.value.id = course.id
    course_value.value.credit = course.credit
    course_value.value.createddated = course.createddated
    course_value.value.name = course.name
    course_value.value.createdby = course.createdby

    if (course.major_id) {
        modelmajor.value = {};
        modelmajor.value.value = course.major_id
        modelmajor.value.label = course.major

    }
    else {
        modelmajor.value = null
    }


    prompt.value = true

}

async function editcourse() {

    loading.value = true
    var totalprice = course_value.value.credit * 1000000
    var a: CourseUpdate = {
        name: course_value.value.name,
        credit: course_value.value.credit,
        totalprice: totalprice,
        createddated: new Date().toISOString(),
        createdby: info.value.fullname || '',
        major_id: modelmajor.value ? modelmajor.value.value : null,

    }

    const res = await api.course.updatecourseCourseIdUpdatePatch(Number(course_value.value.id), a)
    let index = courses.value.findIndex(item => item.id === course_value.value.id);
    courses.value.splice(index, 1)
    courses.value.push(res.data)
    console.log(res.data)
    course_value.value = {
        id: 0,
        name: '',
        credit: 0,
        totalprice: 0,
        createddated: new Date().toISOString(),
        createdby: '',
        major_id: 0

    }
    modelmajor.value = null

    loading.value = false

}
async function onSubmit() {
    var totalprice = course_value.value.credit * 1000000
    var a: CourseCreate = {
        name: course_value.value.name || '',
        credit: course_value.value.credit || 0,
        totalprice: totalprice,
        createddated: new Date().toISOString(),
        createdby: info.value.fullname || '',
        major_id: modelmajor.value ? modelmajor.value.value : null,

    }
    const res = await api.course.createcourseCoursePost(a)
        .then(res => res.data).finally(() => { loading.value = false })
    courses.value.push(res)
    course_value.value.name = ''
    course_value.value.credit = 0
    course_value.value.totalprice = 0
    modelmajor.value = null


}
function canceledit() {
    course_value.value.id = 0
    course_value.value.name = ''
    course_value.value.credit = 0
    course_value.value.createddated = new Date().toISOString()
    course_value.value.createdby = ''
    course_value.value.major_id = 0
    modelmajor.value = null
}

onMounted(async () => {
    await fetchcourse()
})

</script>