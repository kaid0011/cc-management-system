<template>
  <q-layout view="hHh lpR fFf">
    <MenuLayout />
    <q-page-container class="app-page">
      <q-page>
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import MenuLayout from "@/components/MenuLayout.vue";
</script>

