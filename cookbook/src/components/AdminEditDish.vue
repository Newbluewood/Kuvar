<script setup>
import { usePrepsStore } from '@/stores/preps'
import { ref, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const prep = usePrepsStore()

const title = ref(null)
const subdish = ref(null)
const sub = computed(() => subdish.value)
const selected = ref(prep.currentDishElement.subdish)

function handleSelection() {
  subdish.value = selected.value
}

function handleClickSave() {
  prep.editingDish(title.value, sub.value, prep.currentDishElement.idDish)
  router.push('/admin/dish')
}

onUnmounted(() => {
  prep.cats()
})
</script>
<template>
  <div>
    <h1 class="manjiVelikiNaslov">Izmena jela "{{ prep.currentDishElement.dishTitle }}"</h1>
    <input
      type="text"
      class="inputText"
      :placeholder="prep.currentDishElement.dishTitle"
      v-model="title"
    />

    <h1 for="dishSelect" class="najmanjiVelikiNaslov">Odaberi kom jelu ovo jelo pripada:</h1>
    <select id="dishSelect" class="sort-dropdown" v-model="selected" @change="handleSelection">
      <option v-for="category in prep.categories" :key="category.idDish" :value="category.idDish">
        {{ category.dishTitle }}
      </option>
    </select>

    <div>
      <input ref="file-input" type="file" class="file-input" @change="prep.handleImage" />
      <div id="image-korak">
        <img v-if="prep.editImage" :src="prep.editImage" alt="" />
        <img v-else :src="prep.mainImageDisplay" alt="" />
      </div>
    </div>

    <button class="maloDugme" @click="handleClickSave">Sacuvaj</button>
  </div>
</template>
