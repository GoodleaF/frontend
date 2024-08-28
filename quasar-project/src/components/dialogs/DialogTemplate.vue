<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <h2> Test Dialog</h2>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="OK" @click="onOKClick" />
        <q-btn color="primary" label="Cancel" @click="onCancelClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useDialogPluginComponent } from 'quasar'

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const emits = defineEmits([
  ...useDialogPluginComponent.emits
])

function onOKClick() {
  onDialogOK()
}
function onCancelClick() {
  onDialogCancel()
}
</script>
