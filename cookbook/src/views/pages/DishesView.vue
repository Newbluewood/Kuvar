<script setup>
import { ref, onMounted } from 'vue'
import { usePrepsStore } from '@/stores/preps'

const prep = usePrepsStore()
const errorMessage = ref('')

onMounted(() => {
  prep.cats()
})
</script>

<template>
  <h1 class="velikiNaslov">Jela</h1>
  <h6 class="maliNaslov">
    Odaberite koja kategorija jela Vam se danas jede a mi ćemo Vam ponuditi najukusnije načine da ih
    napravite!
  </h6>
  <div class="card-container">
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <div class="card-grid">
      <div v-for="dish in prep.categories" :key="dish.idDish" class="card">
        <div v-if="dish.subdish == null || dish.subdish == dish.idDish">
          <img
            :src="'data:image/jpeg;base64,' + dish.image"
            :alt="dish.dishTitle"
            class="card-image"
          />
          <h2 class="card-title">{{ dish.dishTitle }}</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
