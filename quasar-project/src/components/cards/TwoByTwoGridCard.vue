<!--
  ㅁ ㅁ
  ㅁ ㅁ
  2 x 2 Grid Card
-->

<template>
  <q-card bordered>
    <q-card-section vertical class="q-pa-sm q-gutter-y-sm">
      <q-card-section horizontal>
        <q-item-section>
          <slot name="item1"></slot>
        </q-item-section>
        <q-item-section>
          <slot name="item2"></slot>
        </q-item-section>
      </q-card-section>

      <q-card-section horizontal>
        <q-item-section>
          <slot name="item3"></slot>
        </q-item-section>
        <q-item-section>
          <slot name="item4"></slot>
        </q-item-section>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>
