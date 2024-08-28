<template>
  <TwoByTwoGridCard class="my-card bg-blue-grey-4" flat bordered>
    <template #item1>
      <TwoByTwoGridCard class="bg-blue-grey-2">
        <template #item1><q-card class="flex flex-center">{{ printStat(p1s1) }}</q-card></template>
        <template #item2><q-card class="flex flex-center">{{ printStat(p1s2) }}</q-card></template>
        <template #item3><q-card class="flex flex-center">{{ printStat(p1s3) }}</q-card></template>
        <template #item4><q-card class="flex flex-center">{{ printStat(p1s4) }}</q-card></template>
      </TwoByTwoGridCard>
    </template>
    <template #item2>
      <TwoByTwoGridCard class="bg-blue-grey-2">
        <template #item1><q-card class="flex flex-center">{{ printStat(p2s1) }}</q-card></template>
        <template #item2><q-card class="flex flex-center">{{ printStat(p2s2) }}</q-card></template>
        <template #item3><q-card class="flex flex-center">{{ printStat(p2s3) }}</q-card></template>
        <template #item4><q-card class="flex flex-center">{{ printStat(p2s4) }}</q-card></template>
      </TwoByTwoGridCard>
    </template>
    <template #item3>
      <TwoByTwoGridCard class="bg-blue-grey-2">
        <template #item1><q-card class="flex flex-center">{{ printStat(p4s1) }}</q-card></template>
        <template #item2><q-card class="flex flex-center">{{ printStat(p4s2) }}</q-card></template>
        <template #item3><q-card class="flex flex-center">{{ printStat(p4s3) }}</q-card></template>
        <template #item4><q-card class="flex flex-center">{{ printStat(p4s4) }}</q-card></template>
      </TwoByTwoGridCard>
    </template>
    <template #item4>
      <TwoByTwoGridCard class="bg-blue-grey-2">
        <template #item1><q-card class="flex flex-center">{{ printStat(p3s1) }}</q-card></template>
        <template #item2><q-card class="flex flex-center">{{ printStat(p3s2) }}</q-card></template>
        <template #item3><q-card class="flex flex-center">{{ printStat(p3s3) }}</q-card></template>
        <template #item4><q-card class="flex flex-center">{{ printStat(p3s4) }}</q-card></template>
      </TwoByTwoGridCard>
    </template>
  </TwoByTwoGridCard>
</template>

<script setup>
import { ref, onMounted, defineProps, watch, toRefs } from 'vue'
import TwoByTwoGridCard from 'components/cards/TwoByTwoGridCard.vue';

const props = defineProps({
  potential1: {
    type: Number,
    default: 0
  },
  potential2: {
    type: Number,
    default: 0
  },
  potential3: {
    type: Number,
    default: 0
  },
  potential4: {
    type: Number,
    default: 0
  },
})
const { potential1, potential2, potential3, potential4 } = toRefs(props)



onMounted(() => {
  toBinaryAndSeparate(props.potential1, p1s1, p1s2, p1s3, p1s4)
  toBinaryAndSeparate(props.potential2, p2s1, p2s2, p2s3, p2s4)
  toBinaryAndSeparate(props.potential3, p3s1, p3s2, p3s3, p3s4)
  toBinaryAndSeparate(props.potential4, p4s1, p4s2, p4s3, p4s4)
})


const p1s1 = ref('0000')
const p1s2 = ref('0000')
const p1s3 = ref('0000')
const p1s4 = ref('0000')

const p2s1 = ref('0000')
const p2s2 = ref('0000')
const p2s3 = ref('0000')
const p2s4 = ref('0000')

const p3s1 = ref('0000')
const p3s2 = ref('0000')
const p3s3 = ref('0000')
const p3s4 = ref('0000')

const p4s1 = ref('0000')
const p4s2 = ref('0000')
const p4s3 = ref('0000')
const p4s4 = ref('0000')

const stats = [
  {
    label: 'None',
    bgColor: 'gray',
    txtColor: 'white'
  },
  {
    label: 'STR',
    bgColor: 'gray',
    txtColor: 'white'
  },
  {
    label: 'INT',
    bgColor: 'gray',
    txtColor: 'white'
  },
  {
    label: 'DEF',
    bgColor: 'gray',
    txtColor: 'white'
  },
  {
    label: 'REG',
    bgColor: 'gray',
    txtColor: 'white'
  },
  {
    label: 'SPD',
    bgColor: 'gray',
    txtColor: 'white'
  },
  {
    label: 'CHAIN',
    bgColor: 'gray',
    txtColor: 'white'
  },
  {
    label: 'EVA',
    bgColor: 'gray',
    txtColor: 'white'
  },
]

function toBinaryAndSeparate(fullPotential, out1, out2, out3, out4) {
  let binaried = fullPotential.toString(2).padStart(32, '0')
  out1.value = binaried.substring(0, 8)
  out2.value = binaried.substring(8, 16)
  out3.value = binaried.substring(16, 24)
  out4.value = binaried.substring(24, 32)
}

function printStat(potential) {
  let statIndex = parseInt(potential.substring(0, 4), 2)
  let percent = parseInt(potential.substring(4, 8), 2)
  return `${stats[statIndex].label}(${percent}%)`
}

</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 800px
</style>
