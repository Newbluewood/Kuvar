<script setup>
import { useUserStore } from '@/stores/user'
import { onMounted, ref, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useReportStore } from '@/stores/report'
import MyFavoritesView from './MyFavoritesView.vue'
import MyRecipesView from './MyRecipesView.vue'
import { gsap } from 'gsap'

/// ACORDIAN /// //////////////////////////////////////////////////////////////////////////////////

const accordionContent1 = ref(null)
const accordionContent2 = ref(null)
const isOpen1 = ref(false)
const isOpen2 = ref(false)

const toggleAccordion1 = () => {
  if (isOpen1.value) {
    gsap.to(accordionContent1.value, { height: 0, duration: 0.5, ease: 'power2.inOut' })
  } else {
    gsap.to(accordionContent1.value, { height: 'auto', duration: 0.5, ease: 'power2.inOut' })
  }
  isOpen1.value = !isOpen1.value
}
const toggleAccordion2 = () => {
  if (isOpen2.value) {
    gsap.to(accordionContent2.value, { height: 0, duration: 0.5, ease: 'power2.inOut' })
  } else {
    gsap.to(accordionContent2.value, { height: 'auto', duration: 0.5, ease: 'power2.inOut' })
  }
  isOpen2.value = !isOpen2.value
}

///////////////////////////////////////////////////////////////////////////////////////////////////

const user = useUserStore()
const router = useRouter()
const report = useReportStore()
const showPopup = ref(false)
const check = ref(false)
const repCheck = ref(true)
const location = computed(() => window.location.pathname)
const loggedIn = ref(localStorage.getItem('id'))
//const admin = ref(localStorage.getItem('admin') === 'true')

onMounted(async () => {
  await user.readUsr()
  if (user.idUser == localStorage.getItem('id')) {
    repCheck.value = false
    check.value = true
  }
  if (localStorage.getItem('admin') == 'true') {
    console.log('admin')
    check.value = true
  }
})

function handleClickEdit() {
  router.push('/myProfile/edit')
}

function handleReport() {
  showPopup.value = false
  report.reportUsr(user.idUser)
}

function handleReload(location, destination) {
  if (location == destination) window.location.reload()
}

onUnmounted(() => {
  if (location.value != '/myProfile/edit') user.resetStore()
})
</script>
<template>
  <!-- Profil korisnika -->
  <div class="profile-section">
    <img
      v-if="user.imageUser != null"
      :src="user.imageUser"
      :alt="user.nameUser"
      class="profile-picture"
    />
    <img
      v-else
      src="/src/assets/icons/userProfilePic.svg"
      alt="Profilna slika"
      class="profile-picture"
    />

    <div class="user-info">
      <p class="username">{{ user.nameUser }}</p>
      <p class="full-name">{{ user.firstName }} {{ user.lastName }}</p>
    </div>

    <button v-if="check && loggedIn" class="action-button" @click="handleClickEdit">Izmeni profil</button>
    <button v-if="repCheck" class="action-button" @click="showPopup = true">Prijavi korisnika</button>

    <div v-if="showPopup" class="popup">
      <div class="popup-content">
        <span class="close" @click="showPopup = false">&times;</span>
        <p>Da li zelis da prijavis ovog korisnika?</p>
        <button @click="handleReport">Da</button>
        <button @click="showPopup = false">Ne</button>
      </div>
    </div>
  </div>

  <h1 v-if="!repCheck" class="velikiNaslov">Moji recepti</h1>
  <h1 class="velikiNaslov" v-else>Objavljeni recepti</h1>
  <div>
    <RouterLink
      v-if="check && loggedIn"
      @click="handleReload(location, '/recipes')"
      to="/create"
      class="maloDugme"
      >Kreiraj novi recept
    </RouterLink>
  </div>
  <button class="maloDugme" @click="toggleAccordion1">{{ isOpen1 ? 'Sakrij recepte' : 'Prikaži recepte' }}</button>
  <div ref="accordionContent1" class="accordion-content">
    <MyRecipesView />
  </div>

  <h1 v-if="!repCheck" class="velikiNaslov">Moji favoriti</h1>
  <h1 class="velikiNaslov" v-else>Favoriti</h1>
  <button class="maloDugme" @click="toggleAccordion2">{{ isOpen2 ? 'Sakrij favorite' : 'Prikaži favorite' }}</button>
  <div ref="accordionContent2" class="accordion-content">
    <MyFavoritesView />
  </div>
</template>
<style scoped></style>
