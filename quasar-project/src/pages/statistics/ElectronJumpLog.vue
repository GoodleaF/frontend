<!-- ElectronJump 정보 조회 페이지 -->

<template>
  <q-page padding class="q-gutter-y-md">
    <h5 class="text-bold text-center"> 전기넘기 기록 조회 </h5>

    <q-banner class="bg-grey-6">
      <!-- 서버 선택 -->
      <label class="text-bold">서버</label>
      <ServerToggle @changed="onServerChanged" />

       <!-- 랭크타입 선택 --> 
      <label class="text-bold">랭크타입</label>
      <RankTypeToggle @changed="onRankTypeChanged" />
    </q-banner>

    <!-- 날짜 선택-->
    <div class="q-gutter-x-sm row">

        <!-- 서버 선택 -->
        <!-- <ServerSelection v-model:modelValue="serverName" @changed="onServerSelectionChanged" /> -->


        <!-- 시작 날짜 선택 -->
        <q-input class="col" v-model="startDate" type="date" label="시작 날짜 선택" @input="clearData" />

        <!-- 종료 날짜 선택 -->
        <q-input class="col" v-model="endDate" type="date" label="종료 날짜 선택" @input="clearData" />

        <!-- 캐릭터이름 입력 -->          
        <q-input class="col" outlined v-model="charName" label="캐릭터이름" autofocus />

        <!-- 검색 버튼 -->
        <q-btn class="col-1.5" label="검색" @click="fetchData" color="primary" />
        <!-- 엑셀 버튼 -->
        <!-- <q-btn label="엑셀로 내보내기" @click="exportToExcel" color="secondary" class="q-ml-md" /> -->
    </div>


    <q-table title="ElectronJumpLog" :rows="datas" :columns="columns" row-key="asdfasdfasd" :pagination="pagination" :loading="loading">
      <template #body="props">
        <q-tr :props="props">
          <q-td key="serverName" :props="props">
            {{ props.row.serverName }}
          </q-td>
          <q-td key="charName" :props="props">
            {{ props.row.charName }}
          </q-td>
          <q-td key="rankType" :props="props">
            {{ props.row.rankType == 0 ? 'normal' : 'rank' }}
          </q-td>
          <q-td key="score" :props="props">
            {{ props.row.score }}
          </q-td>
          <q-td key="startDate" :props="props">
            {{ date.getFormatString(props.row.startDate, "YYYY-MM-DD HH:mm:ss") }}
          </q-td>
          <q-td key="endDate" :props="props">
            {{ date.getFormatString(props.row.endDate, "YYYY-MM-DD HH:mm:ss") }}
          </q-td>
          <q-td key="updateTime" :props="props">
            {{ date.getFormatString(props.row.updateTime, "YYYY-MM-DD HH:mm:ss") }}
          </q-td>
          <q-td key="playTime" :props="props">
            {{ date.getFormatString(props.row.playTime, "HH:mm:ss") }}
          </q-td>
        </q-tr>
        
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useServerStore } from 'stores/server.js'
import { useRankTypeStore } from 'stores/rankType.js'
import { useStatisticsStore } from 'stores/statistics.js'
import ServerToggle from '../../components/forms/ServerToggle.vue'
import RankTypeToggle from '../../components/forms/RankTypeToggle.vue'
import useDate from 'src/date.js'

import moment from 'moment'
const pagination = {
  page: 1,
  rowsPerPage: 50
}

const date = useDate()

const formatDate = (date) => {
  let dd = date.getDate();
  let mm = date.getMonth() + 1; 
  const yyyy = date.getFullYear();
  
  if(dd < 10) {
      dd = '0' + dd;
  } 
  
  if(mm < 10) {
      mm = '0' + mm;
  } 

  return yyyy + '-' + mm + '-' + dd;
}


const columns = [
    {
      name: 'serverName',
      label: '서버이름',
      field: 'serverName',
      align: 'center',
      sortable: true
    },
    {
      name: 'charName',
      label: '캐릭터이름',
      field: 'charName',
      align: 'center',
      sortable: true
    },
    {
      name: 'rankType',
      label: '랭크 타입',
      field: 'rankType',
      align: 'center',
      sortable: true
    },
    {
      name: 'score',
      label: '점수',
      field: 'score',
      align: 'center',
      sortable: true
    },
    {
      name: 'startDate',
      label: '시작일자',
      field: 'startDate',
      align: 'center',
      sortable: true
    },
    {
      name: 'endDate',
      label: '종료일자',
      field: 'endDate',
      align: 'center',
      sortable: true
    },
    {
      name: 'playTime',
      label: '플레이시간',
      field: 'playTime',
      align: 'center',
      sortable: true
    },
]

const oneMonthAgo = new Date();
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
const statisticsStore = useStatisticsStore();
const chartKey = ref(0);



//입력 데이터
const form = ref({
  servers: useServerStore.Values,
  rankTypes: useRankTypeStore.Values,
})
const charName = ref('');
const startDate = ref(formatDate(oneMonthAgo));
const endDate = ref(formatDate(new Date()));




//출력데이터
const datas = ref([]);
const loading = ref(false)

async function fetchData() {
  try {

    //출력데이터 초기화
    datas.value = [];

    loading.value = true;

    await statisticsStore.loadElectronJumpLog({ server: form.value.servers.join(','), rankType: form.value.rankTypes.join(','), start: startDate.value, end: endDate.value, charName: charName.value});
    console.debug('goodleaf', statisticsStore.ElectronJumpLog);
    datas.value = statisticsStore.ElectronJumpLog;

    loading.value = false;
  } catch (err) {
    console.error(err);

    loading.value = false;
  }
}

const onServerChanged = (serverList) => {
  form.value.servers = serverList;
}

const onRankTypeChanged = (rankTypeList) => {
  form.value.rankTypes = rankTypeList;
}

function clear() {
  datas.value = {}
}

</script>

<style lang="scss" scoped>
.q-page {
  background-color: #fafafa;
}
</style>
