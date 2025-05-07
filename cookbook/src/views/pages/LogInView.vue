<script setup>
import { useLoginStore } from '@/stores/login'
import { ref, onMounted, watchEffect, onUpdated } from 'vue'

const store = useLoginStore()
const errField = ref()

const status = ref(false)

onMounted(() => {
  //Ovo isto da izbrisemo?
  const checkSS = localStorage.getItem('sid')
  if (checkSS) {
    //check.value = true
  }
  errField.value = ''
})

onUpdated(() => {})

const vrednostEmail = ref()
const vrednostPassword = ref()

store.email = vrednostEmail.value
store.password = vrednostPassword.value

function prijava() {
  console.log('??')
  store.toggle(vrednostEmail.value, vrednostPassword.value)
}

watchEffect(() => {
  if (store.isLoggedIn) {
    status.value = true
  } else {
    status.value = false
  }
})
</script>

<template>
  <h1 class="velikiNaslov">Već ste naš član?</h1>
  <h6 class="maliNaslov">Dobrodošli nazad!</h6>
  <input
    v-if="!status"
    type="text"
    class="inputText"
    placeholder="E-mail..."
    v-model="vrednostEmail"
  />

  <form @submit.prevent>
    <input
      v-if="!status"
      type="password"
      class="inputText"
      placeholder="Lozinka..."
      @keydown.enter.prevent="prijava()"
      v-model="vrednostPassword"
    />
  </form>

  <button class="velikoDugme" @click="prijava">{{ status ? 'Odjavi me' : 'Prijavi me' }}</button>
  <h4 class="dodatak">Nemate nalog? <RouterLink to="/register">Registrujte se</RouterLink></h4>
</template>

<style scoped></style>
