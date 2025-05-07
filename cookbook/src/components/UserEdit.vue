<script setup>
import { useUserStore } from '@/stores/user'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const user = useUserStore()
const router = useRouter()
const showPopup = ref(false)

onMounted(async () => {
  await user.readUsr()
})

const username = ref(null)
const firstName = ref(null)
const lastName = ref(null)
const email = ref(null)
const pass = ref(null)

function handleDeleteClick() {
  user.deleteUsr(user.idUser)
  router.push('/')
}
function handleClickSave() {
  user.editUsr(
    user.idUser,
    username.value,
    email.value,
    pass.value,
    firstName.value,
    lastName.value,
  )
  router.push('/myProfile')
}
</script>
<template>
  <h1 class="velikiNaslov">Zdravo, {{ user.nameUser }}</h1>
  <h6 class="maliNaslov">Ovo je strana za uređivanje Vašeg profila</h6>

  <input ref="file-input" type="file" class="file-input maloDugme" @change="user.handleImage" />
  <div class="avatar">
    <img v-if="user.editImage" :src="user.editImage" :alt="user.nameUser" class="responsive-img" />
    <img
      v-else-if="user.imageUser"
      :src="user.imageUser"
      :alt="user.nameUser"
      class="responsive-img"
    />
    <img
      v-else
      src="/src/assets/icons/userProfilePic.svg"
      alt="Profilna slika"
      class="responsive-img"
    />
  </div>
  <input type="text" class="inputText" :placeholder="user.nameUser" v-model="username" />

  <input type="text" class="inputText" :placeholder="user.email" v-model="email" />

  <input type="password" class="inputText" placeholder="Unesite novu lozinku..." v-model="pass" />

  <input type="text" class="inputText" :placeholder="user.firstName" v-model="firstName" />

  <!-- ČUVANJE IZMENA -->
  <input type="text" class="inputText" :placeholder="user.lastName" v-model="lastName" />
  <button class="maloDugme" @click="handleClickSave">Sačuvaj izmene</button>

  <!-- BRISANJE NALOGA -->
  <span>
    <button class="maloDugme" @click="showPopup = true">Obriši nalog</button>
    <div v-if="showPopup" class="popup">
      <div class="popup-content">
        <span class="close" @click="showPopup = false">&times;</span>
        <h1 class="velikiNaslov">Da li ste sigurni da želite obrisati ovaj nalog?</h1>
        <h3 class="maliNaslov">
          Ukoliko obrišete nalog, moći ćete ponovo da mu pristupite ponovnim logovanjem na njega
        </h3>
        <button class="maloDugme" @click="handleDeleteClick">Da</button>
        <button class="maloDugme" @click="showPopup = false">Ne</button>
      </div>
    </div>
  </span>
</template>
<style scoped>
.avatar {
  height: 200px;
}
img {
  height: 100%;
  width: auto;
}
</style>
