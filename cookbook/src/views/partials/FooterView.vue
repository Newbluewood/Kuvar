<script setup>
import { useLoginStore } from '@/stores/login'
import { ref, computed, watchEffect } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import PopUp from '@/components/Stvarcice/PopUp.vue'

// NOVO 02.02.>  dodato

// Popup handler /////////////////////

const nums = ref([])
const btns = ref([])

const popupHeader = ref()
const email = ref()
const password = ref()
const PopupShow = ref(false)

function popupLogin() {
  nums.value = []
  nums.value.push(1)
  nums.value.push(2)
  btns.value = []
  if (status.value) {
    popupHeader.value = ' ODJAVA '
    btns.value.push('Izloguj me')
  } else {
    popupHeader.value = ' Prijavite se! '
    btns.value.push('Uloguj me')
    btns.value.push('Registracija')
  }

  PopupShow.value = true
}

function PopupHandle(type) {
  PopupShow.value = false
  if (type === 0) {
    return
  }
  if (type === 1) {
    store.toggle(email.value, password.value)
  }
  if (type === 2) {
    router.push('/register')
  }
}
// popup ////////////////////////////// */

const store = useLoginStore()
const user = useUserStore()
const router = useRouter()

const status = ref(true)
const isAdmin = ref(false)
console.group('Admin', isAdmin.value)
watchEffect(() => {
  if (localStorage.getItem('sid')) {
    status.value = true
    //router.push('/myProfile')
  } else {
    status.value = false
  }
  if (localStorage.getItem('admin') === 'true') {
    isAdmin.value = true
  } else {
    isAdmin.value = false
  }
  //status.value = localStorage.getItem('sid')
  //isAdmin.value = localStorage.getItem('admin')
})

function handleReload(location, destination) {
  if (destination === '/login' && status.value) {
    store.logout()
    alert('Uspesno ste se izlogovali')
  }
  if (location == destination) {
    window.location.reload()
  }
}

function resetUser() {
  user.resetStore()
}

const location = computed(() => window.location.pathname)
</script>
<template>
  <!-- PopUp -->

  <div class="mod">
    <!-- <button @click="PopupShow = true">Show Modal</button> -->
    <PopUp
      v-if="PopupShow"
      @close-popup="PopupHandle"
      :buttonName="btns"
      :callNumber="nums"
      :message="message"
      :login="true"
    >
      <template #header><h1 class="manjiVelikiNaslov">{{ popupHeader }}</h1></template>
      <template #content>
        <!-- dodato 02.02. -->
        <div class="login-form" v-if="!status">
          <input type="text" name="e-mail" v-model="email" placeholder="E-mail" />
          <input type="password" name="e-mail" v-model="password" placeholder="Lozinka" />
        </div>
        <div v-else>
          {{ 'Zelite se odjaviti ?' }}
        </div>
        <!--   kraj dodatog   -->
      </template>
    </PopUp>
  </div>

  <!-- /PopUp -->
  <div>User:{{ store.userName }} id: {{ store.userId }} is Admin : {{ isAdmin }}</div>
  <nav class="nav fixed-bottom justify-content-center">
    <ul class="nav-list">
      <li class="">
        <RouterLink @click="handleReload(location, '/')" to="/" class="nav-link" aria-current="page"
          >Početna</RouterLink
        >
      </li>

      <li class="">
        <RouterLink
          @click="handleReload(location, '/recipes')"
          to="/recipes"
          class="nav-link"
          aria-current="page"
          >Recepti</RouterLink
        >
      </li>

      <li class="" v-if="status">
        <RouterLink
          @click="(handleReload(location, '/myProfile'), resetUser())"
          to="/myProfile"
          class="nav-link"
          aria-current="page"
          >Moj profil</RouterLink
        >
      </li>
      <li class="" v-if="isAdmin">
        <RouterLink
          @click="handleReload(location, '/admin')"
          to="/admin"
          class="nav-link"
          aria-current="page"
          >Admin</RouterLink
        >
      </li>
      <li class="">
        <span class="nav-link link" @click="popupLogin">{{ status ? 'Odjava' : ' Prijava' }}</span>
        <!--
        <RouterLink
          @click="handleReload(location, '/login')"
          to="/login"
          class="nav-link"
          aria-current="page"
          >{{ status ? 'Odjava' : ' Prijava' }}</RouterLink
        >
        -->
      </li>
    </ul>
  </nav>
</template>
<style scoped>
input {
  width: 100%;
  height: 30px;
  border: 2px solid rgb(112, 89, 60);
  border-radius: 1rem;
  margin-bottom: 8px;
  text-align: center;
  font-size: 16px;
  color: var(--text);
}
</style>
