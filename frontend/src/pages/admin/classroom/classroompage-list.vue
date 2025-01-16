<template>
  <div class="q-pa-md">
    
      <q-btn push color="primary" label="Create">
       
          <q-popup-proxy>
            <q-banner>
              <q-form @submit="onSubmit" class="q-gutter-md">
                <q-input filled v-model="class_value.name" label="class name *" hint="class name" lazy-rules
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
              <div class="text-h6">Classname</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-input dense v-model="class_value.name" autofocus @keyup.enter="prompt = false" />
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
    <q-table flat bordered ref="tableRef" :class="tableClass" :loading="loading" tabindex="0" title="Classrooms"
      :rows="classrooms" :columns="columns" row-key="id" :selected-rows-label="getSelectedString" selection="multiple"
      v-model:selected="selected" v-model:pagination="pagination" :filter="filter" @focusin="activateNavigation"
      @focusout="deactivateNavigation">
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" auto-width style="min-width: 120px;">
          <q-btn round icon="edit" @click="updateclass(props.row)" color="primary" flat />
          <q-btn round icon="delete" color="red" class="q-ml-sm" @click="deleteclass(props.row)" flat />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
// import { ref, computed, nextTick, toRaw } from 'vue'
import { ref, computed, onMounted } from 'vue'
import { Classroom, ClassroomCreate,ClassroomUpdate } from 'src/services/api'
import { api } from 'src/services/client'
import { useCurrentuser } from 'src/share/currentuser'
const currentuser = useCurrentuser()
const info = currentuser.info
const classrooms = ref<Classroom[]>([])
const tableRef = ref(null)
const loading = ref(false)
const navigationActive = ref(false)
const pagination = ref({})
const selected = ref([])
const class_value=ref<Classroom>({
  id:0,
  name:'',
  createddated:new Date().toISOString(),
  Createdby:''

})
const prompt = ref(false)


const filter = ref('')
const columns = [
  { name: 'id', label: 'ID', field: 'id', sortable: true },
  { name: 'name', label: 'Class name', field: 'name', sortable: true },
  { name: 'createddated', label: 'Created date', field: 'createddated', sortable: true },
  { name: 'Createdby', label: 'Created by', field: 'Createdby', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', sortable: false, align: 'center' as const }
]

async function fetchclass() {
  loading.value = true
  const res = await api.classroom.getclassroomClassroomGet()
    .then(res => res.data)
    .finally(() => { loading.value = false })

  classrooms.value = res;
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

async function deleteclass(classroom: Classroom) {
  if (confirm('Are you sure? This cannot be undone')) {
    loading.value = true
    await api.classroom.deleteclassroomClassroomIdDeleteDelete(classroom.id)
      .then(() => {
        classrooms.value.splice(classrooms.value.indexOf(classroom), 1);
      })
      .finally(() => { loading.value = false })
  }
}

async function updateclass(classroom:Classroom) {
  class_value.value.id=Number(classroom.id)
  class_value.value.createddated=classroom.createddated
  class_value.value.name=classroom.name
  class_value.value.Createdby=classroom.Createdby
  prompt.value = true
  console.log(class_value.value)
}

async function editclass(){
  loading.value=true
  var a: ClassroomUpdate = {
    name: class_value.value.name ,
    createddated: new Date().toISOString(),
    Createdby: info.value.fullname || ''
  }
  const res =await api.classroom.updateclassroomClassroomIdUpdatePatch(Number(class_value.value.id),a)
  let index = classrooms.value.findIndex(item => item.id === class_value.value.id);
  classrooms.value.splice(index, 1)
  classrooms.value.push(res.data)
  class_value.value={
  id:0,
  name:'',
  createddated:new Date().toISOString(),
  Createdby:''

  }
  loading.value=false

}
async function onSubmit() {
  var a: ClassroomCreate = {
    name: class_value.value.name || '',
    createddated: new Date().toISOString(),
    Createdby: info.value.fullname || ''
  }
  const res = await api.classroom.createclassroomClassroomPost(a)
    .then(res => res.data).finally(() => { loading.value = false })
  classrooms.value.push(res)
  class_value.value.name=''

}
function canceledit(){
  class_value.value.id=0
}

onMounted(async () => {
  await fetchclass()
})

</script>