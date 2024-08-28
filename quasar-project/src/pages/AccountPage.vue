<!-- Account 정보 조회 페이지 -->

<template>
  <q-page padding class="q-gutter-y-md">
    <h5 class="text-bold text-center"> 계정 조회 </h5>
    <q-form ref="form" greedy @submit.prevent="onSubmit">
      <div class="q-gutter-x-sm row items-center">
        <q-input class="col" outlined v-model.trim="form.keyword" label="accountId" autofocus />
        <SearchTypeToggle class="col-1" @changed="onSearchTypeChanged"/>
        <q-btn class="col-1" label="Submit" type="submit" color="primary" />
      </div>
    </q-form>
    <q-table title="Account" :rows="datas" :columns="columns" row-key="name" :pagination="pagination" :loading="loading"
     :visible-columns="['userId', 'regTime', 'updateTime']"> <!-- uId컬럼은 숨김 -->
      <template #body="props">
        <q-tr :props="props">
          <q-td key="userId" :props="props">
            <div class="row justify-center items-center">
              {{ props.row.userId }}
              <q-btn class="offset-1" size="10px" icon="search" @click="openCharDialog(props.row.uId)"/> <!-- 캐릭터검색에는 uId를 사용함!!! -->
            </div>
          </q-td>
          <q-td key="regTime" :props="props">
            {{ props.row.regTime }}
          </q-td>
          <q-td key="updateTime" :props="props">
            {{ props.row.updateTime }}
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- 캐릭터조회 다이얼로그 -->
    <q-dialog v-model="charDialogOpen" persistent>
      <q-card style="width: 300px">
        <q-card-section>
          <div class="text-h6 text-bold">캐릭터조회</div>
        </q-card-section>

        <q-card-section class="row items-center">
          <!-- <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
          <span class="q-ml-sm">You are currently not connected to any network.</span> -->
          <q-select class="col-5 " v-model="selectedServer" :options="servers" label="서버" />
          <q-select  class="col-5 offset-2" v-model="selectedChar" :options="charNamesInServer" label="캐릭터이름" :loading="charLoading"/>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn flat label="조회" color="primary" @click="closeCharDialog(true)" :disable="charLoading"/>
          <q-btn flat label="취소" color="primary" @click="closeCharDialog(false)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useServerStore } from 'stores/server.js'
import { useAccountStore } from 'stores/account.js'
import { useSearchTypeStore } from 'stores/search-type.js'
import moment from 'moment'
import SearchTypeToggle from '../components/forms/SearchTypeToggle.vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar';
const $q = useQuasar();
const router = useRouter();

const pagination = {
  page: 1,
  rowsPerPage: 50
}
const columns = [
  {
    //숨겨질 컬럼임
    name: 'uId',
    label: '유저 번호',
    field: 'uId',
    align: 'center',
    sortable: true,
  },
  {
    name: 'userId',
    label: '유저 아이디',
    field: 'userId',
    align: 'center',
    sortable: true
  },
  {
    name: 'regTime',
    label: '등록 날짜',
    field: 'regTime',
    align: 'center',
    sortable: true
  },
  {
    name: 'updateTime',
    label: '업데이트 날짜',
    field: 'updateTime',
    align: 'center',
    sortable: true
  },
]

const serverStore = useServerStore()
const servers = serverStore.Values

const searchTypeStore = useSearchTypeStore()

const store = useAccountStore();
const form = ref({
  keyword: '',
  searchOption: searchTypeStore.Values,
})
const datas = ref([]);
const loading = ref(false)


///////////////////////////////////
/////계정 캐릭터(유저) 검색 관련/////
const charDialogOpen = ref(false);

const curUserId = ref('');                         //? 현재 어떤 계정id의 캐릭터목록 확인중인지
const charLoading = ref(false);                    //? 계정 캐릭터목록 로딩중인지
const charDatas = ref([]);                         //? 계정 캐릭터목록 

const selectedServer = ref('');                    //? 선택된 서버
const selectedChar = ref('');                      //? 선택된 캐릭터이름

const charNamesInServer = ref([]);                 //? 선택된 서버에 해당하는 캐릭터이름 목록

watch(selectedServer, (newValue, oldValue) => {

  if(!newValue)
  {
    charNamesInServer.value = [];
  }
  else
  {
    charNamesInServer.value = charDatas.value?.reduce((acc, cur) => {
      if (cur.serverName == newValue)
      {
        acc.push(cur.charName);
        return acc;
      }
    }, []);
  }


})


//캐릭터조회 다이얼로그 열기/닫기
const openCharDialog = async (rowUserId) => {

  charDialogOpen.value = true;

  //캐릭터 검색데이터 초기화
  curUserId.value = rowUserId;
  charDatas.value = [];
  selectedServer.value = '';
  selectedChar.value = '';


  charLoading.value = true;
  await store.loadAccountCharacters(curUserId.value);
  charDatas.value = store.characters;
  charLoading.value = false;

}
const closeCharDialog = (searchBtnPress) => {
  let tempServer = selectedServer.value;
  let tempChar = selectedChar.value;

  charDialogOpen.value = false;

  //캐릭터 검색데이터 초기화
  curUserId.value = '';
  charDatas.value = [];
  selectedServer.value = '';
  selectedChar.value = '';


  charLoading.value = false;

  //캐릭터 검색
  if(searchBtnPress)
  {
    routeToUserInfoPage(tempServer, tempChar);
  }
}

//현재 계정id에만 정보들이 표시되어야함
const getSelectedChar = (rowUserId) => {
  return curUserId.value == rowUserId ? selectedChar : '';
}
const getCharDatas = (rowUserId) => {
  return curUserId.value == rowUserId ? charDatas : [];
}
//////////////////////////////////////
//////////////////////////////////////


async function onSubmit() {
  try {
    loading.value = true;
    await store.loadAccountUsers(form.value.keyword, form.value.searchOption.join(','));
    console.log('goodleaf', store.accountUsers);
    datas.value = store.accountUsers;
    loading.value = false;
  } catch (err) {
    console.error(err)
  }
}

function clear() {
  datas.value = {}
}

const onSearchTypeChanged = (searchTypeList) => {
  form.value.searchOption = searchTypeList;
}

//유저 검색을 위해 UserInfoPage로 이동
const routeToUserInfoPage = (server, userName) => {
  router.push({
    path: '/user',
    state: {
      searchServer: server,
      searchUserName: userName,
    }
  })
}
</script>

<style lang="scss" scoped>
.q-page {
  background-color: #fafafa;
}
</style>
