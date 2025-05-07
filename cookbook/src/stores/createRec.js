import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../../api'
import { useRouter } from 'vue-router'
import { useLoginStore } from './login'

export const useCreateStore = defineStore('createRecipe', () => {
  const router = useRouter()
  const loginStore = useLoginStore()

  const currentRecId = ref(null)
  const currentRec = computed(() => currentRecId.value)

  ////// Fotografije ////////////////////////////////////////////////////////////////////////////////

  //glavna fotografija
  const mainImage = ref(null) // file
  const mainImageDisplay = computed(() => mainImage.value && URL.createObjectURL(mainImage.value)) // url for <img src="">

  // fotografije koraka
  const koraciImages = ref([null]) // file for database

  function getImageStep(index) {
    if (koraciImages.value[index] != null) {
      const image = URL.createObjectURL(koraciImages.value[index])
      return image
    } else return null
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////

  const Recept = ref({})

  //* PROPS */

  // user data
  const sid = localStorage.getItem('sid')

  // Recept - props
  const idImgMain = ref(null)
  const imeRecepta = ref(null)
  const brOsoba = ref(1)
  const opisRecepta = ref(null)
  const vremePripreme = ref(1)
  const slikaRecepta = computed(() => mainImageDisplay.value)

  // koraci //
  const idImg = ref(null)
  const idImage = computed(() => idImg.value)
  const category = ref(null)
  const categorySelected = ref([])

  // Sastojci - props

  const sastojci = ref([{ id: null, kolicina: null, idM: null }])
  const upotrebljeniSastojci = computed(() => sastojci.value)
  // ---- spisak sastojaka i mera sa Backenda ---- //
  const sast = ref(null)
  const sasts = computed(() => sast.value)
  const mere = ref(null)
  const meres = computed(() => mere.value)

  // Koraci - props
  const koraci = ref([{ idImg: null, text: 'Text..', korakNaslov: 'Naslov..' }])
  const postupak = computed(() => koraci.value)
  // KORACI - functions
  function dodajKorak() {
    const korak = {
      idImg: null,
      text: `Naslov koraka ${koraci.value.length + 1}`,
      korakNaslov: `Korak ${koraci.value.length + 1}`,
    }
    koraci.value.push(korak)
    koraciImages.value.push(null)
  }

  function skiniKorak(index) {
    if (koraci.value.length === 1) {
      return
    }
    koraci.value.splice(index, 1)
    koraciImages.value.splice(index, 1)
  }

  // FOTOGRAFIJE -functions

  function handleImage(e) {
    mainImage.value = e.target.files[0]
    e.target.value = null
  }

  function handleImageStep(event) {
    koraciImages.value.splice(idImage.value, 1, event.target.files[0])
    event.target.value = null
  }

  // SASTOJCI - functions
  function dodajSastojak() {
    const sastojak = { id: null, kolicina: null, idM: null }
    sastojci.value.push(sastojak)
  }

  Recept.value.recTitle = computed(() => imeRecepta.value)
  Recept.value.Image = computed(() => mainImage.value)
  Recept.value.idImgMain = computed(() => idImgMain.value)
  Recept.value.peopleCounter = computed(() =>
    isNaN(brOsoba.value) ? null : parseInt(brOsoba.value),
  )
  Recept.value.recipeDesc = computed(() => opisRecepta.value)
  Recept.value.prepDuration = computed(() =>
    isNaN(vremePripreme.value) ? null : parseInt(vremePripreme.value),
  )
  Recept.value.ingredients = computed(() => upotrebljeniSastojci.value)
  Recept.value.prep = computed(() => postupak.value)
  Recept.value.category = computed(() => categorySelected.value)

  function skiniSastojak(id) {
    if (sastojci.value.length === 1) {
      return
    }
    sastojci.value.splice(id, 1)
  }

  /////   API   ////////////////////////////////////////////////////////////////////////////////////////////

  const response = ref()
  function getResponseStatus() {
    return response.value
  }

  // kategorije sa Backenda
  async function cats() {
    try {
      const resp = await api.getCategory()
      category.value = resp.data.data

      response.value = resp.data.res
    } catch (error) {
      console.log('error: ', error)
      console.log('res error: ', error.response.data.message)
      response.value = error.response.data.message
    }
  }

  // sastojci i mere sa Backenda
  async function ingAndMeasures() {
    try {
      const res = await api.IngAndMeasure()
      sast.value = res.data.dataIng
      mere.value = res.data.dataMeasure
    } catch (error) {
      console.log('error: ', error)
    }
  }

  // slanje recepta
  async function sendRec() {
    try {
      try {
        let i = 0
        for (let korak of postupak.value) {
          if (koraciImages.value[i] != null) {
            const respIm = await api.imgHandle({
              image: koraciImages.value[i],
              sid: sid,
              idImg: korak.idImg,
            })
            koraci.value[i].idImg = respIm.data.idImg
          }
          i++
        }
      } catch (error) {
        console.log('error:', error)
      }

      const ingredients = JSON.stringify(Recept.value.ingredients)
      const categoryee = JSON.stringify(Recept.value.category)
      const prep = JSON.stringify(Recept.value.prep)

      const resp = await api.createRec({
        sid: sid,
        recTitle: Recept.value.recTitle,
        peopleCounter: Recept.value.peopleCounter,
        recipeDesc: Recept.value.recipeDesc,
        prepDuration: Recept.value.prepDuration,
        image: Recept.value.Image,
        ingredients: ingredients, //JSON - ok
        prep: prep, //JSON - ok
        category: categoryee, // JSON - ok
      })

      return resp.data.res
    } catch (error) {
      console.log('error: ', error)
      console.log('res error: ', error.response.data.message)
      if (error.response.data.message === 'not logged in') {
        loginStore.logout()
        router.push('/login')
      }
      return error.response.data.message
    }
  }

  ///////////////////////////////////////////////////////////////////////////// end of API  ///////////////

  /////////   Input and select  ///////////////////////////////////////////////////////////////////////////

  /// HANDLE inputs   +++++++++++++

  function inpHandle(id, value, ind) {
    if (id > koraci.value.length) return

    if (ind === 1) {
      koraci.value[id].korakNaslov = value
    }
    if (ind === 2) {
      koraci.value[id].text = value
    }
  }

  /// HANDLE selections  +++++++++++

  function selectHandle(id, value, ind) {
    console.log('event target value:', value)
    if (sastojci.value[id]) {
      if (ind === 1) {
        sastojci.value[id].idM = parseInt(value)
      }
      if (ind === 2) {
        sastojci.value[id].kolicina = parseFloat(value)
      }
      if (ind === 3) {
        sastojci.value[id].id = parseInt(value)
      }
    }
  }

  //////////// end of  input and select /////////////////////////////////////////////////////////////////////////////

  function resetStore() {
    // rec  //
    idImgMain.value = null
    imeRecepta.value = null
    brOsoba.value = 1
    opisRecepta.value = null
    vremePripreme.value = 1
    mainImage.value = null
    // Sastojci //

    sastojci.value = [{ id: 0, kolicina: null, idM: null }]

    // Koraci //

    koraci.value = [{ idImg: null, text: 'Text..', korakNaslov: 'Naslov..' }]
    koraciImages.value = [null]
    idImg.value = null

    categorySelected.value = []
  }

  return {
    currentRecId,
    currentRec,
    imeRecepta,
    brOsoba,
    opisRecepta,
    vremePripreme,
    slikaRecepta,
    idImg,

    //IMAGES
    mainImageDisplay,
    handleImage,
    handleImageStep,
    getImageStep,

    //KORACI
    postupak,
    koraci,
    dodajKorak,
    skiniKorak,

    //SASTOJCI
    dodajSastojak,
    skiniSastojak,
    upotrebljeniSastojci,
    sastojci,
    // ---- spisak sastojaka i mera sa Backenda ---- //
    sast,
    mere,
    sasts,
    meres,

    //CATEGORY
    category,
    categorySelected,
    cats,
    ingAndMeasures,

    //API
    sendRec,

    //INPUT
    inpHandle,
    selectHandle,

    // RESET STORE
    resetStore,

    // RRESPONSE
    response,
    getResponseStatus,
  }
})
