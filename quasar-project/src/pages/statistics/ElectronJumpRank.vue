<!-- ElectronJump 정보 조회 페이지 -->

<template>
    <q-page padding class="q-gutter-y-md">
      <h5 class="text-bold text-center"> 전기넘기 랭크 조회 </h5>

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

          <!-- 캐릭터이름 입력 -->          
          <q-input class="col" outlined v-model="charName" label="캐릭터이름" autofocus />
  
          <!-- 검색 버튼 -->
          <q-btn class="col-1.5" label="검색" @click="fetchData()" color="primary" />

          <!-- 엑셀 버튼 -->
          <!-- <q-btn label="엑셀로 내보내기" @click="exportToExcel" color="secondary" class="q-ml-md" /> -->
      </div>
  
  
      <q-table title="ElectronJumpRank" :rows="datas" :columns="columns" row-key="name" :pagination="pagination" :loading="loading">
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
            <q-td key="matching" :props="props">
              {{ props.row.matching }}
            </q-td>
            <q-td key="highScore" :props="props">
              {{ props.row.highScore }}
            </q-td>
            <q-td key="updateDate" :props="props">
              {{ date.getFormatString(props.row.updateDate, "YYYY-MM-DD HH:mm:ss") }}
            </q-td>
            <q-td key="regDate" :props="props">
              {{ date.getFormatString(props.row.regDate, "YYYY-MM-DD HH:mm:ss") }}
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
  import moment from 'moment'
  import useDate from 'src/date.js'

  const date = useDate()

  const pagination = {
    page: 1,
    rowsPerPage: 50
  }
  
  
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
        name: 'matching',
        label: '매칭',
        field: 'matching',
        align: 'center',
        sortable: true
      },
      {
        name: 'highScore',
        label: '최고점수',
        field: 'highScore',
        align: 'center',
        sortable: true
      },
      {
        name: 'updateDate',
        label: '갱신일자',
        field: 'updateDate',
        align: 'center',
        sortable: true
      },
      {
        name: 'regDate',
        label: '등록일자',
        field: 'regTime',
        align: 'center',
        sortable: true
      },
  ]
  

  //입력 데이터
  const form = ref({
    servers: useServerStore.Values,
    rankTypes: useRankTypeStore.Values,
  })
  const charName = ref('');
  
  
  //조회 테이블 관련
  const statisticsStore = useStatisticsStore();
  const datas = ref([]);
  const loading = ref(false)
  

  async function fetchData() {
    try {
      loading.value = true;
      await statisticsStore.loadElectronJumpRank({server: form.value.servers.join(','),  rankType: form.value.rankTypes.join(','), charName: charName.value});
      console.debug('goodleaf', statisticsStore.ElectronJumpRank);  
      datas.value = statisticsStore.ElectronJumpRank;
      loading.value = false;
    } catch (err) {
      console.error(err);
      loading.value = false;
    }
  }

//   const onServerSelectionChanged = (value) => {
//   serverName.value = value
//  }

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
  