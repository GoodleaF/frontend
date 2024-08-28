<template>
  <div class="row q-gutter-x-md">
    <UserSearchForm class="col" @on-submit="onSearchUser" ref="userSearch" />
    <MultiUserTable class="col" :rows="users" @on-deleted="onDeleted" :modifiable="true" />
  </div>
</template>

<script setup>
import { ref, defineExpose } from 'vue'
import { useUserStore } from 'stores/user.js'
import { useQuasar } from 'quasar'
import UserSearchForm from 'components/forms/UserSearchForm.vue'
import MultiUserTable from '../tables/MultiUserTable.vue'

const userStore = useUserStore()
const userSearch = ref()
const $q = useQuasar()
const users = ref([])
//{ server: "koromon", accountId: '345341', userIdx: '123121', userName: '불꽃남자김활활' },

let seq = 0;

async function onSearchUser(form) {
  try {
    await userStore.loadUserInfo(form.server, form.keyword)

    const existed = users.value.some((e) =>
      e.userIdx === userStore.userInfo.userIdx && e.server === userStore.server
    )
    if (existed) {
      $q.notify({
        message: '이미 추가된 유저입니다.',
        color: 'warning'
      })
      return;
    }
    users.value.push({
      seq: seq++,
      server: userStore.server,
      accountId: userStore.userInfo.accountId,
      userIdx: userStore.userInfo.userIdx,
      userName: userStore.userInfo.userName,
    })
    userSearch.value.clear();
  } catch (err) {
    console.error(err)
    if (err.status === 401) router.push('/auth/sign-in')
  }
}

function onDeleted(userInfo) {
  users.value = users.value.filter((e) => e.userIdx !== userInfo.userIdx)
}

defineExpose({
  users
})
</script>

