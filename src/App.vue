<template>
  <Auth v-if="!session" />
  <!-- <Account v-else :session="session" /> -->
  <MainLayout v-else :session="session" />
</template>

<script setup>
import MainLayout from "@/layouts/MainLayout.vue";
import { ref, onMounted } from 'vue'
import { getSession, onAuthStateChange } from '@/../supabase/api/auth.js'
import Auth from '@/views/Auth.vue'
// import Account from '@/views/Account.vue'

const session = ref(null)

onMounted(async () => {
  session.value = await getSession()

  onAuthStateChange((_event, newSession) => {
    session.value = newSession
  })
})
</script>

<style scoped>
/* Add your styles here */
</style>
