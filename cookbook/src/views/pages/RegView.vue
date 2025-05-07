<script setup>
import { ref, computed, watchEffect } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const message = computed(() => auth.message)

const vrednostName = ref('')
const vrednostEmail = ref('')
const vrednostPassword = ref('')

function registracija() {
  auth.register(vrednostName.value, vrednostEmail.value, vrednostPassword.value)
}

watchEffect(() => {
  if (auth.response) {
    vrednostName.value = ''
    vrednostEmail.value = ''
    vrednostPassword.value = ''
  }
})
</script>

<template>
  <h1 class="velikiNaslov">I Vi biste hteli da podelite neki svoj recept sa nama?</h1>
  <h6 class="maliNaslov">Pridružite se COOK BOOK zajednici!</h6>

  <div>{{ message }}</div>

  <input type="text" class="inputText" placeholder="E-mail..." v-model="vrednostEmail" />

  <input type="password" class="inputText" placeholder="Lozinka..." v-model="vrednostPassword" />

  <input type="text" class="inputText" placeholder="Korisničko ime..." v-model="vrednostName" />
  <button class="velikoDugme" @click="registracija">Registruj me</button>
  <h4 class="dodatak">Već imate nalog? <RouterLink to="/login">Prijavite se</RouterLink></h4>
</template>

<style scoped></style>
