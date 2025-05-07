<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import api from '../../api'
import { useRecipe1Store } from '@/stores/recipe'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { usePrepsStore } from '@/stores/preps'

const recipes = ref([])
const store = useRecipe1Store()
const router = useRouter()
const user = useUserStore()
const errorMessage = ref('')
const prep = usePrepsStore()
const selectedCategories = ref([])
const filter = ref([])
const selectedOption = ref(3)
const date = ref(false)
const prepTime = ref(false)
const direction = ref(true)
const selectedPreferences = ref([])

onMounted(() => {
  sviRecepti()
  prep.cats()
})

async function sviRecepti() {
  try {
    let temp = null
    if (filter.value.length > 0) {
      temp = filter.value
    }
    const response = await api.mojiReceptiPrikaz({
      search: null,
      filters: temp,
      idUsr: user.foreignUser,
      sid: localStorage.getItem('sid'),
      sortByDate: date.value,
      sortByPrepTime: prepTime.value,
      asc: direction.value,
    })
    recipes.value = response.data.RESULT
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
  for (let i = 0; i < selectedCategories.value.length; i++) {
    for (let j = 0; j < prep.categories.length; j++) {
      if (selectedCategories.value[i] == prep.categories[j].idDish) {
        filter.value.push(prep.categories[j].dishTitle)
      }
    }
  }
  for (let p = 0; p < selectedPreferences.value.length; p++) {
    filter.value.push(selectedPreferences.value[p])
  }

  if (selectedOption.value == 1) {
    date.value = true
    direction.value = true
  } else if (selectedOption.value == 2) {
    date.value = true
    direction.value = false
  } else if (selectedOption.value == 3) {
    direction.value = true
    prepTime.value = true
  } else if (selectedOption.value == 4) {
    prepTime.value = true
    direction.value = false
  } else if (selectedOption.value == 5) {
    date.value = false
    prepTime.value = false
    direction.value = false
  }

  sviRecepti()
  filter.value = []
  date.value = false
  prepTime.value = false
}
onUnmounted(() => {
  store.podaciPretrage = null
  store.podaciSmuckaj = null
})
</script>

<template>
  <div>
    <label>Select Categories:</label>
    <div v-for="category in prep.categories" :key="category.idDish">
      <div v-if="category.subdish == null || category.subdish == category.idDish">
        <input
          type="checkbox"
          :id="category.idDish"
          :value="category.idDish"
          v-model="selectedCategories"
        />
        <label :for="category.idDish">{{ category.dishTitle }}</label>
      </div>
      <div v-for="(selected, index) in selectedCategories" :key="selected">
        <div
          v-if="
            category.subdish == selectedCategories[index] &&
            selectedCategories[index] != category.idDish
          "
        >
          <input
            type="checkbox"
            :id="category.idDish"
            :value="category.idDish"
            v-model="selectedCategories"
          />
          <label :for="category.idDish">{{ category.dishTitle }}</label>
        </div>
      </div>
    </div>
    <div>
      <label>Select Dietary Preferences:</label>
      <div>
        <input type="checkbox" id="vegetarian" value="vegetarian" v-model="selectedPreferences" />
        <label for="vegetarian">Vegetarian</label>
      </div>
      <div>
        <input type="checkbox" id="vegan" value="vegan" v-model="selectedPreferences" />
        <label for="vegan">Vegan</label>
      </div>
      <div>
        <input type="checkbox" id="lenten" value="lenten" v-model="selectedPreferences" />
        <label for="lenten">Lenten</label>
      </div>
    </div>
    <button @click="handleFilter">Pretrazi</button>
  </div>
  <div>
    <label for="dropdown">Sortiraj po:</label>
    <select id="dropdown" v-model="selectedOption">
      <option value="1">Datum rastuce</option>
      <option value="2">Datum opadajuce</option>
      <option value="3">Vreme pripreme rastuce</option>
      <option value="4">Vreme pripreme opadajuce</option>
      <option value="5">-</option>
    </select>
  </div>
  <div class="card-container">
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <div class="card-grid">
      <div
        v-for="recipe in recipes"
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
      </div>
    </div>
  </div>
</template>

<style scoped></style>
