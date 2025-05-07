import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../../api'

export const useUserStore = defineStore('user', () => {
  const sid = ref(localStorage.getItem('sid'))
  const session = computed(() => sid.value)

  const editImg = ref(null)
  const editImage = computed(() => editImg.value && URL.createObjectURL(editImg.value))

  const fU = ref(null)
  const foreignUser = computed(() => fU.value)

  const idUsr = ref(null)
  const name = ref(null)
  const idImg = ref(null)
  const image = ref(null)
  const fn = ref(null)
  const ln = ref(null)
  const mail = ref(null)
  const password = ref(null)

  const idUser = computed(() => idUsr.value)
  const nameUser = computed(() => name.value)
  const idImage = computed(() => idImg.value)
  const imageUser = computed(() => image.value && imgFromString(image.value))
  const firstName = computed(() => fn.value)
  const lastName = computed(() => ln.value)
  const email = computed(() => mail.value)
  const pass = computed(() => password.value)

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

  async function deleteUsr() {
    try {
      await api.deleteUser({ idUsr: idUser.value, idRec: null })
    } catch (error) {
      console.log('error: ', error)
      console.log('res error: ', error.response.data.message)
    }
  }

  async function readUsr() {
    try {
      const response = await api.readUser({ sid: sid.value, idUsr: foreignUser.value })

      idUsr.value = response.data.id
      name.value = response.data.name
      idImg.value = response.data.idImg
      image.value = response.data.image
      fn.value = response.data.firstName
      ln.value = response.data.lastName
      mail.value = response.data.email
      password.value = response.data.pass
    } catch (error) {
      console.log('error: ', error)
      console.log('res error: ', error.response.data.message)
    }
  }

  function handleImage(event) {
    editImg.value = event.target.files[0]
    event.target.value = null
  }

  async function editUsr(id, name, email, pass, firstName, lastName) {
    try {
      let imgResp = null
      try {
        if (editImg.value)
          imgResp = await api.imgHandle({
            image: editImg.value,
            idImg: idImg.value,
            sid: localStorage.getItem('sid'),
          })
      } catch (error) {
        console.log('error: ', error)
      }
      if (imgResp) {
        await api.editUser({
          idUsr: id,
          sid: session.value,
          user: {
            name: name,
            email: email,
            pass: pass,
            firstName: firstName,
            lastName: lastName,
            idImg: imgResp.data.idImg,
          },
        })
      } else {
        await api.editUser({
          idUsr: id,
          sid: session.value,
          user: {
            name: name,
            email: email,
            pass: pass,
            firstName: firstName,
            lastName: lastName,
            idImg: null,
          },
        })
      }
    } catch (error) {
      console.log('error: ', error)
    }
  }

  function resetStore() {
    fU.value = null
  }

  return {
    readUsr,
    idUser,
    nameUser,
    imageUser,
    firstName,
    lastName,
    email,
    pass,
    editUsr,
    editImage,
    idImage,
    handleImage,
    deleteUsr,
    session,
    fU,
    resetStore,
    foreignUser,
  }
})
