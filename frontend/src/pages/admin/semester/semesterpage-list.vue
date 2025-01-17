<template>
  <div class="q-pa-md">

    <q-btn push color="primary" label="Create">

      <q-popup-proxy>
        <q-banner>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input filled v-model="semester_value.semester" label="Semester *" hint="semester" lazy-rules
              :rules="[val => val && val.length > 0 || 'Please type something']" />
            <div>
              <q-btn label="Submit" type="submit" color="primary" />

            </div>
          </q-form>
        </q-banner>
      </q-popup-proxy>

    </q-btn>
    <div>
      <!-- <q-btn label="Prompt" color="primary" @click="prompt = true" /> -->
      <q-dialog v-model="prompt" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Semester</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input dense v-model="semester_value.semester" autofocus @keyup.enter="prompt = false" />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup @click="canceledit" />
            <q-btn flat label="Edit" @click="editsemester" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

    </div>
  </div>

  <div class="q-pa-md">
    <q-table flat bordered ref="tableRef" :class="tableClass" :loading="loading" tabindex="0" title="Semesters"
      :rows="semesters" :columns="columns" row-key="id" :selected-rows-label="getSelectedString" selection="multiple"
      v-model:selected="selected" v-model:pagination="pagination" :filter="filter" @focusin="activateNavigation"
      @focusout="deactivateNavigation">
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" auto-width style="min-width: 120px;">
          <q-btn round icon="edit" @click="updatesemester(props.row)" color="primary" flat />
          <q-btn round icon="delete" color="red" class="q-ml-sm" @click="deletesemester(props.row)" flat />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
// import { ref, computed, nextTick, toRaw } from 'vue'
import { ref, computed, onMounted } from 'vue'
import { Semester, SemesterCreate, SemesterUpdate } from '../../../services/api'
import { api } from '../../../services/client'
import { useCurrentuser } from '../../../share/currentuser'
const currentuser = useCurrentuser()
const info = currentuser.info
const semesters = ref<Semester[]>([])
const tableRef = ref(null)
const loading = ref(false)
const navigationActive = ref(false)
const pagination = ref({})
const selected = ref([])
const semester_value = ref<Semester>({
  id: 0,
  semester: '',
  createddated: new Date().toISOString(),
  createdby: ''

})
const prompt = ref(false)


const filter = ref('')
const columns = [
  { name: 'id', label: 'ID', field: 'id', sortable: true },
  { name: 'semester', label: 'Semester', field: 'semester', sortable: true },
  { name: 'createddated', label: 'Created date', field: 'createddated', sortable: true },
  { name: 'createdby', label: 'Created by', field: 'createdby', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', sortable: false, align: 'center' as const }
]

async function fetchsemester() {
  loading.value = true
  const res = await api.semester.getsemesterSemesterGet()
    .then(res => res.data)
    .finally(() => { loading.value = false })

  semesters.value = res;
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

async function deletesemester(semester: Semester) {
  if (confirm('Are you sure? This cannot be undone')) {
    loading.value = true
    await api.semester.deletesemesterSemesterIdDeleteDelete(semester.id)
      .then(() => {
        semesters.value.splice(semesters.value.indexOf(semester), 1);
      })
      .finally(() => { loading.value = false })
  }
}

async function updatesemester(semester: Semester) {
  semester_value.value.id = Number(semester.id)
  semester_value.value.createddated = semester.createddated
  semester_value.value.semester = semester.semester
  semester_value.value.createdby = semester.createdby
  prompt.value = true

}

async function editsemester() {
  loading.value = true
  var a: SemesterUpdate = {
    semester: semester_value.value.semester,
    createddated: new Date().toISOString(),
    createdby: info.value.fullname || ''
  }
  const res = await api.semester.updatesemesterSemesterIdUpdatePatch(Number(semester_value.value.id), a)
  let index = semesters.value.findIndex(item => item.id === semester_value.value.id);
  semesters.value.splice(index, 1)
  semesters.value.push(res.data)
  semester_value.value = {
    id: 0,
    semester: '',
    createddated: new Date().toISOString(),
    createdby: ''

  }
  loading.value = false

}
async function onSubmit() {
  var a: SemesterCreate = {
    semester: semester_value.value.semester || '',
    createddated: new Date().toISOString(),
    createdby: info.value.fullname || ''
  }
  const res = await api.semester.createmajorSemesterPost(a)
    .then(res => res.data).finally(() => { loading.value = false })
  semesters.value.push(res)


}
function canceledit() {
  semester_value.value.id = 0
  semester_value.value.semester = ''
}

onMounted(async () => {
  await fetchsemester()
})

</script>