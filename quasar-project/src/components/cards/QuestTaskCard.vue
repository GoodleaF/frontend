<template>
  <q-card>
    <q-card-section>
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="text-h6">{{ task.taskId }}</div>
          <div class="text-subtitle2">{{ task.processCount }}</div>
        </div>

        <div class="col-auto">
          <!-- 진행상황 변경 list-->
          <q-btn round flat icon="more_horiz">
            <q-menu cover auto-close>
              <q-list>
                <q-item clickable @click="emit('modified', 1)">
                  <q-item-section>None</q-item-section>
                </q-item>
                <q-item clickable @click="emit('modified', 1)">
                  <q-item-section>진행중</q-item-section>
                </q-item>
                <q-item clickable @click="emit('modified', 2)">
                  <q-item-section>완료</q-item-section>
                </q-item>
                <q-item clickable @click="emit('modified', 3)">
                  <q-item-section>보상완료</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
const props = defineProps({
  task: {
    type: Object,
    require: true
  }
})

const emit = defineEmits(['modified'])

</script>
