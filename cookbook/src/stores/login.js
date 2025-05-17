import { defineStore } from 'pinia'
import api from '../../api'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export const useLoginStore = defineStore('login', () => {
  const loginStatus = ref()
  const isLoggedIn = computed(() => loginStatus.value)
  const admin = ref(false)
  const isAdmin = computed(() => admin.value)

  const sid = ref(localStorage.getItem('sid'))
  const SSD = computed(() => sid.value)
  const email = ref('')
  const password = ref('')
  const userId = ref(localStorage.getItem('id'))
  const userName = ref(localStorage.getItem('name'))
  const erorField = ref('')

  const router = useRouter()

  if (SSD.value) {
    loginStatus.value = true
  } else {
    loginStatus.value = false
  }

  const message = ref('')

  async function login(em, pass) {
    let usr_email = null
    let usr_password = null

    if (em != '' || pass != '') {
      usr_email = em.trim()
      usr_password = pass.trim()
      email.value = usr_email
      password.value = usr_password
    }
    try {
      const res = await api.login({ email: usr_email, pass: usr_password })
      sid.value = res.data.sid
      userId.value = res.data.id
      localStorage.setItem('id', res.data.id)
      userName.value = res.data.name
      localStorage.setItem('name', res.data.name)
      admin.value = res.data.admin
      localStorage.setItem('admin', res.data.admin)
      message.value = res.data.res

      if (res.data.res === 'ok') {
        loginStatus.value = true
        localStorage.setItem('sid', res.data.sid)
        setTimeout(()=>{
          window.location.reload()
        }, 1)

      }
    } catch (error) {
      message.value = error.response.data.message
      erorField.value = error.response.data.message
      alert(' Neuspesna prijava na nalog !')
    }
  }

  async function logout() {
    try {
      await api.logout({ sid: localStorage.getItem('sid') })
      loginStatus.value = false
      localStorage.removeItem('sid')
      localStorage.removeItem('admin')
      localStorage.removeItem('name')
      localStorage.removeItem('id')
      email.value = ''
      password.value = ''
      admin.value = false
      userId.value = null
      userName.value = null
      router.push("/")
      setTimeout(()=>{
        window.location.reload()
      }, 10)

    } catch (error) {
      message.value = error
    }
  }
  async function validate() {
    try {
      const res = await api.validate({ sid: localStorage.getItem('sid') })
      if (res) {
        loginStatus.value = true
        return true
      } else {
        loginStatus.value = false
        localStorage.removeItem('sid')
        return false
      }
    } catch (error) {
      message.value = error
      if (error.response.data.message === 'not logged in') {
        loginStatus.value = false
        logout()
      }
    }
  }

  function toggle(em, pass) {
    if (localStorage.getItem('sid')) {
      logout()
    } else {
      login(em, pass)
    }
  }
  /*
  async function checkStatus(sid){
    const isIt = await validate(sid)
    if(isIt){ loginStatus.value === true}
    return isIt
  }
*/
  function checkAdmin() {
    //return localStorage.getItem('admin')
    return isAdmin.value
  }

  function checkLogin() {
    //return localStorage.getItem('sid')
    return isLoggedIn
  }

  return {
    loginStatus,
    isLoggedIn,
    isAdmin,
    email,
    password,
    sid,
    userId,
    userName,
    message,
    login,
    logout,
    toggle,
    validate,
    checkAdmin,
    checkLogin,
    SSD,
  }
})
