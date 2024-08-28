<template>
  <q-page class="flex flex-center">
    <q-card flat :style="{ minWidth: '400px' }">

      <q-card-section>
        <div class="text-h5 text-weight-bold text-center">운영자 등록</div>
        <p class="text-center" style="color: red">등록 후 승인이 필요합니다. 담당자에게 요청하세요</p>
      </q-card-section>

      <!-- 입력 양식 -->
      <q-card-section>
        <q-form greedy @submit.prevent="onSubmit">
          <div class="q-gutter-y-lg">
            <q-input v-model="id" filled label="아이디" hint="20자 이하로 입력해주세요"
              :rules="[val => val && val.length > 0 || '필수 입력 사항입니다', val => val && val.length < 20 || '20자 이하로 입력해주세요']" />
            <q-input v-model="password" filled type="password" label="비밀번호" hint="6자이상" lazy-rules :rules="[val => val && val.length > 0 && val.length || '필수 입력 사항입니다',
              val => val && val.length >= 6 && val.length || '6자 이상 입력해주세요']" />
            <q-input v-model="password2" filled type="password" label="비밀번호 확인" lazy-rules
              :rules="[val => val && val.length > 0 || '필수 입력 사항입니다', val => password == password2 || '비밀번호가 일치하지 않습니다']" />
            <q-input v-model="fullName" filled label="이름" lazy-rules
              :rules="[val => val && val.length > 0 || '필수 입력 사항입니다']" />
          </div>

          <q-btn type="submit" class="full-width q-mt-lg" unelevated color="secondary" size="lg" label="등록"></q-btn>
          <q-btn class="full-width q-mt-md" unelevated label="로그인 페이지로" to="/auth/sign-in"></q-btn>
        </q-form>
      </q-card-section>

    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from 'src/stores/auth';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar'

const store = useAuthStore()
const router = useRouter()
const $q = useQuasar()

const id = ref(null)
const password = ref(null)
const password2 = ref(null)
const fullName = ref(null)

const onSubmit = async () => {
  try {
    const result = await store.signUp(id.value, password.value, fullName.value)
    if (result.status === 200) {
      router.push('/auth/sign-in')
      $q.notify('성공적으로 생성되었습니다.')
    }
  } catch (err) {
    console.error(err)
  }
}
</script>
