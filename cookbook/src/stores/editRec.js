import { useRecipe1Store } from './recipe'
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { useLoginStore } from './login'
import api from '../../api'

export const useEditStore = defineStore('editRecipe', () => {
  const router = useRouter()
  const loginStore = useLoginStore()

  const currentRecId = ref(localStorage.getItem('idRec'))
  const currentRec = computed(() => currentRecId.value)

  function setCurrentRecId(id) {
    currentRecId.value = id
  }

  function getCurrentRecId() {
    return currentRec.value
  }

  const store = useRecipe1Store()

  ////////////////////////////
  ////// Fotografije ////////////////////////////////////////////////////////////////////////////////

  //glavna fotografija
  const mainImage = ref(null) // file
  const mainImageDisplay = computed(() => mainImage.value && URL.createObjectURL(mainImage.value))

  // fotografije koraka
  const koraciImages = ref([])
  function getImageStep(index) {
    if (koraciImages.value[index] != null) {
      const image = URL.createObjectURL(koraciImages.value[index])
      return image
    } else return null
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////

  const Recept = ref({})
  const korisnik = ref(null)

  //* PROPS */

  // user data
  const sid = localStorage.getItem('sid')

  // Recept - props
  const idRec = computed(() => store.getCurrentRecId())
  const idImg = ref(null)
  const idImage = computed(() => idImg.value)
  const imeRecepta = ref(null)
  const brOsoba = ref(null)
  const opisRecepta = ref(null)
  const vremePripreme = ref(null)
  const slikaRecepta = computed(() => mainImage.value)

  // Sastojci - props
  const sastojci = ref([{ kolicina: null, idM: null, mera: null, ime: null }])

  // ---- spisak sastojaka i mera sa Backenda ---- //
  const sast = ref(null)
  const sasts = computed(() => sast.value)
  const mere = ref(null)
  const meres = computed(() => mere.value)

  // koraci //
  const korakci = ref([{ idImg: null, text: null, korakNaslov: null }])
  const koraci = computed(() => korakci.value)
  //const koraciNum = ref(0); Da li nam ovo treba?
  const prepstepTitles = computed(() => store.stepTitles)
  console.log('step texts', prepstepTitles.value)
  /// /// /// ///

  function dodajKorak() {
    // koraciNum.value += 1;
    const korak = { idImg: null, text: null, korakNaslov: `Korak ${koraci.value.length + 1}` }
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
  const postupak = computed(() => koraci.value)

  // sastojci //
  const upotrebljeniSastojci = computed(() => sastojci.value)

  // kategorije //
  const category = ref([])
  const categoryMirror = ref([])
  const categorySelected = ref([])
  const kategorije = computed(() => categorySelected.value)

  // FOTOGRAFIJE -functions

  function handleImage(e) {
    mainImage.value = e.target.files[0]
    e.target.value = null
  }

  function handleImageStep(event) {
    koraci.value[idImage.value].image = event.target.files[0]
    koraciImages.value.splice(idImage.value, 1, event.target.files[0])
    event.target.value = null
  }

  // SASTOJCI - functions
  function dodajSastojak() {
    const sastojak = { id: null, kolicina: null, idM: null, mera: null, ime: null }
    sastojci.value.push(sastojak)
  }

  const naslov = computed(() => imeRecepta.value)
  const vreme = computed(() => vremePripreme.value)
  const osobe = computed(() => brOsoba.value)
  const opis = computed(() => opisRecepta.value)

  /////////////////////////////////////////////////

  const recipeJS = computed(() => [
    {
      recTitle: naslov.value,
      prepDuration: vreme.value,
      peopleCounter: osobe.value,
      recipeDesc: opis.value,
    },
  ])

  ////////////////////////////////////////////////

  function skiniSastojak(id) {
    if (sastojci.value.length === 1) {
      return
    }
    sastojci.value.splice(id, 1)
  }

  /////   API   ////////////////////////////////////////////////////////////////////////////////////////////

  // kategorije sa Backenda
  async function cats() {
    try {
      const resp = await api.getCategory()
      category.value = resp.data.data

      return {
        categories: resp.data.data,
      }
    } catch (error) {
      console.log('error: ', error)
      console.log('res error: ', error.response.data.message)
      if (error.response.data.message === 'not logged in') {
        loginStore.logout()
        router.push('/login')
      }
    }
  }

  // sastojci i mere sa Backenda
  async function ingAndMeasures() {
    try {
      const res = await api.IngAndMeasure()
      sast.value = res.data.dataIng
      mere.value = res.data.dataMeasure

      return {
        sastojci: res.data.dataIng,
        mere: res.data.dataMeasure,
      }
    } catch (error) {
      console.log('error: ', error)
    }
  }

  /// create Rec Morror -- filler
  async function createMirror() {
    const res = await store.getRec(currentRec.value)
    const titles = res.prepstep.titles
    const ingredients = res.recingmeasure.ingIds
    console.log('titles:', titles)
    for (let i = 0; i < titles.length - 1; i++) {
      dodajKorak()
    }
    for (let i = 0; i < ingredients.length - 1; i++) {
      dodajSastojak()
    }
  }

  // SLANJE RECEPTA // API
  async function editRec() {
    try {
      // upload glavne slike
      if (mainImage.value) {
        try {
          await api.imgHandle({
            image: mainImage.value,
            sid: sid,
            idImg: store.mainImageId,
          })
        } catch (error) {
          console.log('error:', error)
        }
      }

      try {
        // slanje slika dobijanje ID za upis u bazu
        let i = 0
        for (let korak of postupak.value) {
          if (koraciImages.value[i]) {
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

      const ingredientds = JSON.stringify(upotrebljeniSastojci.value)
      const categoryee = JSON.stringify(kategorije.value)
      const prep = JSON.stringify(postupak.value)
      const recipe = JSON.stringify(recipeJS.value)

      const resp = await api.editRecipe({
        sid: sid,

        idRec: idRec.value,
        recipe: recipe,
        ingredients: ingredientds,
        prep: prep,
        category: categoryee,
      })
      if (resp.data.res) {
        return 'ok'
      }
    } catch (error) {
      console.log('error: ', error)
      console.log('res error: ', error.response.data.message)
      return error.response.data.message
    }
  }

  ///////////////////////////////////////////////////////////////////////////// end of API  ///////////////

  /////////   Input and select  ///////////////////////////////////////////////////////////////////////////

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
    if (sastojci.value[id]) {
      if (ind === 1) {
        sastojci.value[id].idM = parseInt(value)
      }
      if (ind === 2) {
        if (value) {
          sastojci.value[id].kolicina = parseFloat(value)
        }
      }
      if (ind === 3) {
        sastojci.value[id].id = parseInt(value)
      }
    }
  }

  //////////// end of  input and select /////////////////////////////////////////////////////////////////////////////

  function resetStore() {
    korisnik.value = null
    Recept.value = {}
    mainImage.value = null
    koraciImages.value = []
    idImg.value = null
    imeRecepta.value = null
    brOsoba.value = null
    opisRecepta.value = null
    vremePripreme.value = null
    sastojci.value = [{ kolicina: null, idM: null, mera: null, ime: null }]
    korakci.value = [{ idImg: null, text: null, korakNaslov: null }]
    categorySelected.value = []
    categoryMirror.value = []

    // recreate mirror
    createMirror()
  }

  return {
    // recept
    currentRecId,
    currentRec,
    korisnik,
    imeRecepta,
    brOsoba,
    opisRecepta,
    vremePripreme,
    slikaRecepta,
    idImg,
    setCurrentRecId,
    getCurrentRecId,
    createMirror,

    // kategorije
    category,
    categorySelected,
    categoryMirror,

    // ---- spisak sastojaka i mera sa Backenda ---- //
    sast,
    mere,
    sasts,
    meres,

    // Koraci - props
    koraci,
    postupak,
    koraciImages,
    sastojci,
    upotrebljeniSastojci,

    //IMAGES
    mainImageDisplay,
    getImageStep,
    handleImage,
    handleImageStep,

    //KORACI
    dodajKorak,
    skiniKorak,
    //choseFileStep,

    //REC
    //choseFileMain,

    //SASTOJCI
    dodajSastojak,
    skiniSastojak,

    //CATEGORY
    cats,
    ingAndMeasures,

    //API
    editRec,

    //INPUT
    selectHandle,
    inpHandle,

    // RESET
    resetStore,
  }
})
