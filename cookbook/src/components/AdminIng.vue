<script setup>
import { usePrepsStore } from '@/stores/preps'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const prep = usePrepsStore()

onMounted(() => {
  prep.ingAndMeasures()
})

function handleClickEdit(id) {
  prep.currentIng = id
  prep.getCurrentIng(id)
  router.push('/admin/ings/edit')
}

function handleCreateClick() {
  router.push('/admin/ings/create')
}

function handleClickDelete(id) {
  prep.deleteIngredient(id)
}
</script>
<template>
  <h1 class="manjiVelikiNaslov">Sastojci</h1>

  <button class="maloDugme" @click="handleCreateClick">Kreiraj sastojak</button>

  <div class="card-container">
    <div classs="card-grid">
      <div class="card" v-for="ingredient in prep.ingredients" :key="ingredient.id">
        <h2 class="card-title">{{ ingredient.ingTitle }}</h2>
        <h3 class="card-user">Posno: {{ ingredient.ingLenten? "Da" : "Ne" }}</h3>
        <h3 class="card-user">Vegan:{{ ingredient.ingVegan? "Da" : "Ne"  }}</h3>
        <h3 class="card-user">Vegeterijansko: {{ ingredient.ingVegetarian? "Da" : "Ne"  }}</h3>
        <button class="maloDugme" @click="handleClickEdit(ingredient.idIng)">
          Izmeni sastojak
        </button>
        <button class="maloDugme" @click="handleClickDelete(ingredient.idIng)">
          Obriši sastojak
        </button>
      </div>
    </div>
  </div>
</template>
