<template>
  <q-page padding class="q-gutter-y-md">
    <h5 class="text-bold text-center">복귀 유저 잔존율 조회</h5>

    <div class="q-gutter-x-sm row">
        <!-- 시작 날짜 선택 -->
        <q-input class="col" v-model="startDate" type="date" label="시작 날짜 선택" @input="clearData" />

        <!-- 종료 날짜 선택 -->
        <q-input class="col" v-model="endDate" type="date" label="종료 날짜 선택" @input="clearData" />

        <!-- 검색 버튼 -->
        <q-btn class="col-1.5" label="검색" @click="fetchData" color="primary" />
        <!-- 엑셀 버튼 -->
        <q-btn label="엑셀로 내보내기" @click="exportToExcel" color="secondary" class="q-ml-md" />
    </div>

    <!-- 결과 표시 -->
    <q-table
      title="복귀 유저 잔존율 목록"
      :rows="statisticsStore.returnUserRetention"
      :columns="columns"
      :rows-per-page-options="[50, 100, 150, 200]"
      :rows-per-page="[50, 100, 150, 200]"
      row-key="userid"
    >
      <template #body="props">
        <q-tr :props="props">
          <q-td key="return_date" :props="props">{{ props.row.return_date }}</q-td>
          <q-td key="total_return_users" :props="props">{{ props.row.total_return_users }}</q-td>
          <q-td key="D1_users" :props="props">{{ props.row.D1_users }} ({{ props.row.D1_percentage }}%)</q-td>
          <q-td key="D2_users" :props="props">{{ props.row.D2_users }} ({{ props.row.D2_percentage }}%)</q-td>
          <q-td key="D3_users" :props="props">{{ props.row.D3_users }} ({{ props.row.D3_percentage }}%)</q-td>
          <q-td key="D7_users" :props="props">{{ props.row.D7_users }} ({{ props.row.D7_percentage }}%)</q-td>
          <q-td key="D14_users" :props="props">{{ props.row.D14_users }} ({{ props.row.D14_percentage }}%)</q-td>
          <q-td key="D30_users" :props="props">{{ props.row.D30_users }} ({{ props.row.D30_percentage }}%)</q-td>
        </q-tr>
      </template>
    </q-table>
    <div class="q-mt-md">
      <q-card class="q-mx-md">
        <LineChart :key="chartKey" v-bind="lineChartProps" />
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import Chart from 'chart.js/auto';
import { LineChart, useLineChart } from 'vue-chart-3';
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { useStatisticsStore } from 'src/stores/statistics';
import { utils, writeFile } from 'xlsx';
import { useRouter } from 'vue-router';

const formatDate = (date) => {
  let dd = date.getDate();
  let mm = date.getMonth() + 1; // 1월은 0
  const yyyy = date.getFullYear();
  
  if(dd < 10) {
      dd = '0' + dd;
  } 
  
  if(mm < 10) {
      mm = '0' + mm;
  } 

  return yyyy + '-' + mm + '-' + dd;
}

const oneMonthAgo = new Date();
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

const startDate = ref(formatDate(oneMonthAgo));
const endDate = ref(formatDate(new Date()));
const statisticsStore = useStatisticsStore();
const chartKey = ref(0);

const columns = [
  { name: 'return_date', label: '복귀 일자', field: 'return_date', align: 'center', sortable: true },
  { name: 'total_return_users', label: '복귀 유저수(RAU)', field: 'total_return_users', align: 'center', sortable: true },
  { name: 'D1_users', label: 'D-1 접속 유저수', field: 'D1_users', align: 'center', sortable: true },
  { name: 'D2_users', label: 'D-2 접속 유저수', field: 'D2_users', align: 'center', sortable: true },
  { name: 'D3_users', label: 'D-3 접속 유저수', field: 'D3_users', align: 'center', sortable: true },
  { name: 'D7_users', label: 'D-7 접속 유저수', field: 'D7_users', align: 'center', sortable: true },
  { name: 'D14_users', label: 'D-14 접속 유저수', field: 'D14_users', align: 'center', sortable: true },
  { name: 'D30_users', label: 'D-30 접속 유저수', field: 'D30_users', align: 'center', sortable: true },
];

const exportToExcel = () => {
  const ws = utils.json_to_sheet(statisticsStore.returnUserRetention);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, "복귀 유저 잔존율");
  const filename = `복귀 유저 잔존율 ${startDate.value}.xlsx`;
  writeFile(wb, filename);
}

const { returnUserRetention } = statisticsStore;

const chartLabels = (data) => {
  return data.map(item => item.return_date);
};

const chartDatasets = (data) => {
  const datasets = [];
  const labels = ["D1", "D2", "D3", "D7", "D14", "D30"];
  const colors = [
    "#64B5F6",
    "#EF9A9A",
    "#81C784",
    "#FB8C00",
    "#5C6BC0",
    "#B39DDB",
    "#B71C1C",
  ];

  for (let i = 0; i < labels.length; i++ ) {
    const dataset = {
      label: `${labels[i]} 잔존율`,
      data: data.map((item) => {
        return item[`${labels[i]}_percentage`];
      }),
      borderColor: colors[i],
    };
    datasets.push(dataset);
  }
  return datasets;
};

const chartData = ref({ 
  labels: chartLabels(returnUserRetention),
  datasets: chartDatasets(returnUserRetention)
});

watch(() => statisticsStore.returnUserRetention, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    chartData.value = {
      labels: chartLabels(returnUserRetention),
      datasets: chartDatasets(returnUserRetention)
    };
    chartKey.value++;
  }
}, { deep: true });

const { lineChartProps } = useLineChart({
  chartData,
});

const router =  useRouter();

const fetchData = async () => {
  const data = await statisticsStore.loadReturnUserRetention({ start: startDate.value, end: endDate.value });

  await nextTick();

  chartData.value = {
    labels: chartLabels(data),
    datasets: chartDatasets(data)
  };

  await nextTick();
};

const clearData = () => {
  statisticsStore.returnUserRetention = [];
};
</script>
