<!-- 좌측 사이드바 -->

<template>
  <q-drawer v-if=leftDrawerOpen show-if-above :width="250" :breakpoint="500" bordered class="bg-grey-3">
    <q-scroll-area class="fit">
      <q-list>

        <!-- 운영 -->
        <q-expansion-item expand-separator icon="support_agent" label="운영 메뉴" default-opened>
          <!-- 유저 -->
          <q-expansion-item :header-inset-level="0.3" :content-inset-level="0.5" expand-separator icon="group" label="유저"
            default-opened dense dense-toggle>
            <EssentialLink v-for="link in userLinks" :key="link.title" v-bind="link" />
          </q-expansion-item>
          <!-- 기능 -->
          <q-expansion-item :header-inset-level="0.3" :content-inset-level="0.5" expand-separator icon="build" label="기능"
            default-opened dense dense-toggle>
            <EssentialLink v-for="link in actionLinks" :key="link.title" v-bind="link" />
          </q-expansion-item>
          <!-- 통계 -->
          <q-expansion-item :header-inset-level="0.3" :content-inset-level="0.5" expand-separator icon="insights"
            label="통계" default-opened dense dense-toggle>
            <EssentialLink v-for="link in statisticsLinks" :key="link.title" v-bind="link" />
          </q-expansion-item>
        </q-expansion-item>
        <!-- 관리 -->
        <q-expansion-item v-if="grade >= 3" :content-inset-level="0.3" expand-separator icon="keyboard" label="관리 메뉴"
          default-opened>
          <EssentialLink v-for="link in devLinks" :key="link.title" v-bind="link" />
        </q-expansion-item>
        <!-- Chat GPT -->
        <q-expansion-item :content-inset-level="0.3" expand-separator icon="psychology" label="AI 메뉴" default-opened>
          <EssentialLink v-for="link in aiLinks" :key="link.title" v-bind="link" />
        </q-expansion-item>

      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup>
import { defineProps, toRefs, watch, computed } from 'vue'
import { SessionStorage } from 'quasar';
import EssentialLink from './EssentialLink.vue'

const props = defineProps({
  leftDrawerOpen: Boolean
})

const { leftDrawerOpen } = toRefs(props)

watch(leftDrawerOpen, (newVal, oldVal) => { console.log("change Inside : ", leftDrawerOpen.value) })

const grade = computed(() => {
  if (!SessionStorage.has("manager")) {
    return -1;
  }
  return SessionStorage.getItem("manager").grade
})


const userLinks = [
  {
    title: '계정 조회',
    icon: 'fas fa-user',
    link: '/account',
    style: 'color: #4B088A;'
  },
  {
    title: '캐릭터 조회',
    icon: 'fas fa-address-card',
    link: '/user',
    style: 'color: #4B088A;'
  }
]

const actionLinks = [
  {
    title: '게임 공지',
    icon: 'campaign',
    link: '/announce',
    style: 'color: #4B088A;'
  },
]

const statisticsLinks = [
  {
    title: "복귀 유저 잔존율",
    icon: "accessibility_new",
    link: "/survival-rate-return",
    style: 'color: #4B088A;'
  },
  {
    title: "신규 유저 잔존율",
    icon: "grade",
    link: "/survival-rate-new",
    style: 'color: #4B088A;'
  },
  {
    title: '동시접속자 수',
    icon: 'recent_actors',
    link: '/concurrent-user',
    style: 'color: #4B088A;'
  },
  {
    title: '전기넘기 랭킹',
    icon: 'military_tech',
    link: '/electron-jump-rank',
    style: 'color: #4B088A;'
  },
  {
    title: '전기넘기 기록',
    icon: 'history_edu',
    link: '/electron-jump-log',
    style: 'color: #4B088A;'
  },
]

const devLinks = [
  {
    title: '운영자 관리',
    icon: 'support_agent',
    link: '/manager',
    style: 'color: #4B088A;'
  },
  {
    title: '서버 점검',
    icon: 'report',
    link: '/maintenance',
    style: 'color: #4B088A;'
  }
]

const aiLinks = [
  {
    title: 'Chat GPT',
    icon: 'forum',
    link: '/chatgpt',
    style: 'color: #4B088A;'
  },
  {
    title: '다이나믹 스킨스케이프',
    icon: 'celebration',
    link: '/skinscape',
    style: 'color: #4B088A;'
  }
]

</script>
