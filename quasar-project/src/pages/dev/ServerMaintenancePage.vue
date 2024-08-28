<template>
  <q-page class="flex flex-center">
    <div class="flex row justify-center q-gutter-x-lg">
      <div class="flex column items-center" style="margin-right: 50px;">
       <div class="text-h6 q-mb-md">전체 유저 킥</div>
       <q-btn size="200px" round dense color="negative" icon="report" @click="onClickKickBtn" />
      </div>

      <div class="flex column items-center">
        <div class="text-h6 q-mb-md">접속 허용</div>
        <q-btn size="200px" round dense color="positive" icon="add" @click="onClickAcceptBtn" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useQuasar } from 'quasar';
import { useSocketStore } from 'src/stores/socket';

const $q = useQuasar();
const socket = useSocketStore();

onMounted(() => {

})

function onClickKickBtn() {
  $q.dialog({
    title: "경고",
    message: "모든 유저의 접속을 종료, 차단 합니다.",
    cancel: true
  }).onOk(() => {
    $q.dialog({
      title: "경고",
      message: "정말로 실행 하시겠습니까?",
      cancel: true
    }).onOk(() => {
      socket.send("kick_all_req", {data: null})
    })
  })
}

function onClickAcceptBtn() {
  $q.dialog({
    title: "알림",
    message: "유저의 접속을 허용하시겠습니까?",
    cancel: true
  }).onOk(() => {
    socket.send("accept_login_req");
  })
}

</script>
