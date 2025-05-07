import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../../api'

export const useAuthStore = defineStore('auth', () => {
  const message = ref()
  const showMessage = computed(() => message.value)

  const resp = ref()
  const response = computed(() => resp.value)
  const erorField = ref('')

  ///// REGISTER API /////

  async function register(nam, em, pas) {
    const usr_name = nam.trim()
    const usr_email = em.trim()
    const usr_password = pas.trim()
    try {
      const res = await api.register({
        name: usr_name,
        email: usr_email,
        pass: usr_password,
      })

      ;(response.value = res.data), (message.value = 'Uspesna Registracija ')
      if (res.data.res === 'ok') {
        alert('uspesno ste se registrovali !')
        resp.value = true
      }
    } catch (err) {
      if (err.response.data.message) {
        switch (err.response.data.message) {
          case 'Invalid username':
            erorField.value = 'name'
            message.value = 'Required Field !'
            break
          case 'Invalid email':
            erorField.value = 'e-mail'
            message.value = ' Not valid e-mail form'
            break
          case 'Email exists':
            erorField.value = 'e-mail'
            message.value = ' Email exists'
            break
          case 'Invalid password':
            erorField.value = 'password'
            message.value = 'Required Field !'
            break
          default:
            erorField.value = ''
            message.value = ''
            break
        }
      } else {
        message.value = err
      }
    }
  }

  return {
    showMessage,
    response,
    message,
    erorField,
    register,
  }
})
