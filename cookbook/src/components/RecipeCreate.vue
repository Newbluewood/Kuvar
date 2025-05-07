<script setup>
import { ref, onMounted, useTemplateRef } from 'vue'
import { useCreateStore } from '@/stores/createRec'

const store = useCreateStore()

onMounted(() => {
  store.cats()
  store.ingAndMeasures()
})
const file_input_main = useTemplateRef('file-input')
const file_input_korak = useTemplateRef('file-input-korak')

function choseFileMain() {
  file_input_main.value.click()
}

function choseFileStep(index) {
  store.idImg = index
  file_input_korak.value[0].click()
}

function handleHandlers(index, event, ind) {
  store.selectHandle(index, event, ind)
}
const catSelect = ref(true)

async function sendRec(type) {
  if (type === 'clean') {
    store.resetStore()
  } else {
    if (store.categorySelected.length === 0) {
      alert(' Morate izabrati neku kategoriju')
      return
    }
    if (store.mainImageDisplay === null) {
      alert('Trebalo bi da stavite neku glavnu Sliku recepta')
      return
    }
    if (store.imeRecepta === null) {
      alert('Trebalo bi da date neko ime Vasem receptu !')
      return
    }
    if (store.opisRecepta === null) {
      alert('Trebalo bi da date neki lep opis !')
      return
    }
    for (let i = 0; i < store.sastojci.length; i++) {
      console.log(store.sastojci[i])
      if (
        store.sastojci[i].kolicina === null ||
        store.sastojci[i].idM === null ||
        store.sastojci[i].id === null
      ) {
        alert('sastojci moraju biti pravilno pounjeni')
        return
      }
    }
    for (let i = 0; i < store.koraci.length; i++) {
      if (store.koraci[i].text === null || store.koraci[i].text === '') {
        alert('svaki korak mora da sadrzi tekst')
        return
      }
    }
    const response = await store.sendRec()
    if (response === 'ok') {
      alert('Vas recept je sacuvan !')
      store.resetStore()
    } else {
      alert(response)
      return
    }
  }
}

</script>

