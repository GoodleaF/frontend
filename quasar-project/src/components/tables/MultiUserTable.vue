<template>
  <q-table class="my-sticky-virtscroll-table" :rows="props2.rows" :columns="userColumns" row-key="userIdx" dense
    virtual-scroll v-model:pagination="userPagination" :rows-per-page-options="[0]">
    <template #header="props">
      <q-tr :props="props">
        <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
        <q-th quto-width />
      </q-tr>
    </template>
    <template #body="props">
      <q-tr :props="props">
        <q-td v-for="col in props.cols" :key="col.name" :props="props"> {{ col.value }}</q-td>
        <q-td v-if="props2.modifiable"><q-btn size="sm" label="삭제" color="negative"
            @click="emit('on-deleted', props.row)"></q-btn></q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue'
import { useServerStore } from 'src/stores/server'

const serv = useServerStore()
const emit = defineEmits(['on-deleted'])
const props2 = defineProps({
  rows: {
    type: Array,
    default: () => {
      return []
    }
  },
  modifiable: Boolean
})

const userColumns = [
  {
    name: 'server',
    label: '서버',
    field: row => serv.getLabel(row.server),
    align: 'center',
  },
  {
    name: 'userIdx',
    label: 'Id',
    field: 'userIdx',
    align: 'center',
  },
  {
    name: 'userName',
    label: '이름',
    field: 'userName',
    align: 'center',
  },
]

const userPagination = ref({
  rowsPerPage: 0
})
</script>


<style lang="sass">
.my-sticky-virtscroll-table
  /* height or max-height is important */
  max-height: 200px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #00b4ff

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>
