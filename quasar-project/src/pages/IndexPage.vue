<template>
  <q-page class="page-background"></q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage'
})
</script>

<style lang="scss" scoped>
.page-background {
  background-image: url('/BearBrickMain.png');
  background-size: contain;
  background-position: center center; 
  background-repeat: no-repeat;
  height: calc(100vh - var(q-toolbar)); 
  padding-left: var(-250);
  box-sizing: border-box;
  overflow: hidden;
}
</style>
