import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../../api'

export const useRecipe1Store = defineStore('recipe', () => {
  const podaciPretrage = ref() // from search

  // rec id
  const currentRecId = ref(localStorage.getItem('idRec'))
  const currentRec = computed(() => currentRecId.value)

  function setCurrentRecId(id) {
    currentRecId.value = id
  }

  function getCurrentRecId() {
    return currentRec.value
  }

  /////////////////////////////////////////////////////////////////////////////////
  //   IMAGES
  //     -- fungcija koja pretvra string u sliku --

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
  ///////////////////////// end of images helpers ////////////////////////////////////

  ///// api response content => ( Recept ) + measures&ingredients + category + filters

  const recipe = ref({})
  const prepstep = ref([])
  const recingmeasure = ref([])
  const category = ref(null)
  // for style class
  const vegan = ref(false)
  const vegetarian = ref(false)
  const lenten = ref(false)

  ///////////////////////////// unwraping data from response //////////////////////////////////////

  // RECIPE

  const title = computed(() => recipe.value && recipe.value.title)
  const user = computed(() => recipe.value && recipe.value.user)
  const peopleCount = computed(() => recipe.value && recipe.value.peopleCount)
  const description = computed(() => recipe.value && recipe.value.description)
  const prepDuration = computed(() => recipe.value && recipe.value.prepDuration)
  const img = computed(() => {
    if (recipe.value && recipe.value.img && recipe.value.img.length > 0) {
      return imgFromString(recipe.value.img[0].image)
    } else {
      return null
    }
  })

  const mainImageId = computed(() => recipe.value && recipe.value.idImg)
  const idUsr = computed(() => recipe.value && recipe.value.idUsr)
  const updated = computed(() => recipe.value && recipe.value.updated)
  const created = computed(() => recipe.value && recipe.value.created)

  // PREPSTEP

  const stepTitles = computed(() => prepstep.value && prepstep.value.titles)
  const stepTexts = computed(() => prepstep.value && prepstep.value.texts)
  const stepImages = computed(() => prepstep.value.images)

  function pushImage(index) {
    //helper f-ja , vraca url za prosledjeni indeks niza "stepImages". Koristimo u komponenti.
    if (stepImages.value) {
      return imgFromString(stepImages.value[index])
    }
  }

  // RECINGMEASURE

  const ingredients = computed(() => recingmeasure.value && recingmeasure.value.ingTitles)

  const units = computed(() => recingmeasure.value && recingmeasure.value.mUnits)
  const quantitys = computed(() => recingmeasure.value && recingmeasure.value.mQuants)
  const ids = computed(() => recingmeasure.value && recingmeasure.value.ingIds)

  // CATEGORY

  const categories = computed(() => category.value.category && category.value.category)
  function getCategory() {
    return categories.value
  }

  ///////////////////////////// end of unwraping data from response  ///////////////////////////////////////////////////

  ///  API  /////////////////////////////////////////////////////////////////////////////////////////////////////////////

  async function getRec(id) {
    try {
      resetStore()
      const response = await api.readRec({ idRec: id })

      recipe.value = response.data.recipe
      prepstep.value = response.data.prepstep
      recingmeasure.value = response.data.recingmeasure
      category.value = response.data.category
      vegan.value = response.data.vegan
      vegetarian.value = response.data.vegetarian
      lenten.value = response.data.lenten

      return {
        recipe: response.data.recipe,
        prepstep: response.data.prepstep,
        recingmeasure: response.data.recingmeasure,
        category: response.data.category,
      }
    } catch (error) {
      console.log('error: ', error)
      console.log('res error: ', error.response.data.message)
    }
  }

  function getPrepStepTitles() {
    return stepTitles.value
  }

  function resetStore() {
    recipe.value = ref({})
    prepstep.value = ref([])
    recingmeasure.value = ref([])
    category.value = ref(null)
    // for style class
    vegan.value = ref(false)
    vegetarian.value = ref(false)
    lenten.value = ref(false)
  }

  return {
    podaciPretrage,
    currentRec,
    currentRecId,
    setCurrentRecId,
    getCurrentRecId,
    pushImage,

    // response content => ( Recept ) + measures&ingredients + category + filters
    recipe,
    prepstep,
    recingmeasure,
    category,
    vegan,
    vegetarian,
    lenten,

    // recipe
    title,
    img,
    prepDuration,
    peopleCount,
    description,
    user,
    updated,
    created,
    idUsr,
    mainImageId,

    // prepstep
    stepTitles,
    stepImages,
    stepTexts,
    getPrepStepTitles,

    // recingmeasure
    ids,
    units,
    ingredients,
    quantitys,

    // category
    categories,
    getCategory,

    // API
    getRec,

    // RESET STORE
    resetStore,
  }
})
