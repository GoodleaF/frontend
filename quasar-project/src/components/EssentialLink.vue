<!-- 사이드바 Link 버튼-->
<template>
  <router-link :to="link" class="delunderline">
    <q-item clickable v-ripple dense class="q-py-sm">
      <q-item-section v-if="icon" avatar>
        <q-icon :name="icon" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ title }}</q-item-label>
        <q-item-label caption>{{ caption }}</q-item-label>
      </q-item-section>
    </q-item>
  </router-link>
</template>

<script setup>
import { defineProps, toRefs } from 'vue'
const props = defineProps({
  title: {
    type: String,
    required: true
  },

  caption: {
    type: String,
    default: ''
  },

  link: {
    type: String,
    default: ''
  },

  icon: {
    type: String,
    default: ''
  }
})
const refs = toRefs(props)

</script>
<style scoped>
.delunderline {
  text-decoration: none;
}
</style>
