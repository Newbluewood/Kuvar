<script setup>
import { ref } from 'vue'

const userName = ref('Milica')
</script>
<template>
  <h1 class="velikiNaslov">Zdravo, {{ userName }}</h1>
  <h6 class="maliNaslov">Ovo je strana za uređivanje Vašeg profila</h6>
  <input
    type="text"
    class="inputText"
    placeholder="Unesite novo korisnicko ime..."
    v-model="vrednostName"
  />
  <input
    type="text"
    class="inputText"
    placeholder="Unesite novu e-mail adresu..."
    v-model="vrednostEmail"
  />
  <input
    type="text"
    class="inputText"
    placeholder="Unesite novu lozinku..."
    v-model="vrednostPassword"
  />
  <input
    type="text"
    class="inputText"
    placeholder="Unesite Vaše ime..."
    v-model="vrednostFirstName"
  />
  <input
    type="text"
    class="inputText"
    placeholder="Unesite Vaše prezime..."
    v-model="vrednostLastName"
  />
  <button class="maloDugme">Sačuvaj izmene</button>
  <button class="maloDugme">Obriši profil</button>
</template>
<script scoped></script>
