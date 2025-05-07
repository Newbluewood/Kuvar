import { defineStore } from 'pinia'
import api from '../../api'
import { ref, computed } from 'vue'

export const useFavStore = defineStore('favourite', () => {
  const c = ref(false)
  const check = computed(() => c.value)

  const sid = localStorage.getItem('sid')
  async function addFav(idRec) {
    try {
      await api.addToFavs({ sid: sid, idRec: idRec })
    } catch (error) {
      console.log('error: ', error)
      console.log('res error: ', error.response.data.message)
    }
  }

  async function removeFav(idRec) {
    try {
      await api.removeFromFavs({ sid: sid, idRec: idRec })
    } catch (error) {
      console.log('error: ', error)
      console.log('res error: ', error.response.data.message)
    }
  }

  async function checkFav(idRec) {
    try {
      const ret = await api.checkFavs({ sid: sid, idRec: idRec })
      c.value = ret.data.data
    } catch (error) {
      console.log('error: ', error)
      console.log('res error: ', error.response.data.message)
    }
  }

  return {
    addFav,
    removeFav,
    checkFav,
    check,
    c,
  }
})
