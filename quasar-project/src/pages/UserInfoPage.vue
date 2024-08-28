<!--
  유저의 정보를 볼수 있는 메인 페이지 입니다.
  하단 탭은 router를 통해, 각각의 정보를 보는 컴포넌트에 연결됩니다.
  socket을 통해 실시간 킥, 밴 처리를 합니다.
-->
<template>
  <q-page padding class="q-gutter-y-md">
    <h5 class="text-bold text-center"> 캐릭터 조회 </h5>
    <label>검색조건<SearchTypeToggle class="col-1 text" @changed="onSearchTypeChanged"/></label>
    <UserSearchForm ref="user_search_form" @on-submit="onSubmit" />
    <section v-if="isShowUser">
      <!-- 좌측 유저 아이콘-->
      <section class="row q-col-gutter-x-xl q-py-lg">
        <div class="col-12 col-sm-auto q-py-md flex flex-center">
          <q-avatar size="150px" color="orange">
            <q-icon name="fas fa-user" />
            <q-badge color="red" :label="level" rounded floating />
          </q-avatar>
        </div>
        <!-- 우측 유저 정보-->
        <div class="col-12 col-sm-grow column justify-between">
          <!-- 유저 정보 상-->
          <div class="row items-center">
            <div class="q-gutter-x-sm">
              <q-badge outline color="primary" :label="serverName" />
              <span class="text-h6 text-weight-bold">{{ data.userName }}</span>
            </div>
              <!-- 유저 킥 메뉴-->
              <q-btn flat color="secondary" icon="more_horiz">
                <q-menu>
                  <q-list style="min-width: 100px">
                    <q-item clickable v-close-popup>
                      <q-item-section @click="kickUserReq">Kick</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
          </div>
          <!-- 유저 정보 중-->
          <div class="q-gutter-x-lg">
            <span>유저계정(uid): {{ data.userId }}</span>
            <span>캐릭터계정(characterId): {{ data.characterId }}</span>
          </div>
          <div>
            <div class="q-gutter-x-md">
              <span>EXP: {{ data.userExp }}</span>
            </div>
            <div class="q-gutter-x-md">
              <span>마지막 장소: {{ data.lastZoneId }}</span>
              <span>X좌표: {{ data.lastPositionX }}</span>
              <span>Z좌표: {{ data.lastPositionZ  }}</span>
            </div>
          <div>
              <div class="q-gutter-x-md">
              <span>생성일: {{ dateUtil.getFormatString(data.createDate, "YYYY-MM-DD HH:mm:ss") }}</span>
              <span>최근접속일 : {{ dateUtil.getFormatString(data.updateDate, "YYYY-MM-DD HH:mm:ss") }}</span>
            </div>
            </div>
            <!-- 삭제상태가 isDeleted가 아니라 charState로 구별되고 있음(추후 수정 필요) -->
            <div v-if="data.charState === 2">
              <q-badge color="grey">삭제됨</q-badge>
              <span>{{ dateUtil.getFormatString(data.deleteDate, "YYYY-MM-DD HH:mm:ss") }} </span>
            </div>
          </div>
        </div>
      </section>

      <!-- 유저 정보 하 (라우터 탭)-->
      <q-tabs class="q-mb-lg" v-model="tab" inline-label switch-indicator indicator-color="primary">
        <q-route-tab :ripple="false" icon="textsms" to="/chat" label="채팅" exact />
      </q-tabs>
      <router-view />
    </section>
  </q-page>
</template>

<script setup>
import { defineProps, ref, computed, onBeforeMount, onMounted, onUnmounted } from 'vue'
import { useUserStore } from 'stores/user.js'
import { useServerStore } from 'stores/server.js'
import { useSocketStore } from 'src/stores/socket'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import useDate from 'src/date.js'
import { useSearchTypeStore } from 'stores/search-type.js'

import UserSearchForm from 'components/forms/UserSearchForm.vue'
import SearchTypeToggle from '../components/forms/SearchTypeToggle.vue'
import moment from 'moment'


const props = defineProps({
  id: String
})

const $q = useQuasar();
const store = useUserStore();
const serverStore = useServerStore();
const socket = useSocketStore();
const router = useRouter();
const dateUtil = useDate();
const searchTypeStore = useSearchTypeStore();

const user_search_form = ref(null);
const data = ref({})
const tab = ref(null)
const isShowUser = ref(false)

const searchOption = ref(searchTypeStore.Values)

async function loadUser(userServer, userName, searchOption) {
  try {
    clear()
    await store.loadUserInfo(userServer, userName, searchOption)
    data.value = store.userInfo
    isShowUser.value = true;
  } catch (err) {
    clear()
    if (err.status === 401) router.push('/auth/sign-in')
  }
}

function onSubmit(form) {
  loadUser(form.server, form.keyword, searchOption.value.join(','))
}

function refresh() {
  loadUser(store.userServer, data.value.userName)
}

function clear() {
  data.value = {}
  store.clear()
  isShowUser.value = false
}

const serverOptions = serverStore.Options
const serverName = computed(() => {
  const ret = serverOptions.find((option) => option.value === store.userServer)
  return ret ? ret.label : ''
})

const level = computed(() => {
  //if (data.value === {})
  //  return ''
  return `level. ${data.value.userLv}`
})

const onSearchTypeChanged = (searchTypeList) => {
  searchOption.value = searchTypeList;
}

//실시간
onBeforeMount(async () => {
  await socket.registerEvent("kick_user_res", kickUserReq);
})
onMounted(() => {

    //다른 페이지에서 검색할 유저정보가 전달되었을시
    if (history.state.searchServer && history.state.searchUserName)
    {
      user_search_form.value.setFormDataAndSubmit(history.state.searchServer, history.state.searchUserName);    
    }
})
onUnmounted(async () => {
  await socket.deregisterEvent("kick_user_res", kickUserRes)
})

function kickUserRes(data) {
}

async function kickUserReq() {
  $q.dialog({
    title: 'Kick',
    message: `'${data.value.userName}'를 Kick 시키겠습니까?`,
    cancel: true
  }).onOk(async () => {
    await socket.send("kick_user_req", { server: store.userServer, accountId: data.value.userId })
  }).onCancel(() => {

  })
}

</script>

<style lang="scss" scoped>
.q-page {
  background-color: #fafafa;
}

.red-text {
  color: red
}
</style>
