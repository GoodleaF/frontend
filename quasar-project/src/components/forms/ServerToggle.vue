<!--
  여러 서버를 Checkbox로 선택할 수 있는 Component
-->

<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-checkbox v-model="selectAll" @update:model-value="toggleAll" label="All" color="grey-8" />
      <q-checkbox v-model="selection" v-for="options in serverOptions" :key="options.value" :val="options.value"
        :label="options.label" :color="options.color" @update:model-value="updateValue" />
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted } from 'vue'
import { useServerStore } from 'stores/server.js'

const emit = defineEmits(['changed'])

const serverStore = useServerStore();
const serverOptions = serverStore.Options

const selectAll = ref(true)
const selection = ref(serverStore.Values)

onMounted(() => {
  emit('changed', selection.value)
})

function updateValue(e) {
  if (serverStore.Options.length === selection.value.length) {
    selectAll.value = true
  } else {
    selectAll.value = false
  }
  emit('changed', selection.value)
}

function toggleAll(e) {
  if (e === false) {
    selection.value = []
  } else {
    selection.value = serverStore.Values
  }
  emit('changed', selection.value)
}
</script>
