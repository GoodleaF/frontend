<template>
  <div id="q-app" style="min-height: 100vh">
    <div class="q-pa-md">
      <q-table :rows="data" row-key="id" :filter="filter" :title="title">
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  line: {
    type: Number,
    default: 10
  },
  title: {
    type: String,
    default: ''
  }
});
const filter = ref('')

const pagination = {
  page: 1,
  rowsPerPage: props.line
}

</script>
