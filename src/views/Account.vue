<template>
    <form @submit="updateProfile" class="form-widget">
      <div>
        <label for="email">Email</label>
        <input id="email" type="text" :value="session.user.email" disabled />
      </div>
      <div>
        <label for="username">Name</label>
        <input
          id="username"
          type="text"
          required
          v-model="username"
        />
      </div>
      <div>
        <label for="website">Website</label>
        <input
          id="website"
          type="url"
          v-model="website"
        />
      </div>
      <div>
        <button class="button block primary" type="submit" :disabled="loading">
          {{ loading ? 'Loading ...' : 'Update' }}
        </button>
      </div>
      <div>
        <button class="button block" type="button" @click="signOut">
          Sign Out
        </button>
      </div>
    </form>
  </template>
  
  <script setup>
  import { ref, onMounted, toRefs } from 'vue'
  import { getProfile, updateProfileData, signOutUser } from '@/../supabase/api/auth.js'
  
  const props = defineProps({
    session: Object
  })
  
  const { session } = toRefs(props)
  
  const loading = ref(true)
  const username = ref(null)
  const website = ref(null)
  const avatarUrl = ref(null)
  
  onMounted(async () => {
    const { user } = session.value
    loading.value = true
  
    const { data, error } = await getProfile(user.id)
  
    if (error) {
      console.warn(error)
    } else if (data) {
      username.value = data.username
      website.value = data.website
      avatarUrl.value = data.avatar_url
    }
  
    loading.value = false
  })
  
  const updateProfile = async (event) => {
    event.preventDefault()
    loading.value = true
    const { user } = session.value
  
    const updates = {
      id: user.id,
      username: username.value,
      website: website.value,
      avatar_url: avatarUrl.value,
      updated_at: new Date(),
    }
  
    const { error } = await updateProfileData(updates)
  
    if (error) {
      alert(error.message)
    } else {
      avatarUrl.value = avatarUrl.value
    }
  
    loading.value = false
  }
  
  const signOut = () => {
    signOutUser()
  }
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  