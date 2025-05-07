<script setup>
import { usePrepsStore } from '@/stores/preps'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const prep = usePrepsStore()

const title = ref(null)
const subdish = ref(null)
const selected = ref(null)

onMounted(() => {
  prep.cats()
})

function handleSelection() {
  subdish.value = selected.value
}

function handleClickSave() {
  prep.createDish(title.value, subdish.value)
  router.push('/admin/dish')
}
</script>
<template>
  <div>
    <h1 class="manjiVelikiNaslov">Kreiranje jela</h1>
    <input type="text" class="inputText" v-model="title" />

    <h1 for="dishSelect" class="najmanjiVelikiNaslov">Odaberi kom jelu ovo jelo pripada:</h1>

    <select id="dishSelect" class="sort-dropdown" v-model="selected" @change="handleSelection">
      <option v-for="category in prep.categories" :key="category.idDish" :value="category.idDish">
        {{ category.dishTitle }}
      </option>
    </select>

    <div>
      <input ref="file-input" type="file" class="file-input" @change="prep.handleImage"/>
      <div id="image-korak">
        <img :src="prep.editImage" alt="" width="200px"/>
      </div>
    </div>

    <button class="maloDugme" @click="handleClickSave">Sačuvaj izmene</button>
  </div>
</template>
