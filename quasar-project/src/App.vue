<template>
  <router-view />
</template>

<script>
import { preFetch } from 'quasar/wrappers';
import { defineComponent } from 'vue'
import { SessionStorage } from 'quasar';

export default {
  defineComponent: ({
    name: 'App'
  }),
  preFetch({ store, currentRoute, previousRoute, redirect, ssrContext, urlPath, publicPath }) {
    if (!SessionStorage.has("manager")) {
      redirect({ path: "/auth/sign-in" });
    }
  }
}
</script>
