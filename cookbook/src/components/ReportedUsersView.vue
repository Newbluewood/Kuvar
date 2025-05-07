<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../../api'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useReportStore } from '@/stores/report'
import PopUp from './Stvarcice/PopUp.vue'

const usrRef = ref([])
const user = computed(() => usrRef.value)
const errorMessage = ref('') // Poruka za grešku
const router = useRouter()
const rep = useReportStore()
const store = useUserStore()
const nums = ref([])
const btns = ref([])
const tempId = ref(null)
const tempRep = ref(null)
const selectedOption = ref(3)
const date = ref(false)
const direction = ref(true)
const sid = localStorage.getItem('sid')

const temp = ref([])

async function sviKorisnici() {
  try {
    const response = await api.prikazReportedUsr({
      sid: sid.value,
      sortByDate: date.value,
      asc: direction.value,
    })
    usrRef.value = response.data.data
    for (let i = 0; i < user.value.ids.length; i++) {
      temp.value.push({
        idRep: user.value.idRep[i],
        id: user.value.ids[i],
        name: user.value.names[i],
        message: user.value.messages[i],
        date: user.value.dates[i],
      })
    }
  } catch (error) {
    errorMessage.value = 'Ne mogu da preuzmem korisnike, pokušaj ponovo.'
    console.error(error)
  }
}
function handleFilter() {
  if (selectedOption.value == 1) {
    date.value = true
    direction.value = true
  } else if (selectedOption.value == 2) {
    date.value = true
    direction.value = false
  } else if (selectedOption.value == 3) {
    date.value = false
    direction.value = false
  }

  temp.value = []
  sviKorisnici()
  date.value = false
}

function handleClick(id) {
  store.fU = id
  router.push('/myProfile')
}
function handleReport() {
  rep.endReport(tempRep.value)
}

// Popup handler /////////////////////
const popupHeader = ref()
const popupText = ref()
const PopupShow = ref(false)
const selectionValue = ref()

function popupZavrsi(id) {
  nums.value = []
  nums.value.push(3)
  nums.value.push(4)
  btns.value = []
  btns.value.push('Da')
  btns.value.push('Ne')
  PopupShow.value = true
  popupHeader.value = ' UPOZORENJE !'
  popupText.value = ' DA LI STE SIGURNI DA ZELITE DA RESITE PRIJAVU ? '
  tempRep.value = id
}

function popupOtvori(id, name, message) {
  nums.value = []
  nums.value.push(1)
  nums.value.push(2)
  btns.value = []
  btns.value.push('Idi na korisnika')
  btns.value.push('Odustani')
  PopupShow.value = true
  popupHeader.value = name
  popupText.value = message
  tempId.value = id
}

function PopupHandle(type, prop) {
  PopupShow.value = false
  if (type === 0) {
    selectionValue.value = prop
  } else if (type === 3) {
    selectionValue.value = prop
    handleReport()
  } else if (type === 4) {
    selectionValue.value = prop
  } else if (type === 1) {
    selectionValue.value = prop
    handleClick(tempId.value)
  } else if (type === 2) {
    selectionValue.value = prop
  } else {
    selectionValue.value = prop
  }
}
// popup //////////////////////////////

onMounted(() => {
  sviKorisnici()
})
</script>
<template>
  <h1 class="manjiVelikiNaslov">Prijavljeni korisnici</h1>
  <div>
    <select id="dropdown" class="sort-dropdown" v-model="selectedOption" @change="handleFilter">
      <option value="1">Datum rastuce</option>
      <option value="2">Datum opadajuce</option>
      <option value="3">Sortiraj po:</option>
    </select>
  </div>
  <div class="card-container">
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <div class="card-grid">
      <div v-if="(temp.user)">
          <div
            v-for="user in temp"
            :key="user.id"
            class="card"
            :style="{ pointerEvents: PopupShow ? 'none' : 'auto' }"
          >
            <h2 class="card-title" @click="popupOtvori(user.id, user.name, user.message)">
              {{ user.name }}
            </h2>
            <h3 class="card-user">Vreme prijave: {{ user.date }}</h3>
            <button class="maloDugme" @click="popupZavrsi(user.idRep)">Zavrsi</button>

            <div class="mod">
              <!-- <button @click="PopupShow = true">Show Modal</button> -->
            </div>
        </div>
      </div>
      <div v-else>
        <h1 class="velikiNaslov"> Trenutno nema prijavljenih korisnika!</h1>
      </div>
    </div>
  </div>
  <PopUp v-if="PopupShow" @close-popup="PopupHandle" :buttonName="btns" :callNumber="nums">
    <template #header>{{ popupHeader }}</template>
    <template #content> {{ popupText }}</template>
  </PopUp>
</template>
<script scoped></script>
