import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../../api'

export const usePrepsStore = defineStore('preps', () => {
  const currentIng = ref(null)
  const currentIngId = computed(() => currentIng.value)

  const currentDish = ref(null)
  const currentDishId = computed(() => currentIng.value)

  const currentElement = ref(null)
  const currentIngElement = computed(() => currentElement.value)

  const editImg = ref(null)
  const editImage = computed(() => editImg.value && URL.createObjectURL(editImg.value))

  const currentElementDish = ref(null)
  const currentDishElement = computed(() => currentElementDish.value)
  const mainImageDisplay = computed(
    () => currentElementDish.value && imgFromString(currentElementDish.value.image),
  )

  function setCurrentIngId(id) {
    currentIngId.value = id
  }

  function getCurrentIngId() {
    return currentIng.value
  }

  const ing = ref({})
  const mea = ref([])

  const cat = ref([])

  // unwraping data from response

  const ingredients = computed(() => ing.value)
  const measures = computed(() => mea.value)
  const categories = computed(() => cat.value)

  // end

  ///  API  ////////////////////////////////////////////////////////////

  // kategorije sa Backenda
  async function cats() {
    try {
      const resp = await api.getCategory()
      cat.value = resp.data.data
    } catch (error) {
      console.log('error: ', error)
      console.log('res error: ', error.response.data.message)
    }
  }

  // sastojci i mere sa Backenda
  async function ingAndMeasures() {
    try {
      const res = await api.IngAndMeasure()
      ing.value = res.data.dataIng
      mea.value = res.data.dataMeasure
    } catch (error) {
      console.log('error: ', error)
    }
  }

  function getCurrentIng(id) {
    for (let i = 0; i < ingredients.value.length; i++) {
      if (ingredients.value[i].idIng == id) {
        currentElement.value = ingredients.value[i]
        break
      }
    }
  }

  async function editIngredient(title, vegan, vegetarian, lenten, id) {
    try {
      await api.editIng({
        sid: localStorage.getItem('sid'),
        idIng: id,
        ingredient: {
          ingTitle: title,
          ingVegetarian: vegetarian,
          ingLenten: lenten,
          ingVegan: vegan,
        },
      })
    } catch (error) {
      console.log('error: ', error)
    }
  }

  async function createIngredient(title, vegan, vegetarian, lenten) {
    try {
      await api.createIng({
        sid: localStorage.getItem('sid'),
        title: title,
        vegetarian: vegetarian,
        lenten: lenten,
        vegan: vegan,
      })
    } catch (error) {
      console.log('error: ', error)
    }
  }

  async function deleteIngredient(id) {
    try {
      await api.deleteIng({ sid: localStorage.getItem('sid'), ingredient: id })
      for (let i = 0; i < ingredients.value.length; i++) {
        if (ingredients.value[i].idIng == id) {
          ingredients.value.splice(i, 1)
          break
        }
      }
    } catch (error) {
      console.log('error: ', error)
    }
  }

  function getCurrentDish(id) {
    for (let i = 0; i < categories.value.length; i++) {
      if (categories.value[i].idDish == id) {
        currentElementDish.value = categories.value[i]
        break
      }
    }
  }

  async function editingDish(dishTitle, subdish, idDish) {
    let imgResp = null
    try {
      try {
        if (editImg.value != null)
          imgResp = await api.imgHandle({
            sid: localStorage.getItem('sid'),
            image: editImg.value,
            idImg: currentDishElement.value.idImg,
          })
      } catch (error) {
        console.log('error: ', error)
      }
      await api.editDish({
        sid: localStorage.getItem('sid'),
        idDish: idDish,
        dish: { dishTitle: dishTitle, idImg: imgResp.data.idImg, subdish: subdish },
      })
    } catch (error) {
      console.log('error: ', error)
    }
  }

  async function createDish(title, subdish) {
    let imgResp = null
    try {
      try {
        imgResp = await api.imgHandle({
          sid: localStorage.getItem('sid'),
          image: editImg.value,
          idImg: null,
        })
      } catch (error) {
        console.log('error: ', error)
      }

      await api.createDish({
        sid: localStorage.getItem('sid'),
        title: title,
        image: imgResp.data.idImg,
        subdish: subdish,
      })
    } catch (error) {
      console.log('error: ', error)
    }
  }

  async function deleteDish(id) {
    try {
      await api.deleteDish({ sid: localStorage.getItem('sid'), dish: id })
      for (let i = 0; i < categories.value.length; i++) {
        if (categories.value[i].idDish == id) {
          categories.value.splice(i, 1)
          break
        }
      }
    } catch (error) {
      console.log('error: ', error)
    }
  }

  function imgFromString(input) {
    if (input) {
      // Convert the input to a string
      let str = String(input).trim()

      // Ensure the Base64 string is properly padded
      while (str.length % 4 !== 0) {
        str += '='
      }
      // Check if the Base64 string is valid
      const base64Pattern = /^[A-Za-z0-9+/]+={0,2}$/
      if (!base64Pattern.test(str)) {
        console.error('Invalid Base64 string:', str)
        throw new Error('Invalid Base64 string')
      }
      // Conversion
      const base64String = str
      const imageUrl = `data:image/png;base64,${base64String}`

      return imageUrl
    } else {
      return
    }
  }

  function getDishImage(index) {
    const img = imgFromString(categories.value[index].image)
    return img
  }

  function handleImage(event) {
    editImg.value = event.target.files[0]
    event.target.value = null
  }

  //////////////////////////////////////////////////////////// end of API ////////

  return {
    ingAndMeasures,
    cats,
    measures,
    ingredients,
    categories,
    editIngredient,
    currentIngId,
    currentIng,
    getCurrentIngId,
    setCurrentIngId,
    getCurrentIng,
    currentElement,
    currentIngElement,
    createIngredient,
    deleteIngredient,
    currentDish,
    currentDishId,
    deleteDish,
    editingDish,
    createDish,
    getCurrentDish,
    currentDishElement,
    imgFromString,
    handleImage,
    mainImageDisplay,
    getDishImage,
    editImage,
  }
})
