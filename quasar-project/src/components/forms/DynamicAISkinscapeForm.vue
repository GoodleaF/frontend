<!-- 전달할 컨셉 키워드를 적는 Form Component -->
<template>
  <q-form ref="fomr" greedy @submit.prevent="onSubmit">
    <ServerToggle @changed="onServerChanged" />
    <div class="q-gutter-x-sm row">
      <q-input v-model.trim="form.keyword" class="col" outlined rounded bg-color="white" label="명령어를 입력해 주세요 ex) Pattern: Round Stars, Color: Blue, Yellow, Black, Drawn by Van Gogh" autofocus>
      </q-input>

      <q-input v-model.number="form.selectedTime" type="number" class="col-auto" outlined rounded bg-color="white" label="시간 (초)" dense placeholder="기본값: 60초">
      </q-input>

      <q-btn type="submit" class="col-1" round dense flat icon="send" color="white" />
      <q-btn class="col-1" round dense flat icon="timer" color="white" @click="callTimer" />
    </div>
  </q-form>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { useQuasar } from 'quasar';
import { useServerStore } from 'src/stores/server';
import ServerToggle from './ServerToggle.vue'
import DynamicSkinScapeTimerDialog from '../dialogs/DynamicSkinScapeTimerDialog.vue';

const emit = defineEmits(['on-submit'])

const $q = useQuasar();
const serverStore = useServerStore();

const form = ref({
  servers: serverStore.Values,
  keyword: '',
  selectedTime: 60
})

const onServerChanged = (serverList) => {
  form.value.servers = serverList;
}

const callTimer = () => {
  if (form.value.keyword === '') {
    $q.notify({
      message: "보낼 메세지가 빈값입니다. 확인해주세요.",
      color: "negative",
      icon: "error",
    })
    return;
  }

  if (form.value.servers.length <= 0) {
    $q.notify({
      message: "선택된 서버가 없습니다.",
      color: "negative",
      icon: "error",
    })
    return;
  }

  $q.dialog({
    persistent: true,
    component: DynamicSkinScapeTimerDialog,
    componentProps: {
      servers: form.value.servers,
      message: form.value.keyword,
      timer: form.value.selectedTime,
      submitFunc: onSubmit
    },
  }).onDismiss(() => {

  })
}

let preventFrequentSend = false
function onSubmit() {
  if (form.value.keyword === '') {
    $q.notify({
      message: "보낼 메세지가 빈값입니다. 확인해주세요.",
      color: "negative",
      icon: "error",
    })
    return;
  }

  if (form.value.servers.length <= 0) {
    $q.notify({
      message: "선택된 서버가 없습니다.",
      color: "negative",
      icon: "error",
    })
    return;
  }

  if (preventFrequentSend) {
    $q.notify({
      message: "잦은 생성을 막기위해 1초를 기다려야 합니다.",
      color: "negative",
      icon: "error",
    })
    return;
  }

  if (IsStringOverFlowed(form.value.keyword, 300)) {
    $q.notify({
      message: "300자 이하로 가능합니다.",
      color: "negative",
      icon: "error",
    })
    return;
  }
  emit('on-submit', form.value)

  preventFrequentSend = true;

  setTimeout(() => {
    preventFrequentSend = false;
  }, 1000 * 1) //사실은 9초지롱(타이머 10초 반복을 위해 1초 적게 잡음)//10초 너무 길어서 1초로 줄임(타이머는 몰?루)
}


function stringToUtf16Bytes(str) {
  let bytes = [];
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i);
    bytes.push((code >> 8) & 0xff); // high byte
    bytes.push(code & 0xff); // low byte
  }
  return new Uint8Array(bytes);
}

function IsStringOverFlowed(str, limit) {
  const bytes = stringToUtf16Bytes(str)
  const length = bytes.length
  return length > limit;
}
</script>
