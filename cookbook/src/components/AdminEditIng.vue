<script setup>
import { usePrepsStore } from '@/stores/preps'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const prep = usePrepsStore()

const title = ref(null)
const vegan = ref(null)
const vegetarian = ref(null)
const lenten = ref(null)
const niz = ref([{ checked: false }, { checked: false }, { checked: false }])

onMounted(() => {
  if (prep.currentIngElement.ingVegan) niz.value[0].checked = true
  if (prep.currentIngElement.ingVegetarian) niz.value[1].checked = true
  if (prep.currentIngElement.ingLenten) niz.value[2].checked = true
})

function handleClickSave() {
  prep.editIngredient(
    title.value,
    vegan.value,
    vegetarian.value,
    lenten.value,
    prep.currentIngElement.idIng,
  )
  router.push('/admin/ings')
}
</script>
<template>
  <h1 class="manjiVelikiNaslov">Izmena sastojka "{{ prep.currentIngElement.ingTitle }}"</h1>
  <input
    type="text"
    class="inputText"
    :placeholder="prep.currentIngElement.ingTitle"
    v-model="title"
  />

  <label for="ingVegan">Vegan:</label>
  <input type="checkbox" :checked="niz[0].checked" v-model="vegan" />

  <label for="ingVegetarian">Vegetarian:</label>
  <input type="checkbox" :checked="niz[1].checked" v-model="vegetarian" />

  <label for="ingLenten">Lenten:</label>
  <input type="checkbox" :checked="niz[2].checked" v-model="lenten" />

  <button class="maloDugme" @click="handleClickSave">Sačuvaj izmene</button>
</template>
