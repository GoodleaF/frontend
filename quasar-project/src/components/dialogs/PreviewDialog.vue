<template>
  <q-dialog>
    <q-card>
      <q-card-section>
        <div v-html="message"></div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="닫기" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps({
  message: String
});
</script>
