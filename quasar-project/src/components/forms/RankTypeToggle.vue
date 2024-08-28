<!--
  여러 랭크타입을 Checkbox로 선택할 수 있는 Component
-->

<template>
    <div class="q-pa-md">
      <div class="q-gutter-sm">
        <q-checkbox v-model="selectAll" @update:model-value="toggleAll" label="All" color="grey-8" />
        <q-checkbox v-model="selection" v-for="options in rankTypeOptions" :key="options.value" :val="options.value"
          :label="`${options.label}(${options.value})`" :color="options.color" @update:model-value="updateValue" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits, onMounted } from 'vue'
  import { useRankTypeStore } from 'stores/rankType.js'
  
  const emit = defineEmits(['changed'])
  
  const rankTypeStore = useRankTypeStore();
  const rankTypeOptions = rankTypeStore.Options
  
  const selectAll = ref(true)
  const selection = ref(rankTypeStore.Values)
  
  onMounted(() => {
    emit('changed', selection.value)
  })
  
  function updateValue(e) {
    if (rankTypeStore.Options.length === selection.value.length) {
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
      selection.value = rankTypeStore.Values
    }
    emit('changed', selection.value)
  }
  </script>
  