<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSearchStore } from '@/stores/search'

const searchStore = useSearchStore()
const router = useRouter()
const vrednostPretrage = ref(null)

function pretrazi() {
  searchStore.text = vrednostPretrage.value
  searchStore.searchFilter()

  router.push('/recipes')
}
</script>

<template>
  <input
    type="text"
    class="pretraziSve"
    placeholder="Pretraži sve recepte.."
    @keydown.enter.prevent="pretrazi"
    v-model="vrednostPretrage"
  />
</template>

<style scoped></style>
