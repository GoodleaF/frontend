<!-- Main Content Layout-->

<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar style="background-color: #7401DF;">
        <!-- 사이드바 토글버튼 -->
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <!-- title -->
        <q-toolbar-title>
          <router-link to="/" class="delunderline">
            <div class="text-white">
              BearBrick 웹 운영툴
            </div>
          </router-link>
        </q-toolbar-title>

        <!-- 우측 로그인 정보 -->
        <div v-if="isLoginned">
          <q-btn :label="name" icon="account_circle" no-caps flat dense>
            <q-menu auto-close>
              <q-list>
                <q-item>
                  <q-item-section class="items-center">{{ grade }} 등급</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section class="items-center" @click="signOut()">로그아웃</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
        <div v-else>
          <q-btn flat @click="signIn()"> guest </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- 왼쪽 Side Bar -->
    <TheSideBar :leftDrawerOpen=leftDrawerOpen />

    <!-- Main Content RotuerView-->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, watch, onBeforeMount, onUnmounted } from 'vue'
import TheSideBar from '../components/TheSideBar.vue'
import { useAuthStore } from 'src/stores/auth';
import { is, useQuasar, } from 'quasar';
import { useRouter } from 'vue-router';
import { useSocketStore } from 'src/stores/socket';

const $q = useQuasar()
const store = useAuthStore()
const socket = useSocketStore()
const router = useRouter()
const chatDialog = ref(false);
const userQuery = ref('');
const response = ref('');

const name = computed(() => {
  if ($q.sessionStorage.has('manager')) {
    return $q.sessionStorage.getItem('manager').fullName
  }
  return ''
})

const grade = computed(() => {
  if ($q.sessionStorage.has('manager')) {
    return $q.sessionStorage.getItem('manager').grade
  }
  return ''
})

const isLoginned = computed(() => {
  return $q.sessionStorage.has('manager')
})

const leftDrawerOpen = ref(true)
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const signOut = async () => {
  const result = await store.logOut()
  if (result.status === 200) {
    router.push('/auth/sign-in')
  }
}

const signIn = () => {
  router.push('/auth/sign-in')
}

onBeforeMount(async () => {
  await socket.connect()
})

onUnmounted(() => {
  socket.disconnect()
})

</script>


<style scoped>
.delunderline {
  text-decoration: none;
}

</style>
