<script setup>
import { ref } from 'vue'
import api from '../../../api'
import { useRouter } from 'vue-router'
import { useRecipe1Store } from '@/stores/recipe'
import MostFavsView from '@/components/MostFavsView.vue'

const prikaziPrviDeo = ref(false)
const recStore = useRecipe1Store()
const router = useRouter()
const vrednostSmuckaj = ref(null)

async function smuckaj() {
  const param = vrednostSmuckaj.value

  try {
    const response = await api.smuckaj({ ingredients: param })

    recStore.podaciSmuckaj = response.data.data

    if (response.data.data.length != 0) {
      router.push('/recipes')
    }
  } catch (error) {
    console.log('Greška mućkanja: ' + error)
  }
}
</script>

<template>
<div v-if="prikaziPrviDeo">
  <h1 class="velikiNaslov">
    Želiš samo da smućkaš nešto od namirnica koje već poseduješ u kuhinji?
  </h1>
  <h6 class="maliNaslov velikaSlova">
    U polje ispod unesi namirnice koje imaš, a mi ćemo ti ponuditi sve recepte koje možeš ispratiti
    koristeći samo njih!
  </h6>

  <input
    type="text"
    class="inputText velikaSlova textCenter"
    placeholder="Unesi namirnice odvajajući ih zarezima..."
    @keydown.enter="smuckaj"
    v-model="vrednostSmuckaj"
  />

</div>

  <div>
    <MostFavsView />
  </div>
</template>

<style scoped></style>
