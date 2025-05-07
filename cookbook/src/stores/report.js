import { defineStore } from 'pinia'
import api from '../../api'

export const useReportStore = defineStore('report', () => {
  async function reportRecipe(sid, id) {
    try {
      await api.reportRec({ sid: sid, idRec: id })
    } catch (error) {
      console.log('error: ', error)
      console.log('res error: ', error.response.data.message)
    }
  }
  async function reportUsr(id) {
    try {
      await api.reportUser({ idUsr: id })
    } catch (error) {
      console.log('error: ', error)
      console.log('res error: ', error.response.data.message)
    }
  }

  async function endReport(id) {
    try {
      await api.deleteReport({ idRep: id, sid: localStorage.getItem('sid') })
    } catch (error) {
      console.log('error: ', error)
      console.log('res error: ', error.response.data.message)
    }
  }

  return {
    reportRecipe,
    reportUsr,
    endReport,
  }
})
