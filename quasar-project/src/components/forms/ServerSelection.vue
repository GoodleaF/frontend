<template>
  <q-select outlined emit-value :model-value="modelValue" :options="serverOptions" label="서버"
    :display-value="displayValue()" @update:model-value="updateValue" />
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue'
import { useServerStore } from 'stores/server.js'

const serverStore = useServerStore();
const serverOptions = serverStore.Options

const props = defineProps({
  modelValue: { type: String, default: 'base_game01' },
})
const emit = defineEmits(['changed'])

function updateValue(e) {
  emit('changed', e)
}

function displayValue() {
  return serverOptions.find(el => el.value == props.modelValue).label
}

</script>
