<template>
  <q-page>
    <h2>Log</h2>
    <q-form @submit.prevent="onSubmit">
      <div class="row q-gutter-md">
        <div class="col">
          <q-input outlined bottom-slots type="search" label="target tamer name or idx" v-model="searchKeyward" lazy-rules
            :rules="emptyRules">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <div class="col-2 column">
          <q-btn class="q-pa-md" label="Submit" type="submit" color="primary" />
        </div>
      </div>
    </q-form>

    <SimpleDataTable :data="datas"></SimpleDataTable>
  </q-page>
</template>

<script>
import { ref } from 'vue'
const columns = [
  {
    name: 'id',
    required: true,
    label: 'id',
    align: 'left',
    field: row => row.id,
    format: val => `${val}`,
    sortable: true
  }
]

import apiBoard from '../api/test-axios'
import SimpleDataTable from '../components/SimpleDataTable.vue'
export default {
  setup() {
    const filter = ref("");
    const searchKeyward = ref("");
    const datas = ref([]);
    async function onSubmit() {
      try {
        const response = await apiBoard.getArticles(searchKeyward.value);
        if (response) {
          datas.value = response.data;
        }
      }
      catch (e) {
        console.error(e);
      }
    }
    const emptyRules = [
      (val) => { return (val && val.length > 0) || "Please do not empty"; }
    ];
    return {
      filter,
      searchKeyward,
      emptyRules,
      columns,
      datas,
      onSubmit
    };
  },
  components: { SimpleDataTable }
}
</script>
<style scoped></style>
