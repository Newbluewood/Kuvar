<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRecipe1Store } from '@/stores/recipe'
import { useRouter } from 'vue-router'
import api from '../../api'

const recipes = ref([])
const store = useRecipe1Store()
const router = useRouter()
const errorMessage = ref('') // Poruka za grešku
const selectedOption = ref(7)
const likes = ref([])

onMounted(async () => {
  sviRecepti()
})

async function sviRecepti() {
  try {
    const response = await api.getMostFav({ interval: selectedOption.value })
    recipes.value = response.data.data
    likes.value = response.data.likes
  } catch (error) {
    errorMessage.value = 'Ne mogu da preuzmem recepte, pokušaj ponovo.'
    console.error(error)
  }
}

function handleClick(id) {
  store.setCurrentRecId(id)
  localStorage.setItem('idRec', id)
  router.push('/recipe/view')
}

function handleFilter() {
  sviRecepti()
}

onUnmounted(() => {
  store.podaciPretrage = null
  store.podaciSmuckaj = null
})
</script>

<template>
  <h1 class="velikiNaslov">Najbolje od nas za Vas!</h1>
  <h6 class="maliNaslov">
    Izdvojili smo za Vas najbolje ocenjene recepte u prethodnih nedelju, mesec i godinu dana kao i
    naš lični recept dana!
  </h6>
  <h4 class="dodatak textBold">
    Najbolji recepti u
    <select id="dropdown" class="sort-dropdown" v-model="selectedOption" @change="handleFilter">
      <option value="7">poslednjih nedelju dana</option>
      <option value="30">poslednjih mesec dana</option>
      <option value="365">poslednjih godinu dana</option>
    </select>
  </h4>
  <div class="card-container">
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <div class="card-grid">
      <div
        v-for="(recipe, index) in recipes"
        :key="recipe.idRec"
        class="card"
        @click="handleClick(recipe.idRec)"
      >
        <img
          :src="'data:image/jpeg;base64,' + recipe.image"
          :alt="recipe.recTitle"
          class="card-image"
        />
        <h2 class="card-title">{{ recipe.recTitle }}</h2>
        <h3 class="card-user">od: {{ recipe.name }}</h3>
        <p class="card-date">{{ new Date(recipe.createdAt).toLocaleDateString() }}</p>
        <span class="textBold card-fav">
          <span class="social-icon"><img src="/src/assets/icons/fav.svg" alt="favorites" /></span>
          <span>{{ likes[index] }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
