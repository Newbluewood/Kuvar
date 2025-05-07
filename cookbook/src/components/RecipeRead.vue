<script setup>
import { useRecipe1Store } from '@/stores/recipe'
import { useEditStore } from '@/stores/editRec'
import { ref, computed, onMounted, onUnmounted, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import { useCommentStore } from '@/stores/comment'
import { useReportStore } from '@/stores/report'
import { useUserStore } from '@/stores/user'
import { useFavStore } from '@/stores/favs'
import api from '../../api'
import PopUp from './Stvarcice/PopUp.vue'
import { useWakeLock } from '@vueuse/core'
import { reactive } from 'vue'

const wakeLock = reactive(useWakeLock())
function lock() {
  return wakeLock.isActive ? wakeLock.release() : wakeLock.request('screen')
}

const store = useRecipe1Store()
const storeEdit = useEditStore()
const router = useRouter()
const comStore = useCommentStore()
const inputText = ref(null)
const showPopup = ref(false)
const report = useReportStore()
const user = useUserStore()
const fav = useFavStore()
const currentRecId = store.getCurrentRecId()
const id = computed(() => localStorage.getItem('id'))
const sid = computed(()=> localStorage.getItem('sid'))
const isAdmin = computed(() => localStorage.getItem('admin'))
const notAvaliable = 'Nazalost, ovaj recept vise ne postoji!'
const test = ref(false)
const check = ref(false)
const repCheck = ref(true)
const readCount = ref(null)
const rc = computed(() => readCount.value)
const editMode = ref(false)
const message = ref()
const nameU = ref()
const thisUser = computed(() => nameU.value)

const newIngs = computed(() => {
  let niz = []
  for (let i = 0; i < store.quantitys.length; i++) {
    niz[i] = ((store.quantitys[i] * rc.value) / store.peopleCount).toFixed(1)
  }
  return niz
})

const data = ref(null)
const available = computed(() => data.value)
onMounted(async () => {
  try {
    const sendId = store.getCurrentRecId()
    console.log("sendId", sendId)
    if (sendId) {
      await store.getRec(sendId)
      data.value = store.recipe
      readCount.value = store.peopleCount
      comStore.readComments(sendId)
      if (localStorage.getItem('sid')) fav.checkFav(sendId)
    }
    await user.readUsr()
    nameU.value = user.nameUser
  } catch (error) {
    test.value = true
    console.log('Greska ReadRecipe:', error)
    console.log(error.response.data.message)
  } finally {
    test.value = true
  }
  if (store.idUsr == localStorage.getItem('id')) {
    repCheck.value = false
    check.value = true
  }
  if (localStorage.getItem('admin') == 'true') {
    check.value = true
  }
})

// Popup handler /////////////////////

const nums = ref([])
const btns = ref([])
const tempId = ref()

const popupHeader = ref()
const popupText = ref()
const PopupShow = ref(false)
const selectionValue = ref()

function popupMessage() {
  nums.value = []
  //nums.value.push(5)
  //nums.value.push(6)
  btns.value = []
  //btns.value.push('Da')
  //btns.value.push('Ne')
  PopupShow.value = true
  popupHeader.value = ' PORUKA !'
  popupText.value = message.value
}

function popupDeleteRec() {
  nums.value = []
  nums.value.push(1)
  nums.value.push(2)
  btns.value = []
  btns.value.push('Da')
  btns.value.push('Ne')
  PopupShow.value = true
  popupHeader.value = ' UPOZORENJE !'
  popupText.value = ' DA LI STE SIGURNI DA ZELITE DA OBRISETE RECEPT ? '
}

function popupDeledeComm(id) {
  nums.value = []
  nums.value.push(3)
  nums.value.push(4)
  btns.value = []
  btns.value.push('Da')
  btns.value.push('Ne')
  PopupShow.value = true
  popupHeader.value = ' UPOZORENJE !'
  popupText.value = ' DA LI STE SIGURNI DA ZELITE OBRISATI KOMENTAR ? '
  tempId.value = id
}
function PopupHandle(type, prop) {
  PopupShow.value = false
  if (type === 0) {
    selectionValue.value = prop
  } else if (type === 1) {
    selectionValue.value = prop
    handleClickDelete()
  } else if (type === 2) {
    selectionValue.value = prop
  } else if (type === 3) {
    selectionValue.value = prop
    handleDeleteComent(tempId.value)
    window.location.reload()
  } else if (type === 4) {
    selectionValue.value = prop
  } else {
    selectionValue.value = prop
    popupMessage()
    window
  }
}
// popup ////////////////////////////// */

async function handleClickDelete() {
  console.log
  try {
    await api.deleteRecipe({ idRec: store.getCurrentRecId(), sid:sid.value })
    router.push("/recipes")
  } catch (error) {
    console.log('error: ', error)
    console.log('res error: ', error.response.data.message)
  }
}

const file_input_main = useTemplateRef('file-input')
function choseFileMain() {
  file_input_main.value.click()
}

function handleClickEdit() {
  storeEdit.setCurrentRecId(store.getCurrentRecId())
  storeEdit.createMirror()
  router.push('/edit')
  editMode.value = true
}

async function handleInputClick() {
  comStore.currentRecId = currentRecId
  comStore.text = inputText.value
  message.value = await comStore.createComment()
  if (message.value === 'ok') {
    window.location.reload()
  }
}

async function handleDeleteComent(id) {
  console.log('commm id', id)
  message.value = await comStore.deleteComments(id)
  if (message.value === 'ok') {
    window.location.reload()
  }
  window.location.reload()
}

function handleReport() {
  showPopup.value = false
  const id = store.getCurrentRecId()
  report.reportRecipe(user.session, id)
}

function handleClickAddFav() {
  fav.addFav(currentRecId)
  fav.c = true
}
function handleClickDeleteFav() {
  fav.removeFav(currentRecId)
  fav.c = false
}

function handleClickUser() {
  user.fU = store.idUsr
  router.push('/myProfile')
}
function handleClickUserComment() {}

onUnmounted(() => {
  comStore.resetStore()
})
</script>

<template>
  <div v-if="!test"><h1 class="velikiNaslov">Učitavanje...</h1></div>
  <div v-else-if="available">
    <!-- PopUp -->

    <div class="mod">
      <!-- <button @click="PopupShow = true">Show Modal</button> -->
      <PopUp
        v-if="PopupShow"
        @close-popup="PopupHandle"
        :buttonName="btns"
        :callNumber="nums"
        :message="message"
      >
        <template #header>{{ popupHeader }}</template>
        <template #content> {{ popupText }}</template>
      </PopUp>
    </div>

    <!-- /PopUp -->

    <div>
      <div class="recipe-view">
        <!-- Naslov -->
        <h1 class="velikiNaslov">{{ store.title }}</h1>

        <div class="maliNaslov dodatno velikaSlova">
          <span v-if="store.user"
            >Od: <a class="user-name link" @click="handleClickUser">{{ store.user }}</a
            >,
          </span>
          <span> {{ new Date(store.created).toLocaleDateString() }}</span>
          <span v-if="id != null" class="likes">
            <span v-if="fav.check == true" @click="handleClickDeleteFav" class="social-icon">
              <img src="/src/assets/icons/fav.svg" alt="favorites" />
            </span>
            <span v-else @click="handleClickAddFav" class="social-icon">
              <img src="/src/assets/icons/unfav.svg" alt="favorites" />
            </span>
            <!-- {{ store.favorites || 0 }} -->
          </span>
        </div>
        <!-- Glavni sadržaj u 3 kolone -->
        <div class="three-column-layout">
          <!-- Prva kolona: Recipe Content -->
          <div class="recipe-content">
            <div class="recipe-image">
              <button class="maloDugme noSleep" @click="lock">
                <img src="/src/assets/icons/owl.svg" /> Ne gasi ekran
              </button>
              <img :src="store.img" :alt="store.recTitle" />
              <div class="recipe-info">
                <p>
                  Za
                  <input
                    class="rec-spec"
                    type="number"
                    :placeholder="store.peopleCount"
                    v-model.number="readCount"
                    min="1"
                  />osoba
                </p>
                <h3>Sastojci:</h3>
                <ul>
                  <li v-for="(ingr, index) in newIngs" :key="index">
                    {{ store.ingredients[index] }} ({{ newIngs ? ingr : store.quantitys[index]
                    }}{{ store.units[index] }})
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Središnja kolona: Recipe Preparation -->
          <div class="recipe-preparation">
            <h1>Priprema:</h1>
            <div
              class="recipe-preparation-divider"
              v-for="(stepImgsURL, index) in store.stepTexts"
              :key="index"
            >
              <div>
                <h4>{{ index + 1 }}. {{ store.stepTitles[index] }}</h4>
                <p>{{ store.stepTexts[index] }}</p>
              </div>

              <div class="koraci">
                <div v-if="(store.pushImage(index))" class="slikaKoraka">
                  <img :src="store.pushImage(index)" :alt="store.stepTitles[index]" />
                </div>
                <div v-else>
                </div>
              </div>
            </div>
          </div>

          <!-- Treća kolona: Comments -->
          <div class="recipe-comments">
            <h1>Komentari</h1>
            <!--  KOMENTARI -->
            <div v-if="comStore.comments && comStore.comments.length > 0">
              <div
                class="comment"
                v-for="(comment, index) in comStore.comments"
                :key="comment.idCom"
              >
                <div class="comment-header">
                  <span class="">
                    <a class="link" @click="handleClickUserComment">
                      <img
                        v-if="comment.usrImg != null"
                        :src="comment.usrImg"
                        alt="Profilna slika"
                        class="responsive-img"
                      />
                      <img
                        v-else
                        src="/src/assets/icons/userProfilePic.svg"
                        alt="Profilna slika"
                        class="responsive-img"
                      />
                    </a>
                  </span>
                  <span class="user-name">{{ comment.name }}</span>
                </div>

                <div class="comment-content">
                  <h3>{{ comment.text }}</h3>
                  <img :src="comStore.pushImage(index)" />
                  <button
                    v-if="comment.name === thisUser || check"
                    @click="popupDeledeComm(comment.idCom)"
                    class="maloDugme"
                  >
                    x - obrisi ovaj komentar
                  </button>
                </div>
              </div>
            </div>
            <div v-else>
              <h1 class="maliNaslov">Trenutno nema postavljenih komentara!</h1>
            </div>

            <div v-if="id != null">
              <input type="text" class="inputText" v-model="inputText" placeholder="Komentar..." />
              <!--  slika komentara -->

              <div class="file-upload">
                <div class="file-aria">
                  <input
                    ref="file-input"
                    type="file"
                    class="file-input"
                    @change="comStore.handleImage"
                  />
                  <div class="slikaKomentara">
                    <img :src="comStore.mainImageDisplay" />
                  </div>
                  <button class="maloDugme" @click="choseFileMain">Dodaj fotografiju</button>
                </div>
              </div>
              <button class="velikoDugme" @click="handleInputClick">Postavi komentar</button>
            </div>
            <div v-else>
              <button class="maloDugme">
                Želite da ostavite komentar?
                <RouterLink to="/login" class="nav-link">Prijavite se</RouterLink>
              </button>
            </div>
          </div>
        </div>

        <div v-if="id != null && isAdmin">
          <h2>Opcije za autorizovanog korisnika</h2>
          <button v-if="check" class="velikoDugme" @click="handleClickEdit">Edit</button>
          <button v-if="check" class="velikoDugme" @click="popupDeleteRec">Obrisi recept</button>
          <!--     @click="handleClickDelete"      -->
          <button v-if="repCheck" class="velikoDugme" @click="showPopup = true">Report</button>
          <div v-if="showPopup" class="popup">
            <div class="popup-content">
              <span class="close" @click="showPopup = false">&times;</span>
              <p>Da li zelis da prijavis ovaj recept?</p>
              <button class="maloDugme" @click="handleReport">Da</button>
              <button class="maloDugme" @click="showPopup = false">Ne</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <h1 class="velikiNaslov">{{ notAvaliable }}</h1>
  </div>
</template>
<style scoped>
/* Postojeći stilovi */
.recipe-view {
  padding: 0.5%;
  max-width: 1200px;
  margin: 0 auto;
}

.recipe-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}

