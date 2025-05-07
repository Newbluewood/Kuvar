import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../../api'
import { useLoginStore } from './login'

export const useCommentStore = defineStore('comment', () => {
  const loginStore = useLoginStore()

  const currentRecId = ref(null)
  const currentRec = computed(() => currentRecId.value)

  const mainImage = ref(null) // file
  const mainImageDisplay = computed(() => mainImage.value && URL.createObjectURL(mainImage.value))
  const slikaCom = computed(() => mainImage.value)

  function handleImage(event) {
    mainImage.value = event.target.files[0]
    event.target.value = null
  }

  const sid = localStorage.getItem('sid')

  const idImg = ref(null)
  const idImage = computed(() => idImg.value)

  const text = ref('')
  const response = ref(null)
  const readText = computed(() => response.value && response.value.coms)
  const readUser = computed(() => response.value && response.value.users)
  const readImgs = computed(() => response.value && response.value.imgs)
  const readUserName = computed(() => response.value && response.value.names)
  const readUserImage = computed(() => response.value && response.value.userImgs)
  const readIdCom = computed(() => response.value && response.value.idCom)

  function pushImage(index) {
    //helper f-ja , vraca url za prosledjenu sliku koristimo i komponenti
    if (readImgs.value) {
      return imgFromString(readImgs.value[index])
    }
  }

  const commentss = ref([])
  const comments = computed(() => commentss.value)

  function resetStore() {
    mainImage.value = null // file

    text.value = null
    response.value = null

    commentss.value = []
  }

  const koraciImages = ref([null]) // file for database

  const koraciImageDisplay = computed(() => {
    const temp = []
    if (koraciImages.value && koraciImages.value.length > 0) {
      for (let image of koraciImages.value) {
        if (image) {
          temp.push(imgFromString(image))
        }
      }
    }
    return temp
  })

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

  function handleImageStep(event) {
    //koraci.value[idImage.value].idImg = event.target.files[0]
    koraciImages.value.splice(idImage.value, 1, event.target.files[0]) // URL.createObjectURL(event.target.files[0]
    event.target.value = null
  }

  async function createComment() {
    console.log('slika')
    try {
      let imgResp = null
      try {
        if (slikaCom.value != null) {
          console.log('slika')
          imgResp = await api.imgHandle({ image: slikaCom.value, idImg: null, sid: sid })
        } else {
          imgResp = { data: { idImg: null } }
        }
      } catch (error) {
        console.log('error: ', error)
        if (error.response.data.message) {
          return error.response.data.message
        } else if (error.response.data.message === 'not logged in') {
          loginStore.logout()
        } else {
          return ' Doslo je do greske. Pokusajte ponovo'
        }
      }

      const resp = await api.postComment({
        sid: sid,
        idRec: currentRecId.value,
        comment: text.value,
        image: imgResp.data.idImg,
      })
      return resp.data.res
    } catch (error) {
      console.log('error: ', error)
      console.log('res error: ', error.response.data.message)

      if (error.response.data.message) {
        return error.response.data.message
      } else if (error.response.data.message === 'not logged in') {
        loginStore.logout()
      } else {
        return ' Doslo je do greske. Pokusajte ponovo'
      }
    }
  }

  //      ('comments', {users, coms, imgs, names, userImgs})

  async function readComments(id) {
    try {
      const resp = await api.readComment({ idRec: id })
      response.value = resp.data.comments
      console.log('comments', resp.data.comments.idCom)
      if (response.value) {
        for (let i = 0; i < readText.value.length; i++) {
          comments.value.push({
            user: readUser.value[i],
            text: readText.value[i],
            comImg: readImgs.value[i],
            name: readUserName.value[i],
            usrImg: readUserImage.value[i],
            idCom: readIdCom.value[i],
          })
        }
      }
    } catch (error) {
      console.log('error: ', error)
      console.log('res error: ', error.response.data.message)
    }
  }

  async function deleteComments(id) {
    console.log('idCom:', id)
    try {
      const resp = await api.deleteComment({ sid: sid, idCom: id })
      console.log(resp.data.res)
      if (resp.data.res === 'ok') {
        return 'Ok'
      } else {
        return resp.data.res
      }
    } catch (error) {
      console.log('error: ', error)
      console.log('res error: ', error.response.data.message)
      if (error.response.data.message) {
        return error.response.data.message
      } else if (error.response.data.message === 'not logged in') {
        loginStore.logout()
      } else {
        return ' Doslo je do greske. Pokusajte ponovo'
      }
    }
  }

  return {
    currentRecId,
    currentRec,
    createComment,
    readComments,
    deleteComments,
    handleImage,
    mainImageDisplay,
    readText,
    readUser,
    readImgs,
    comments,
    readUserImage,
    readUserName,
    resetStore,
    text,
    koraciImageDisplay,
    handleImageStep,
    pushImage,
  }
})
