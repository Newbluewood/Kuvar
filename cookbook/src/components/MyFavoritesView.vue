<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import api from '../../api'
import { useRecipe1Store } from '@/stores/recipe'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { usePrepsStore } from '@/stores/preps'
import { gsap } from 'gsap'

/// ACORDIAN /// //////////////////////////////////////////////////////////////////////////////////

const accordionContent = ref(null)
const isOpen = ref(false)

const toggleAccordion = () => {
  if (isOpen.value) {
    gsap.to(accordionContent.value, { height: 0, duration: 0.5, ease: 'power2.inOut' })
  } else {
    gsap.to(accordionContent.value, { height: 'auto', duration: 0.5, ease: 'power2.inOut' })
  }
  isOpen.value = !isOpen.value
}

///////////////////////////////////////////////////////////////////////////////////////////////////

const recipes = ref([])
const store = useRecipe1Store()
const router = useRouter()
const user = useUserStore()
const errorMessage = ref('') // Poruka za grešku
const prep = usePrepsStore()
const selectedCategories = ref([])
const filter = ref([])
const selectedOption = ref(5)
const date = ref(false)
const prepTime = ref(false)
const direction = ref(true)
const selectedPreferences = ref([])
//const isVisible = ref(false)

//if(podaciSmuckaj.value == null && podaciPretrage.value== null){

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
    const response = await api.mojiFavoritiPrikaz({
      filters: temp,
      idUsr: user.foreignUser,
      sid: localStorage.getItem('sid'),
      sortByDate: date.value,
      sortByPrepTime: prepTime.value,
      asc: direction.value,
    })
    recipes.value = response.data.data
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

/*
function toggleVisibility() {
  isVisible.value = !isVisible.value
}*/

onUnmounted(() => {
  store.podaciPretrage = null
  store.podaciSmuckaj = null
})
</script>

<template>
  <!-- <button @click="toggleVisibility" class="action-button"> -->
  <!--  zbog acordiana ne koristimo vise -->
  <button @click="toggleAccordion" class="action-button">
    {{ isOpen ? 'Sakrij filtere' : 'Prikaži filtere' }}
    <!--  zbog acordiana isVisible zameneno sa IsOpen -->
  </button>
  <!-- <div v-if="isVisible"> -->
  <!--  zbog acordiana ne koristimo vise -->
  <div ref="accordionContent" class="accordion-content">
    <label class="maliNaslov textBold">Odabir kategorija:</label>
    <div v-for="category in prep.categories" :key="category.idDish">
      <div v-if="category.subdish == null || category.subdish == category.idDish">
        <input
          type="checkbox"
          :id="category.idDish"
          :value="category.idDish"
          v-model="selectedCategories"
          @change="handleFilter"
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
            @change="handleFilter"
          />
          <label :for="category.idDish">{{ category.dishTitle }}</label>
        </div>
      </div>
    </div>
    <div>
      <label class="maliNaslov textBold">Odabir dijete:</label>
      <div>
        <input
          type="checkbox"
          id="vegetarian"
          value="ingVegetarian"
          v-model="selectedPreferences"
          @change="handleFilter"
        />
        <label for="vegetarian">Vegetarijansko</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="vegan"
          value="ingVegan"
          v-model="selectedPreferences"
          @change="handleFilter"
        />
        <label for="vegan">Vegansko</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="lenten"
          value="ingLenten"
          v-model="selectedPreferences"
          @change="handleFilter"
        />
        <label for="lenten">Posno</label>
      </div>
    </div>
  </div>
  <div>
    <select id="dropdown" class="sort-dropdown" v-model="selectedOption" @change="handleFilter">
      <option value="1">Datum rastuce</option>
      <option value="2">Datum opadajuce</option>
      <option value="3">Vreme pripreme rastuce</option>
      <option value="4">Vreme pripreme opadajuce</option>
      <option value="5">Sortiraj po:</option>
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

<style scoped>
.card-container {
  height: 55vh;
  overflow-y: scroll;
}
.card-container {
  overflow-y: auto;
}

.card-container::-webkit-scrollbar {
  width: 15px;
}
.card-container::-webkit-scrollbar-track {
  background: #927d651c;
}
.card-container::-webkit-scrollbar-thumb {
  background-color: #a894817b;
  border-radius: 10px;
  border: 3px solid rgb(128, 108, 59);
}
.card-container::-webkit-scrollbar-thumb:hover {
  background: rgba(135, 105, 63, 0.404);
}
</style>
