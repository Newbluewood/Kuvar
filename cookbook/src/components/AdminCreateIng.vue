<script setup>
import { usePrepsStore } from '@/stores/preps'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const prep = usePrepsStore()

const title = ref('')
const vegan = ref(false)
const vegetarian = ref(false)
const lenten = ref(false)

onMounted(() => {})

function handleClickSave() {
  prep.createIngredient(title.value, vegan.value, vegetarian.value, lenten.value)
  router.push('/admin/ings')
}
</script>
<template>
  <div>
    <h1 class="manjiVelikiNaslov">Kreiranje sastojka</h1>
    <input type="text" class="inputText" v-model="title" />

    <label for="ingVegan">Vegan:</label>
    <input type="checkbox" v-model="vegan" />

    <label for="ingVegetarian">Vegetarian:</label>
    <input type="checkbox" v-model="vegetarian" />

    <label for="ingLenten">Lenten:</label>
    <input type="checkbox" v-model="lenten" />

    <button class="maloDugme" @click="handleClickSave">Sačuvaj izmene</button>
  </div>
</template>
