<template>
   <div class="q-pa-md">


<div>

    <q-dialog v-model="prompt" persistent>
        <q-card style="min-width: 350px">
            <q-card-section>
                <div class="text-h6">{{ student }}</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <q-input autofocus  v-model.number="theory" type="number" filled 
                    label="Theory Grade" />

                <q-input autofocus v-model.number="practice" type="number" filled  
                    label="Practice Grade" />

                <q-input autofocus v-model.number="bonus" type="number" filled 
                    label="Bonus Grade" />

            </q-card-section>

            <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel" v-close-popup @click="canceledit" />
                <q-btn flat label="Add" @click="updategrade" v-close-popup />
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
                    <q-btn round icon="edit" @click="edit_grade(props.row)" color="primary" flat />
                </q-td>
            </template>
        </q-table>
    </div>

    <div class="row">
                <div class="col q-gutter-md">
                    
                    <q-btn label="Close" icon="close" type="button" to="../../opencourse" outline
                        text-color="text-color" />
                </div>
            </div>
</template>

<script setup lang="ts">
// import { ref, computed, nextTick, toRaw } from 'vue'
import { ref, computed, onMounted } from 'vue'
import { Enrollment,EnrollmentUpdate } from 'src/services/api'
import { api } from 'src/services/client'
import { useRoute } from 'vue-router'
import { useCurrentuser } from 'src/share/currentuser'
import { it } from 'node:test';
import { NONAME } from 'node:dns';
const route = useRoute()
const currentuser = useCurrentuser()
const info = currentuser.info
const enrollments = ref<Enrollment[]>([])
const tableRef = ref(null)
const loading = ref(false)
const navigationActive = ref(false)
const pagination = ref({})
const selected = ref([])
const prompt = ref(false)
const student = ref('')
const theory = ref(0)
const practice = ref(0)
const bonus = ref(0)
const enrollment_id = ref('')

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



async function fetchenrollment() {
    loading.value = true
    const res_enrollments = await api.opencourse.getopencourseUserOpencourseIdUsersGet(Number(route.params.id))
        .then(res => res.data)
        .finally(() => { loading.value = false })
    enrollments.value=res_enrollments
   
   
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


async function edit_grade(enrollment: Enrollment) {
    prompt.value = true
    enrollment_id.value = String(enrollment.id)
    if (enrollment.student) {
        student.value = enrollment.student
    }
    theory.value = enrollment.grade_theory
    practice.value = enrollment.grade_practice
    bonus.value = enrollment.grade_bonus


}

function calculateGpa(
    theoryScore: number,
    practiceScore: number,
    bonusScore: number,
    theoryWeight: number = 0.5, // Trọng số lý thuyết (mặc định 50%)
    practiceWeight: number = 0.3, // Trọng số thực hành (mặc định 30%)
    bonusWeight: number = 0.2 // Trọng số thưởng (mặc định 20%)
): { totalScore: number, gpa: number } {
    // Tính điểm tổng hợp từ các phần
    const totalScore = (theoryScore * theoryWeight) + (practiceScore * practiceWeight) + (bonusScore * bonusWeight);

    // Quy đổi điểm tổng hợp thành GPA theo thang điểm 4
    let gpa: number;

    if (totalScore >= 9.0) {
        gpa = 4.0;
    } else if (totalScore >= 8.0) {
        gpa = 3.5;
    } else if (totalScore >= 7.0) {
        gpa = 3.0;
    } else if (totalScore >= 6.0) {
        gpa = 2.5;
    } else if (totalScore >= 5.0) {
        gpa = 2.0;
    } else {
        gpa = 1.0;
    }

    return { totalScore, gpa };
}
async function updategrade() {
    loading.value=true
    const { totalScore, gpa } = calculateGpa(theory.value, practice.value, bonus.value);
    
    const a:EnrollmentUpdate={
        createddated: new Date().toISOString(),
        createdby: info.value.fullname || '',
        grade_bonus:bonus.value,
        grade_practice:practice.value,
        grade_theory:theory.value,
        GPA:gpa,
        status:'registering'
    }
   
    const res = await api.enrollment.updateenrollmentEnrollmentIdUpdatePatch(Number(enrollment_id.value),a)
        .then(res => res.data)

    let index = enrollments.value.findIndex(item => item.id === Number(route.params.id));
    enrollments.value.splice(index, 1)
    enrollments.value.push(res)
    enrollment_id.value = ''

    student.value = 'enrollment.student'

    theory.value = 0
    practice.value = 0
    bonus.value = 0
    loading.value=false
}
function canceledit() {
    enrollment_id.value = ''

    student.value = ''

    theory.value = 0
    practice.value = 0
    bonus.value = 0
}
onMounted(async () => {
    await fetchenrollment()
})

</script>