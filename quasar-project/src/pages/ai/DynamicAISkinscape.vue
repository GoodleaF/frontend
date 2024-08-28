<template>
  <q-page>
    <div class="text-h5 q-my-md text-bold text-center">
      다이나믹 AI 스킨스케이프
    </div>
    <q-banner class="bg-grey-6">
      <SkinscapeInput class="full-width" @on-submit="onSubmit" />
    </q-banner>

    <div class="q-pa-md">
      <DateSearchForm ref="dateSearchForm" @on-submit="onSearch" />

      <div class="q-pa-md row justify-center">
        <div style="width: 100%;">
          <q-table style="height: 600px" title="키워드 목록" :rows="datas" :columns="columns" row-key="name" :filter="filter"
            :pagination="pagination" :loading="loading" virtual-scroll :virtual-scroll-item-size="48"
            @virtual-scroll="onScroll">

            <!-- 내용 검색 -->
            <template v-slot:top-right>
              <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>

            <!-- Contents -->
            <template #body="props">

              <q-tr :props="props">
                <q-td key="message" :props="props">
                  {{ props.row.message }}
                </q-td>
                <q-td key="server" :props="props">
                  <q-badge :color="serverStore.getColor(props.row.server)">
                    {{ serverStore.getLabel(props.row.server) }}
                  </q-badge>
                </q-td>
                <q-td key="name" :props="props">
                  {{ props.row.name }}
                </q-td>
                <q-td key="regDate" :props="props">
                  {{ date.getFormatString(props.row.regDate, "YYYY-MM-DD HH:mm:ss") }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref, onBeforeMount, onUnmounted, computed } from 'vue'
import { useSocketStore } from 'src/stores/socket';
import { useOperationStore } from 'src/stores/operation'
import { useServerStore } from 'src/stores/server'

import { SessionStorage } from 'quasar';
import useDate from 'src/date.js'

import SkinscapeInput from 'components/forms/DynamicAISkinscapeForm.vue'
import DateSearchForm from 'components/forms/DateSearchForm.vue'

const socket = useSocketStore()
const store = useOperationStore()
const date = useDate()
const serverStore = useServerStore()

const dateSearchForm = ref(null)

//table
const datas = ref([])
const filter = ref('')
const loading = ref(false)
const pagination = {
  page: 1,
  rowsPerPage: 50
}

const columns = [
  {
    name: 'message',
    label: '키워드',
    field: 'message',
    align: 'left',
    sortable: true
  },
  {
    name: 'server',
    label: '서버',
    field: row => row.server,
    sortable: true
  },
  {
    name: 'name',
    label: '작성자',
    field: 'name',
    sortable: true
  },
  {
    name: 'regDate',
    label: '날짜',
    field: row => date.getFormatString(row.regDate, "YYYY-MM-DD HH:mm:ss"),
    align: 'center',
    sortable: true
  },
]

const myName = computed(() => {
  return SessionStorage.getItem('manager')?.fullName ?? ''
})

onBeforeMount(async () => {
  await socket.registerEvent("dynamic_skinscape_res", serverSkinscapeResponse);
})

onUnmounted(async () => {
  await socket.deregisterEvent("dynamic_skinscape_res", serverSkinscapeResponse)
})

function serverSkinscapeResponse(server, message) {
}

async function onSubmit(form) {
  form.name = myName
  form.serverGroupId =[]
  console.log(form)
  await socket.send("dynamic_skinscape_req", form)
  await store.insertSkinscapeLog(form.keyword, form.servers.join(','), SessionStorage.getItem('manager').fullName);
  dateSearchForm.value.onSubmit()
}

let preventFrequentLoading = false;
async function onSearch(searchAll, startDate, endDate) {
  if (preventFrequentLoading) return;

  loading.value = true;
  try {
    datas.value = await store.getSkinscapeLog(searchAll, startDate, endDate)
    preventFrequentLoading = true;
    setTimeout(() => {
      preventFrequentLoading = false;
    }, 1000)
  } catch (err) {
    console.error(err)
    if (err.status === 401) router.push('/auth/sign-in')
  }
  loading.value = false
}

const lastPage = Math.ceil(datas.value.length / pagination.rowsPerPage)
const nextPage = ref(1)
const rows = computed(() => datas.value.slice(0, pagination.rowsPerPage * nextPage.value - 1))
function onScroll({ to, ref }) {
  const lastIndex = rows.value.length - 1
  if (loading.value !== true && nextPage.value < lastPage && to === lastIndex) {
    loading.value = true
    nextPage.value++
    nextTick(() => {
      ref.refresh()
      loading.value = false
    })
  }
}

</script>
