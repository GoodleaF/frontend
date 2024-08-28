<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <!-- 헤더 -->
      <q-bar dark class="bg-secondary text-white">
        <div class="col text-center text-weight-bold">
          스킨스케이프 타이머
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="onCancelClick" />
      </q-bar>

      <!-- props -->
      <q-card-section>
        <div class="q-gutter-x-sm">
          <q-badge v-for="s in servers" :key="s.value" :color="serverStore.getColor(s)">
            {{ serverStore.getLabel(s) }}
          </q-badge>
        </div>
        <div class="flex flex-center q-mt-md">
          {{ message }}
        </div>
      </q-card-section>

      <!-- form -->
      <q-card-actions>
        <!-- 타이머 -->
        <q-form @submit.prevent="onStart">
          <div>
            타이머
          </div>
          <div class="row q-gutter-x-xs">
            <q-input v-model="hour" type="number" class="col" label="시" outlined :disable="start" />
            <q-input v-model="min" type="number" class="col" label="분" outlined :disable="start" />
            <q-input v-model="sec" type="number" class="col" label="초" outlined :disable="start" />
            <q-btn class="col" type="submit" color="primary" label="실행" :disable="start" />
          </div>
          <!--반복-->
          <q-checkbox v-model="repeat" label="반복" :disable="start" />
          <div class="row q-gutter-x-xs" v-if="repeat">
            <q-input v-model="repeatHour" type="number" class="col" label="시" outlined :disable="start" />
            <q-input v-model="repeatMin" type="number" class="col" label="분" outlined :disable="start" />
            <q-input v-model="repeatSec" type="number" class="col" label="초" outlined :disable="start" />
            <q-input v-model="repeatNum" type="number" class="col" label="반복횟수" outlined :disable="start" />
          </div>
        </q-form>
      </q-card-actions>

      <!--실행 현황-->
      <q-card-section v-if="start">
        <div>
          실행: {{ executeNum }}
        </div>
        <q-linear-progress :value="progress" size="25px" color="primary" stripe rounded animation-speed="200">
          <div class="absolute-full flex flex-center">
            <q-badge color="white" text-color="accent" :label="percentage" />
          </div>
        </q-linear-progress>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, onUnmounted } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import { useServerStore } from 'src/stores/server'
import { useQuasar } from 'quasar'

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const emits = defineEmits([
  ...useDialogPluginComponent.emits
])

const props = defineProps({
  message: String,
  servers: Array,
  submitFunc: Function
})

const serverStore = useServerStore()
const $q = useQuasar()

const sec = ref(0);
const min = ref(0);
const hour = ref(0);
const start = ref(false);
let totalSeconds;

const repeat = ref(false)
const repeatSec = ref(0);
const repeatMin = ref(0);
const repeatHour = ref(0);
const repeatNum = ref(1);

const executeNum = ref(0);

var elapsed = 0;
var interval;

const progress = ref(0.0);
const percentage = computed(() => {
  return `${Math.floor(progress.value * 100)}%`;
})

function onStart() {
  totalSeconds = Number(sec.value) + Number(min.value) * 60 + Number(hour.value) * 60 * 60

  if (checkError(totalSeconds)) return;
  start.value = true;

  interval = setInterval(() => {
    elapsed += 0.1;
    progress.value = Math.min(1, (elapsed / totalSeconds))

    if (progress.value >= 1) {
      execute()
    }
  }, 100)
}

async function execute() {
  clearInterval(interval)
  props.submitFunc()
  ++executeNum.value
  //onDialogOK({ server: props.servers, message: props.message })

  if (repeat.value === false) return;
  if (executeNum.value >= repeatNum.value) return;

  elapsed = 0;
  totalSeconds = Number(repeatSec.value) + Number(repeatMin.value) * 60 + Number(repeatHour.value) * 60 * 60

  if (checkError(totalSeconds)) return;

  interval = setInterval(() => {
    elapsed += 0.1;
    progress.value = Math.min(1, (elapsed / totalSeconds))

    if (progress.value >= 1) {
      execute()
    }
  }, 100)
}

function checkError(seconds) {
  if (props.message === '') {
    $q.notify({
      message: `보낼 메세지가 빈값입니다. 확인해주세요.`,
      color: "negative",
      icon: "error",
    })
    return true;
  }

  if (props.servers.length <= 0) {
    $q.notify({
      message: `선택된 서버가 없습니다.`,
      color: "negative",
      icon: "error",
    })
    return true;
  }

  if (seconds <= 0) {
    $q.notify({
      message: `'0'이하의 값은 설정할수 없습니다.`,
      color: "negative",
      icon: "error",
    })
    return true;
  }

  if (seconds < 10) {
    $q.notify({
      message: `타이머는 기본 '10'초 이상으로 설정 가능합니다.`,
      color: "negative",
      icon: "error",
    })
    return true;
  }
  return false
}

function onCancelClick() {
  if (interval) {
    clearInterval(interval)
  }
  onDialogCancel()
}

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})

</script>
