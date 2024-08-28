<template>
  <q-page padding class="q-gutter-y-md">
    <h5 class="text-bold text-center"> 동시 접속자 수 </h5>
    <!-- 날짜 선택-->
    <div class="flex flex-center q-gutter-x-md">
      <div class="q-pa-md" style="max-width: 300px">
        <q-input filled v-model="date" mask="date" :rules="['date']">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="date" color="secondary">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="secondary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>
    <!-- 차트 -->
    <div>
      <q-card class="q-mx-md">
        <BarChart v-bind="barChartProps" />
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import Chart from 'chart.js/auto'
import { BarChart, useBarChart } from 'vue-chart-3';
import { ref, computed, watch, onMounted } from 'vue';
import { useServerStore } from 'stores/server.js'
import { useStatisticsStore } from 'src/stores/statistics';
import moment from 'moment';
import { useSocketStore } from 'src/stores/socket';
const socket = useSocketStore()
const serverStore = useServerStore();
const statisticsStore = useStatisticsStore()
const date = ref(moment().format('YYYY/MM/DD'))

let hours = Array(24).fill().map((_, index) => index);
let defaultData = Array(24).fill().map((_, index) => 0);
const result = ref([])

function getArrValueOrZero(arr, index) {
  let value = arr[index];
  return (value === null || value === undefined) ? 0 : value;
}

const sumResult = computed(() => {
  let returnArray = []
  for (let i = 0; i < hours.length; ++i) {
    let sum = 0;
    result.value.forEach((e) => { sum += getArrValueOrZero(e.datas, i) })
    returnArray.push(sum);
  }
  return returnArray
})

const datasets = computed(() => (
  [
    {
      label: '전체',
      data: sumResult.value,
      backgroundColor: "#AAAAAA"
    },
    ...result.value.map((e) => ({
      label: serverStore.Servers[e.server].label,
      data: e.datas,
      backgroundColor: serverStore.Servers[e.server].color
    })),
  ]
))

const chartData = computed(() => {
  if (result.value.length === 0) {
    return {
      lables: hours,
      datasets: [{
        label: '전체',
        data: defaultData,
        backgroundColor: "#AAAAAA"
      }]
    }
  }
  return {
    labels: hours,
    datasets: datasets.value
  }
});

const { barChartProps, barChartRef } = useBarChart({
  chartData,
});

watch(date, function (newValue, oldValue) {
  if (newValue === null) {
    date.value = oldValue
    return;
  };
  if (oldValue === null) return;
  if (newValue === oldValue) return;

  loadData()
})

async function loadData() {
  await statisticsStore.loadConcurrentUser(date.value)
  result.value = statisticsStore.ConCurrentUser
}

onMounted(async () => {
  await loadData()
})
</script>