<template>
  <div class="card-container">
    <div class="naslov">Kategorije jela ( izaberi )</div>
    <!--<button class="maloDugme" @click="catSelect = !catSelect">{{ catSelect ? 'Sakrij kategorije jela' : 'Prikaži kategorije jela' }}</button>-->
    <div v-if="catSelect" class="category card-container wrap center">
        <div v-for="cat in store.category" :key="cat">
          <div class="check_button p_rel" :class="{ tagged: store.categorySelected.includes(cat.idDish) }"> {{ cat.dishTitle }}
            <input class="p_abs" type="checkbox" :value="cat.idDish" v-model="store.categorySelected" />
          </div>
        </div>
    </div>
    <div class="RecTemplate">
      <h1 class="velikiNaslov">Tvoj recept</h1>
      <!-- osnovni podaci o receptu - naziv,opis,slika,broj osoba,vreme pripreme -->
      <div class="podaci wrap center">
        <div class="main align">
          <div><input class="naslov" type="text" placeholder="Naziv recepta" v-model="store.imeRecepta" /></div>
          <div>
            Za koliko osoba:
            <input
              type="number"
              placeholder="Broj osoba za koje je recept predviđen"
              v-model="store.brOsoba"
              step="1"
              min="0"
            />
          </div>
          <textarea
            class="align"
            id="opisrec"
            rows="6"
            cols="54"
            placeholder="Opis recepta"
            v-model="store.opisRecepta"
          >
          </textarea>
          <div>
            Vreme pripreme:
            <input
              type="number"
              placeholder="Vreme potrebno za pripremu u minutima"
              step="5"
              min="0"
              v-model="store.vremePripreme"
            />
          </div>
        </div>
        <div class="file-upload">
          <div class="file-aria">
            <input ref="file-input" type="file" class="file-input" @change="store.handleImage" />
            <button class="maloDugme" @click="choseFileMain">Ubaci sliku</button>
            <div id="image">
              <img :src="store.mainImageDisplay" alt="" />
            </div>
          </div>
        </div>
        <!-- izbor sastojaka -->
        <div class="flex column wrap center align">
          <div>Sastojci : </div>
          <div class="sastojci" v-for="(sastojak, index) in store.sastojci" :key="sastojak.id">
            <input
              id="sas-kolicina"
              class="sastojak"
              type="number"
              min="0"
              step="1"
              placeholder="Kolicina.."
              v-model="sastojak.kolicina"
              @input="handleHandlers(index, $event.target.value, 2)"
            />
            <select
              @change="handleHandlers(index, $event.target.value, 1)"
              id="sas-mera"
              class="sastojak"
              v-model="sastojak.idM"
              placeholder="Placeholder"
            >
              <option disabled value="">-- Odaberi --</option>
              <option v-for="mera in store.mere" :key="mera.idM" :value="mera.idM">
                {{ mera.mUnit }} / {{ mera.mTitle }}
              </option>
            </select>
            <select
              @change="handleHandlers(index, $event.target.value, 3)"
              id="sas-naziv"
              class="sastojak"
              v-model="sastojak.id"
            >
              <option disabled value="">-- Odaberi --</option>
              <option
                v-for="sas in store.sast"
                :key="sas.idIng"
                :value="sas.idIng"
                class="ime-sas"
                :class="{
                  lenten: sas.ingLenten,
                  vegan: sas.ingVegan,
                  vegetarian: sas.ingVegetarian,
                }"
              >
                {{ sas.ingTitle }}
              </option>
            </select>
            <button class="action-button" @click="store.skiniSastojak(index)">✘</button>
          </div>
          <button class="action-button" @click="store.dodajSastojak">✙</button>
        </div>


        <!-- kraj izbora sastojaka -->
      </div>

      <!--  Koraci -->
      <div class="priprema">
        <hr />
        <div class="naslov">Koraci pripreme</div>
        <div class="stepovi center">
          <div class="koraci wrap center" v-for="(korak, index) in store.koraci" :key="korak">
            <div class="slikaKoraka">
              <div class="file-upload">
                <div class="file-aria">
                  <input
                    ref="file-input-korak"
                    type="file"
                    class="file-input-korak"
                    @change="store.handleImageStep($event)"
                  />
                  <button class="maloDugme" @click="choseFileStep(index)">
                    {{ korak.idImg ? 'Zameni Sliku' : ' Ubaci sliku' }}
                  </button>
                  <div id="image-korak">
                    <img :src="store.getImageStep(index)" alt="" />
                  </div>
                </div>
              </div>
            </div>
            <div class="opisKoraka">
              <div class="naslovKoraka">
                <input
                  class="align"
                  type="text"
                  v-model="korak.korakNaslov"
                  @input="store.inpHandle(index, $event.target.value, 1)"
                  placeholder="Naslov koraka u pripremi"
                />
              </div>
              <textarea
                class="align"
                id="opiskoraka"
                rows="8"
                cols="54"
                placeholder="Opis koraka u pripremi"
                @input="store.inpHandle(index, $event.target.value, 2)"
              ></textarea>
            </div>

            <button class="action-button" @click="store.skiniKorak(index)">✘</button>

          </div>
          <button class="maloDugme" @click="store.dodajKorak">Dodaj korak</button>
        </div>
        <div class="finish">
          <button class="maloDugme" @click="store.resetStore">Reset</button>
          <button class="maloDugme" @click="sendRec">Sacuvaj recept</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.align{
  max-width: 90%;
}
.flex{
display: flex;
}
.column{
  flex-direction: column;
}
.wrap{
  flex-wrap: wrap;
}
.center{
  justify-content: center;
  align-items: center;
}
.naslov{
 font-size: 18px;
}
.p_rel{
  position: relative;
}
.p_abs{
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}
.check_button{
  border: 1px solid rgb(140, 110, 70);
  border-radius: 5px;
  margin: 2px;
  padding: 0 3px;
  cursor: pointer;
}
.check_button:hover{
  border-color: rgb(248, 242, 233);
}
.tagged{
  background-color: rgba(251, 249, 246, 0.591);
}
.category {
  display: flex;
}
.ime-sas {
  color: rgb(122, 29, 0);
}
.ime-sas.lenten {
  color: aquamarine;
}
.ime-sas.vegan {
  color: rgb(60, 211, 214);
}
.ime-sas.vegetarian {
  color: rgb(10, 94, 0);
}
.finish {
  place-self: end;
}
.naslovi {
  font-weight: bolder;
}
.stepovi {
  display: flex;
  flex-direction: column;
}
.koraci {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem 0;
}
option,
select {
  margin: 0;
  padding: 0;
}
select {
  height: 100%;
  font-size: 1rem;
}

#sas-kolicina {
  width: 90px;
}
.podaci {
  display: flex;
}
.priprema {
  margin-top: 1rem;
}
textarea {
  border-color: rgb(74, 138, 116);
}
.file-upload {
  margin: 1rem;
  background-color: rgba(240, 248, 255, 0.069);
  border: 2px dashed rgb(143, 145, 145);
  border-radius: 1rem;
  height: fit-content;
}
.file-input,
.file-input-korak {
  display: none;
}
.file-aria {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
}
#image {
  width: 250px;
  height: auto;
  min-height: 250px;
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
#image-korak {
  width: 150px;
  height: auto;
  min-height: 150px;
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
  height: auto;
  width: 100%;
}
input,
select {
  padding-left: 10px;
  margin: 0.3rem 0;
  width: 100%;
  background-color: rgba(245, 245, 245, 0.611);
  border: 2px solid rgba(157, 121, 74, 0.775);
  border-radius: 0.5rem;
  color: rgb(65, 45, 21);
}
textarea {
  border-radius: 0.5rem;
}
</style>
