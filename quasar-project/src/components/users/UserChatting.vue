<template>
  <q-page>
    <!-- Date Pickers -->
    <DateSearchForm @on-submit="onSubmit" />

    <div class="flex flex-center q-mb-sm">
      <q-btn-toggle v-model="toggleValue" @update:model-value="filterData" push glossy
        :toggle-color="logTypeMap[toggleValue].bgColor" :options="logTypeArr" />
    </div>


    <div class="q-pa-md row justify-center">
      <div style="width: 100%;">
        <q-table style="height: 800px" title="Chat" :rows="datas" :columns="columns" row-key="name" :filter="filter"
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
              <q-td key="comment" :props="props">
                {{ props.row.comment }}
              </q-td>
              <q-td key="logType" :props="props">
                <q-badge :color="logTypeMap[props.row.logType].bgColor">
                  {{ logTypeMap[props.row.logType].label }}
                </q-badge>
              </q-td>
              <q-td key="writtenTime" :props="props">
                {{ date.getFormatString(props.row.writtenTime, "YYYY-MM-DD HH:mm:ss") }}
              </q-td>
              <q-td key="seq" :props="props">
                {{ props.row.seq }}
              </q-td>
            </q-tr>
          </template>

        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from 'stores/user.js'
import useDate from 'src/date'
import moment from 'moment'
import DateSearchForm from 'components/forms/DateSearchForm.vue'

const router = useRouter();
const store = useUserStore();
const date = useDate();

//table
const datas = ref([])
const filter = ref('')
const loading = ref(false)
const pagination = {
  page: 1,
  rowsPerPage: 50
}
const logTypeMap =
{
  20001: {
    label: '일반',
    bgColor: 'primary',
  },
  20002: {
    label: '전체',
    bgColor: 'accent',
  },
  20003: {
    label: '귓속말',
    bgColor: 'amber-7',
  },
  20004: {
    label: '파티',
    bgColor: 'info',
  },
  20005: {
    label: '길드',
    bgColor: 'brown',
  },
  20006: {
    label: '커맨드',
    bgColor: 'negative',
  },
  20007: {
    label: '리포트',
    bgColor: 'orange',
  },
  20008: {
    label: '교환',
    bgColor: 'positive',
  },
}

let logTypeArr = [];
for (let key in logTypeMap) {
  logTypeArr.push({ label: logTypeMap[key].label, value: key, color: logTypeMap[key].color })
}

const columns = [
  {
    name: 'comment',
    label: 'comment',
    field: 'comment',
    align: 'left',
    sortable: true
  },
  {
    name: 'logType',
    label: '타입',
    field: row => row.logType,
    sortable: true
  },
  {
    name: 'writtenTime',
    label: '날짜',
    field: row => moment.utc(row.writtenTime).format("YYYY-MM-DD HH:mm:ss"),
    align: 'center',
    sortable: true
  },
  {
    name: 'seq',
    label: 'seq',
    field: 'seq',
    align: 'center',
    sortable: true
  },
]

const toggleValue = ref('20001')

async function onSubmit(searchAll, startDate, endDate) {
  loading.value = true;
  try {
    await store.loadUserChat(searchAll, startDate, endDate)
    filterData(toggleValue.value)
  } catch (err) {
    console.error(err)
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

function filterData(value) {
  datas.value = store.userChat.filter((v) => {
    return v.logType == value
  })
}

</script>
