<template>
  <div>
    <q-form ref="myForm" greedy @submit.prevent="onSubmit" @reset="onReset">
      <!-- select Server -->
      <div v-if="inputServer" class="q-gutter-x-sm">
        <span>서버: </span>
        <q-checkbox v-model="form.servers" val="koromon" label="코로몬" color="teal" />
        <q-checkbox v-model="form.servers" val="motimon" label="모티몬" color="orange" />
        <q-checkbox v-model="form.servers" val="tokomon" label="토코몬" color="red" />
        <q-checkbox v-model="form.servers" val="dungsilmon" label="둥실몬" color="cyan" />
      </div>
      <div v-if="inputDate" class="row q-gutter-x-md">
        <!-- date Picker: startDate-->
        <q-input outlined v-model="form.startDate" mask="date" :rules="['date']" class="col">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="form.startDate">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <!-- date Picker: endDate-->
        <q-input outlined v-model="form.endDate" mask="date" :rules="['date']" class="col">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="form.endDate">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <!-- keywords -->
      <q-input v-if="inputKeyword" outlined v-model.trim="form.keyword" label="Keywords" autofocus />
      <div class="q-gutter-x-sm row">
        <q-space />
        <q-btn label="Submit" type="submit" color="primary" />
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  inputServer: Boolean,
  inputDate: Boolean,
  inputKeyword: Boolean,
})

const emit = defineEmits(['on-submit'])

const myForm = ref(null)
const form = ref({
  keyword: '',
  startDate: '2023/01/01',
  endDate: '2023/01/01',
  servers: []
})

const validate = () => {
  myForm.value.validate().then((success) => {
    if (success) {
      // ..성공
    } else {
      // 실패
    }
  })
}

const reset = () => {
  myForm.value.resetValidation()
}

const onSubmit = () => {
  emit('on-submit', form.value)
}

const onReset = () => {
  form.value.keyword = '';
}

</script>