.recipe-meta {
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 20px;
}

.likes {
  margin-left: 2%;
}

.noSleep {
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  gap: 8px;
}

.noSleep img {
  width: 20px;
  height: 20px;
  display: block;
}

.rec-spec {
  width: 50px;
  border: 2px solid var(--tamnija-bordo);
  background-color: rgba(236, 233, 227, 0.245);
  border-radius: 0.6rem;
  text-align: center;
  color: var(--tamnija-bordo);
  margin: 5px;
}

.recipe-content {
  align-items: start;
}

.recipe-image img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.recipe-info {
  font-size: 1rem;
}

ul {
  list-style: none;
  padding: 0;
}

ul li {
  margin-bottom: 5px;
}

.recipe-preparation {
  text-align: left;
}
.recipe-preparation-divider {
  margin-top: 30px;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
}
.recipe-preparation h4 {
  margin: 10px 0;
}

.comment-content {
  background: var(--sivkasta);
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.inputText {
  width: 100% !important;
}

/* Novi stilovi za tri kolone */
.three-column-layout {
  display: grid;
  grid-template-columns: 3fr 5fr 2fr; /* Omjer 3:5:2 */
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  text-align: left !important;
}

.recipe-content,
.recipe-preparation,
.recipe-comments {
  border-radius: 10px;
  padding: 0.5%;
}

.recipe-content .recipe-image img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
}
.recipe-preparation img {
  max-width: 80%;
  height: auto;
  border-radius: 10px;
}
.file-upload {
  margin: 1rem;
  background-color: rgba(240, 248, 255, 0.069);
  border: 2px dashed rgb(143, 145, 145);
  border-radius: 1rem;
  height: fit-content;
}
.file-input {
  display: none;
}
.file-aria {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
.slikaKomentara {
  width: 200px;
  height: auto;
  min-height: 200px;
  margin: 0.5rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(214, 214, 214, 0.361);
  border-radius: 1rem;
  background-color: rgba(255, 228, 196, 0.043);
}

img {
  width: 100%;
}

.dodatno {
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

.likes img {
  width: 18px;
  display: block;
}

/* Responzivni dizajn */
@media (max-width: 992px) {
  .three-column-layout {
    grid-template-columns: 1fr 2fr; /* Dve kolone na srednjim ekranima */
  }

  .recipe-comments {
    grid-column: span 2; /* Komentari prelaze u novu sekciju */
  }
}

@media (max-width: 768px) {
  .three-column-layout {
    grid-template-columns: 1fr; /* Sve u jednoj koloni na malim ekranima */
  }
}
</style>
