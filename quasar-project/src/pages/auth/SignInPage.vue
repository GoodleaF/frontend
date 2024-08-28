<template>
  <q-page>
    <div class="row full-height no-wrap">
      <div class="image-container col-12 col-md-6">
        <q-img src="/LoginImage.png" />
      </div>
      <div class="col flex flex-center">
        <q-card flat :style="{ minWidth: '400px' }">
          <q-card-section>
            <div class="text-h6 text-weight-bold">로그인</div>
          </q-card-section>

          <!-- 입력 양식 -->
          <q-card-section>
            <q-form @submit.prevent="onSubmit">
              <div class="q-gutter-y-lg">
                <q-input v-model="id" filled label="아이디" lazy-rules
                  :rules="[val => val && val.length > 0 || '필수 입력 사항입니다']"></q-input>
                <q-input v-model="password" filled type="password" label="비밀번호" lazy-rules
                  :rules="[val => val && val.length > 0 || '필수 입력 사항입니다']"></q-input>
              </div>
              <q-btn type="submit" class="full-width q-mt-lg" unelevated color="primary" size="lg" label="로그인"></q-btn>
              <q-btn class="full-width q-mt-md" unelevated label="등록" to="/auth/sign-up"></q-btn>
              <!--q-btn class="full-width q-mt-xs" unelevated label="메인페이지로 이동" to="/"></!--q-btn-->
            </q-form>
          </q-card-section>

        </q-card>
      </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth';
import { useRouter } from 'vue-router';

const store = useAuthStore()
const router = useRouter()

const id = ref(null)
const password = ref(null)

const $q = useQuasar()
const leftColstyle = computed(() => ({ hidden: $q.screen.lt.md }))

const onSubmit = async () => {
  try {
    const result = await store.logIn(id.value, password.value)
    if (result.status === 200) {
      router.push('/')
    }
  } catch (err) {
    console.error(err)
  }
}
</script>

<style lang="scss" scoped>
.signin-page {
  .full-height {
    height: calc(100vh - 50px);
    overflow: hidden;
  }

  .image-container {
    background: url('/LoginImage.png') no-repeat center center;
    background-size: cover;
  }

  .form-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 767px) {
    .image-container {
      display: none;
    }
  }
}
</style>