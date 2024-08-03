<template>
  <div class="row flex flex-center">
    <div class="col-6 form-widget">
      <p class="description">Sign in with your email and password below</p>
      <form @submit="handleLogin" class="form-widget">
        <div>
          <input
            class="inputField"
            type="email"
            placeholder="Your email"
            v-model="email"
            required
          />
        </div>
        <div>
          <input
            class="inputField"
            type="password"
            placeholder="Your password"
            v-model="password"
            required
          />
        </div>
        <div>
          <button class="button block" :disabled="loading">
            {{ loading ? 'Loading' : 'Sign In' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { signInWithEmail } from '@/../supabase/api/auth.js'

const loading = ref(false)
const email = ref('')
const password = ref('')
const system_access = ref('ccms')

const handleLogin = async (event) => {
  event.preventDefault()
  loading.value = true

  const { error, accessError } = await signInWithEmail(email.value, password.value, system_access.value)

  if (accessError) {
    alert('Access denied: User does not have the required system access.')
  } else if (error) {
    alert(error.error_description || error.message)
  } else {
    alert('Successfully signed in!')
  }
  loading.value = false
}
</script>

<style scoped>
/* Add your styles here */
</style>
