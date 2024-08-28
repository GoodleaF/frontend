<template>
  <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-2">
    <q-card :class="getCardClass()">
      <!-- 디지몬 정보 title -->
      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6">{{ digimon.name }}({{ digimon.presentClassId }})</div>
            <div class="text-subtitle2">{{ digimon.dgmonIdx }}</div>
          </div>

          <!-- 추가 메뉴 -->
          <div class="col-auto">
            <q-btn round flat icon="more_horiz">
              <q-menu auto-close>
                <q-list>
                  <q-item clickable>
                    <q-item-section @click="showPotentials()">Potential</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </q-card-section>

      <q-separator dark inset />
      <!-- 디지몬 정보 Detail -->
      <q-card-section horizontal>
        <q-card-section>
          <div> <span>친 밀 도: </span> <span>{{ digimon.friendShip / 1000 }}%</span></div>
          <div> 진화실패: {{ digimon.isEvoFailed === 1 ? 'Yes' : 'No' }}</div>
          <div> 교정여부: {{ digimon.AdditionalStat === 1 ? 'Yes' : 'No' }}</div>
          <div> 슬롯번호: {{ getSlotNo() }}</div>
          <div> 잠김여부: {{ digimon.isLocked === 1 ? 'Yes' : 'No' }}</div>
        </q-card-section>
        <q-space></q-space>
        <q-card-section vertical>
          <div> LV. {{ digimon.dgmonLv }}</div>
          <div> Exp. {{ digimon.dgmonExp }}</div>
          <div> HP. {{ digimon.hp }}</div>
          <div> SP. {{ digimon.sp }}</div>
          <div> EVP. {{ digimon.evp }}</div>
        </q-card-section>
      </q-card-section>
      <q-card-section vertcal class="text-center">
        <div> 부화날짜: {{ moment.utc(digimon.regDate).format("YYYY-MM-DD HH:mm:ss") }}</div>
        <div v-if="digimon.isDeleted === 1"> 삭제날짜: {{ moment.utc(digimon.deleteDate).format("YYYY-MM-DD HH:mm:ss") }}
        </div>
      </q-card-section>
    </q-card>
  </div>

  <!-- Potential Dialog -->
  <q-dialog v-model="isPotentialShown">
    <DigimonPotentialDialog v-if="isPotentialShown" v-bind="potentials"></DigimonPotentialDialog>
  </q-dialog>
</template>

<script setup>
import { ref, defineProps } from 'vue';
import { useUserStore } from 'stores/user.js'
import { useQuasar } from 'quasar'

import DigimonPotentialDialog from 'components/dialogs/DigimonPotentialDialog.vue'

import moment from 'moment'

const $q = useQuasar()
const store = useUserStore();

const props = defineProps({
  digimon: {
    type: Object,
    require: true
  },
})

const isPotentialShown = ref(false)

function getCardClass() {
  let myCardClass = props.digimon.isDeleted === 1 ? 'bg-grey-9' : props.digimon.slotNo < 100 ? 'bg-primary' : 'bg-secondary'
  myCardClass += ' text-white'
  return myCardClass
}

function getSlotNo() {
  return props.digimon.slotNo < 100 ? props.digimon.slotNo : props.digimon.storageIndex
}

const potentials = ref({
  potentialTemp: 0,
  potential1: 0,
  potential2: 0,
  potential3: 0,
  potential4: 0,
})

async function showPotentials() {
  try {
    const result = await store.getDigimonPotentials(props.digimon.dgmonIdx)
    if (result.length > 0) {
      potentials.value = result[0]
    } else {
      potentials.value = {
        potentialTemp: 0,
        potential1: 0,
        potential2: 0,
        potential3: 0,
        potential4: 0,
      }
    }
    isPotentialShown.value = true
  } catch (e) {
    console.error(e)
  }
}

</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 500px
</style>
