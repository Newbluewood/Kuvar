<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRecipe1Store } from '@/stores/recipe'
import { useRouter } from 'vue-router'
import { useSearchStore } from '@/stores/search'
import { usePrepsStore } from '@/stores/preps'
import { gsap } from 'gsap'

/// ACORDION /// //////////////////////////////////////////////////////////////////////////////////

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
const searchStore = useSearchStore()
const prep = usePrepsStore()
const router = useRouter()
const errorMessage = ref('')
const podaciSmuckaj = computed(() => store.podaciSmuckaj)
const podaciPretrage = computed(() => searchStore.recipes)
const selectedCategories = ref([])
const selectedPreferences = ref([])
const filter = ref([])
const selectedOption = ref(5)
const date = ref(false)
const prepTime = ref(false)
const direction = ref(true)
//const isVisible = ref(false) // zbog acordiana ne koristimo vise
const test = ref(false)

onMounted(async () => {
  try {
    prep.cats()
    sviRecepti()
    recipes.value = computed(() => useRecipe1Store.podaciPretrage)
  } catch (error) {
    test.value = true
    console.error(error)
  } finally {
    test.value = true
  }
})

async function sviRecepti() {
  try {
    searchStore.searchFilter(date.value, prepTime.value, direction.value)
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

  searchStore.filter = filter.value
  sviRecepti()
  filter.value = []
  date.value = false
  prepTime.value = false
}

/*function toggleVisibility() {         // zbog acordiona ne koristimo vise
  isVisible.value = !isVisible.value
}*/

onUnmounted(() => {
  store.podaciPretrage = null
  store.podaciSmuckaj = null
  store.resetStore()
  searchStore.resetStore()
})
</script>

<template>
  <div v-if="!test"><h1 class="velikiNaslov">Učitavanje...</h1></div>
  <div v-else>
    <h1 class="velikiNaslov">Recepti</h1>
    <h6 class="maliNaslov">Zavirite u našu knjigu recepata!</h6>
    <h4 class="dodatak textBold">Najbolji recepti u poslendnjih nedelju dana</h4>
    <!-- <button @click="toggleVisibility" class="action-button"> -->
    <!--  zbog acordiana ne koristimo vise -->
    <button @click="toggleAccordion" class="maloDugme">
      {{ isOpen ? 'Sakrij filtere' : 'Prikaži filtere' }}
      <!--  zbog acordiana isVisible zameneno sa IsOpen -->
    </button>
    <!-- <div v-if="isVisible"> -->
    <!--  zbog acordiana ne koristimo vise -->
    <div ref="accordionContent" class="accordion-content">
      <label>Select Categories:</label>
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
        <label>Select Dietary Preferences:</label>
        <div>
          <input
            type="checkbox"
            id="vegetarian"
            value="ingVegetarian"
            v-model="selectedPreferences"
            @change="handleFilter"
          />
          <label for="vegetarian">Vegetarian</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="vegan"
            value="ingVegan"
            v-model="selectedPreferences"
            @change="handleFilter"
          />
          <label for="vegan">Vegan</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="lenten"
            value="ingLenten"
            v-model="selectedPreferences"
            @change="handleFilter"
          />
          <label for="lenten">Lenten</label>
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
          v-for="recipe in podaciSmuckaj || podaciPretrage || recipes"
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
  </div>
</template>

<style scoped>
.accordion-content {
  overflow: hidden;
  height: 0;
} /* iskopirao sam i u main css */
</style>
