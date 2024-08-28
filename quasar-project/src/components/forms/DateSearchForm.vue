<!-- StartDate ~ EndDate를 선택하는 Form Component -->
<template>
  <q-form @submit="onSubmit">
    <div class="row q-gutter-md">
      <!-- 모든 date 선택 Check Box-->
      <div class="col-1">
        <q-checkbox v-model="searchAll" label="All" color="teal" />
      </div>

      <!-- Start Date 선택 -->
      <div class="col-4">
        <q-input v-model="beginDate" input-class="text-right" outlined type="date" label-slot clearable lazy-rules
          :rules="emptyRules">
          <template v-slot:label>
            <div class="row items-center all-pointer-events">
              <q-icon class="q-mr-xs" color="deep-orange" size="24px" name="today" />
              begin date
            </div>
          </template>
        </q-input>
      </div>

      <!-- End Date 선택 -->
      <div class="col-4">
        <q-input v-model="endDate" input-class="text-right" outlined type="date" label-slot clearable lazy-rules
          :rules="emptyRules">
          <template v-slot:label>
            <div class="row items-center all-pointer-events">
              <q-icon class="q-mr-xs" color="deep-orange" size="24px" name="today" />
              end date
            </div>
          </template>
        </q-input>
      </div>

      <!-- submit -->
      <div class="col column">
        <q-btn class="q-pa-md" label="검색" type="submit" color="primary" />
      </div>
    </div>
  </q-form>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import moment from 'moment'

const emit = defineEmits(['on-submit'])
const beginDate = ref(moment().subtract(3, 'month').format('YYYY-MM-DD'))

const endDate = ref(moment().format('YYYY-MM-DD'))
const searchAll = ref(false)

function onSubmit() {
  emit('on-submit', searchAll.value, beginDate.value, endDate.value)
}

const emptyRules = [val => (val && val.length > 0) || 'Please do not empty']

defineExpose({
  onSubmit
})
</script>
