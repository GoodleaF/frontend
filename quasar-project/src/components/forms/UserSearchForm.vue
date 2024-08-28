<!--
  User의 정보를 검색하는 Form Component
-->
<template>
  <q-form ref="myForm" greedy @submit.prevent="onSubmit">
    <div class="q-gutter-x-sm row">
      <ServerSelection v-model:modelValue="form.server" @changed="onSelectionChanged" />
      <q-input class="col" outlined v-model.trim="form.keyword" label="user name" autofocus />
      <q-btn ref="formButton" class="col-1.5" label="검색" type="submit" color="primary" />
    </div>
  </q-form>
</template>

<script setup>
import { ref, defineEmits, defineExpose } from 'vue'
import ServerSelection from './ServerSelection.vue'
import { useQuasar } from 'quasar'
const $q = useQuasar();

const emit = defineEmits(['on-submit'])

//폼
const myForm = ref(null);
const formButton = ref(null);
//폼 데이터
const form = ref({
  server: 'bearbrick_game01',
  keyword: '',
})

const onSubmit = () => {
  emit('on-submit', form.value)
}

const clear = () => {
  form.value.keyword = ''
}

//외부 호출하기 위함
const setFormDataAndSubmit = (server, keyword) => {
  form.value.server = server;
  form.value.keyword = keyword;

  onSubmit();
}

const onSelectionChanged = (value) => {
  form.value.server = value
}

defineExpose({
  clear,
  setFormDataAndSubmit
})

</script>
