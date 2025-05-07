<script setup>
import AdminDish from '@/components/AdminDish.vue'
import AdminIng from '@/components/AdminIng.vue'
import ReportedRecipesView from '@/components/ReportedRecipesView.vue'
import ReportedUsersView from '@/components/ReportedUsersView.vue'
import { ref } from 'vue'

const selector = ref(1)

function handleRadioButtons(x) {
  selector.value = x
}
</script>
<template>
  <h1 class="velikiNaslov">Admin stranica</h1>
  <div id="radioBox" class="radio-toolbar">
    <input
      type="radio"
      id="reportedRecipe"
      name="selector"
      @click="handleRadioButtons(1)"
      checked="checked"
    />
    <label for="reportedRecipe">Prijavljeni recepti</label>
    <input type="radio" id="reportedUser" name="selector" @click="handleRadioButtons(2)" />
    <label for="reportedUser">Prijavljeni korisnici</label>
    <input type="radio" id="ingredients" name="selector" @click="handleRadioButtons(3)" />
    <label for="ingredients">Sastojci</label>
    <input type="radio" id="dishes" name="selector" @click="handleRadioButtons(4)" />
    <label for="dishes">Jela</label>
  </div>
  <div>
    <div v-if="selector == 1">
      <ReportedRecipesView />
    </div>
    <div v-if="selector == 2">
      <ReportedUsersView />
    </div>
    <div v-if="selector == 3">
      <AdminIng />
    </div>
    <div v-if="selector == 4">
      <AdminDish />
    </div>
  </div>
</template>

<style>
.radio-toolbar {
  margin: 10px;
}

.radio-toolbar input[type='radio'] {
  visibility: hidden;
  position: absolute;
  margin: 2%;
}

.radio-toolbar label {
  display: inline-block;
  margin: 1%;
  padding: 0.5% 7%;
  border: 2px solid var(--color-border);
  background-color: var(--button-bg);
  border-radius: 1rem;
  color: var(--button-color);
  font-family: 'Inter', sans-serif !important;

}

.radio-toolbar label:hover {
  background-color: var(--svetlija-bordo);
  cursor: pointer;
}

.radio-toolbar input[type='radio']:checked + label {
  background-color: var(--bordo);
  border-color: var(--najtamnija-bordo);
}
</style>
