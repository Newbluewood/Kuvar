<script setup>
import { usePrepsStore } from '@/stores/preps'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const prep = usePrepsStore()

onMounted(() => {
  prep.cats()
})

function handleClickEdit(id) {
  prep.currentDish = id
  prep.getCurrentDish(id)
  router.push('/admin/dish/edit')
}

function handleCreateClick() {
  router.push('/admin/dish/create')
}

function handleClickDelete(id) {
  prep.deleteDish(id)
}
</script>
<template>
  <h1 class="manjiVelikiNaslov">Jela</h1>

  <button class="maloDugme" @click="handleCreateClick">Kreiraj jelo</button>

  <div class="card-container">
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <div class="card-grid">
      <div
        v-for="(dish, index) in prep.categories"
        :key="dish.id"
        class="card"
        @click="handleClick(recipe.idRec)"
      >
        <img :src="prep.getDishImage(index)" alt="Slika jela" class="card-image" />
        <h2 class="card-title">{{ dish.dishTitle }}</h2>
        <h3 class="card-user">Subdish: {{ dish.subdish }}</h3>
        <button class="maloDugme" @click="handleClickEdit(dish.idDish)">Izmeni jelo</button>
        <button class="maloDugme" @click="handleClickDelete(dish.idDish)">Obriši jelo</button>
      </div>
    </div>
  </div>
</template>
