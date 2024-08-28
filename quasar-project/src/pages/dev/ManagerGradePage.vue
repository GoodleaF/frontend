<template>
  <q-page class="q-pa-md q-gutter-y-md">
    <h5 class="text-bold text-center"> 운영자 관리 </h5>
    <q-table title="목록" :rows="datas" :columns="columns" row-key="name" :pagination="pagination" :loading="loading"
      :filter="filter">
      <!-- 내용 검색 -->
      <template v-slot:top-right>
        <q-input dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <!-- Content -->
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
          <q-th auto-width />
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props"> {{ col.value }}</q-td>
          <q-td><q-btn size="sm" label="수정" color="negative" @click="onClickModify(props.row)"></q-btn></q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>

  <!-- 수정 누를 경우 뜨는 Dialog -->
  <q-dialog v-model="firstDialog">
    <q-card style="width: 500px" class="q-px-sm q-pb-md">

      <!-- 정보 Section-->
      <q-card-section>
        <div class="text-h6">ID: {{ currentRow.loginId }}</div>
        <div class="text-h6">Name: {{ currentRow.name }}</div>
      </q-card-section>

      <!-- 등급 수정 slider -->
      <q-card-section>
        <q-item-label header>등급조정</q-item-label>
        <q-item dense>
          <q-item-section>
            <q-slider color="teal" :min="0" :max="5" v-model="modifiedGrade" :step="1" label-always />
          </q-item-section>
        </q-item>
      </q-card-section>

      <!-- dialog 하단 버튼 -->
      <q-card-actions align="right" class="text-primary">
        <q-btn label="삭제" v-close-popup v-if="currentRow.deleted === 0" color="negative" @click="onClickDelete()" />
        <q-space />
        <q-btn label="확인" v-close-popup color="secondary" @click="onClickConfirm" />
        <q-btn label="취소" v-close-popup @click="resetDialog()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import useDate from 'src/date'
import { useOperationStore } from 'src/stores/operation';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const datas = ref([])
const date = useDate()
const store = useOperationStore()

const columns = [
  {
    name: 'loginId',
    label: 'ID',
    field: 'loginId',
    align: 'center',
    sortable: true
  },
  {
    name: 'name',
    label: '이름',
    field: 'name',
    sortable: true
  },
  {
    name: 'grade',
    label: '등급',
    field: 'grade',
    sortable: true
  },
  {
    name: 'regDate',
    label: '가입일자',
    field: row => date.getFormatString(row.regDate, "YYYY-MM-DD HH:mm:ss"),
    align: 'center',
    sortable: true
  },
  {
    name: 'deleted',
    label: '삭제',
    field: row => row.deleted ? 'Y' : 'N',
    sortable: true
  },
]
const loading = ref(false)

const pagination = {
  page: 1,
  rowsPerPage: 50
}
const filter = ref('')
const firstDialog = ref(false)
const currentRow = ref({})
const modifiedGrade = ref(0)

onMounted(async () => {
  await loadDatas();
})

async function loadDatas() {
  try {
    await store.loadManager()
    datas.value = store.Manager
  } catch (err) {
    console.error(err)
  }
}

function onClickModify(row) {
  currentRow.value = row
  modifiedGrade.value = row.grade
  firstDialog.value = true
}

async function onClickConfirm() {
  try {
    if (currentRow.value.grade === modifiedGrade.value) {
      resetDialog()
      return;
    }
    const result = await store.changeGrade(currentRow.value.loginId, modifiedGrade.value)
    if (result.data === true) {
      $q.notify({
        message: result.message,
        color: 'primary'
      })
      await loadDatas()
    }
  } catch (err) {
    console.error(err)
  }
}

function onClickDelete() {
  try {

    $q.dialog({
      message: `${currentRow.value.loginId}를 삭제하시겠습니까?`
    }).onOk(async () => {
      const result = await store.deleteManager(currentRow.value.loginId)
      if (result.data === true) {
        $q.notify({
          message: result.message,
          color: 'primary'
        })
        await loadDatas()
      }
    })

  } catch (err) {
    console.error(err)
  }
}

function resetDialog() {
  currentRow.value = {}
  modifiedGrade.value = 0
}
</script>
