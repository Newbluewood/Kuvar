import { defineStore } from 'pinia'
import api from '../../api'
import { ref, computed } from 'vue'

export const useSearchStore = defineStore('search', () => {
  const rec = ref(null)
  const recipes = computed(() => rec.value)

  const text = ref(null)
  const filter = ref(null)

  async function searchFilter(date, prep, direction) {
    try {
      const response = await api.filteredSearch({
        search: text.value,
        filters: filter.value,
        sortByDate: date,
        sortByPrepTime: prep,
        asc: direction,
      })
      rec.value = response.data.data
    } catch (error) {
      console.log('error', error)
    }
  }

  function resetStore() {
    rec.value = null
    text.value = null
    filter.value = null
  }
  return {
    recipes,
    searchFilter,
    text,
    filter,
    resetStore,
  }
})
