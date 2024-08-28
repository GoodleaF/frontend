<template>
  <q-page>
    <DigimonPotentialDialog :potential1="305275392" :potential2="1195507730" :potential3="1431655765"
      :potential4="5329236"></DigimonPotentialDialog>
  </q-page>
</template>

<script setup>
import { ref, onBeforeMount, onUnmounted } from 'vue'
import { socketClient } from 'src/socket'

import DigimonPotentialDialog from 'src/components/dialogs/DigimonPotentialDialog.vue';


onBeforeMount(async () => {
  await socketClient.registerEvent("item_payment_confirm_res", itemPaymentConfirmResponse)
})

onUnmounted(async () => {
  await socketClient.deregisterEvent("item_payment_confirm_res", itemPaymentConfirmResponse)
})

async function itemPaymentConfirmResponse(res) {
  if (res.result) {
    detailForm.value.confirm = res.data.fullName;
    detailForm.value.confirmDate = moment();
  } else {
    socketClient.NotifyError(res.message)
  }
}

</script>
<style scoped></style>
