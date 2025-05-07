<script setup>
import { useRecipe1Store } from '@/stores/recipe'
import { useEditStore } from '@/stores/editRec'
import { ref, computed, useTemplateRef, onMounted } from 'vue'

const store = useRecipe1Store()
const editStore = useEditStore()

const data = ref(null)
const available = computed(() => data.value)

onMounted(async () => {
  editStore.cats()
  editStore.ingAndMeasures()
  await store.getRec(localStorage.getItem('idRec'))
  data.value = store.recipe
  editStore.categorySelected = store.categories
  getSelections()
})

///  //// /// //// // // ////////////////////////////    /////////////////////////

// preselect from original recipe --- ingedients, category  //

const ingrFromSelect = ref([])
const measureFromSelect = ref([])

async function getSelections() {
  // ingredients and measures
  for (let i = 0; i < store.recingmeasure.ingIds.length; i++) {
    ingrFromSelect.value.push(store.recingmeasure.ingIds[i])
    measureFromSelect.value.push(store.recingmeasure.mIds[i])
  }
}

///  // //// /// // / //  //////////////////////////////////////// end  /// ////////

//glavna slika
const file_input_main = useTemplateRef('file-input')
const file_input_korak = useTemplateRef('file-input-korak')

function choseFileMain() {
  file_input_main.value.click()
}
//slike koraka

function choseFileStep(index) {
  editStore.idImg = index
  file_input_korak.value[0].click()
}

function handleHandlers(index, event, ind) {
  editStore.selectHandle(index, event, ind)
}

function handleImageStepHelp(event) {
  editStore.handleImageStep(event)
}

////////////  API : editRec.js  /////////////////////////////////

async function handleClickEdit(reset) {
  if (reset === 'reset') {
    editStore.resetStore()
  } else {
    if (editStore.categorySelected.length === 0) {
      alert(' Morate izabrati kategoriju')
      return
    }
    for (let i = store.recingmeasure.length; i < editStore.sastojci.length; i++) {
      if (
        editStore.sastojci[i].kolicina === null ||
        editStore.sastojci[i].ime === null ||
        editStore.sastojci[i].idM === null
      ) {
        alert('sastojci moraju biti pravilno pounjeni')
        return
      }
    }
    for (let i = store.prepstep.length; i < editStore.koraci.length; i++) {
      if (editStore.koraci[i].text === null) {
        alert('svaki korak mora da sadrzi tekst')
        return
      }
    }
    const response = await editStore.editRec()
    if (response === 'ok') {
      alert(' Uspesno izmenjen recept !')
      editStore.resetStore()
    } else {
      alert(response)
      return
    }
  }
}
</script>

<template>
  <div v-if="available">
    <!-- osnovni podaci o receptu - naziv,opis,slika,broj osoba,vreme pripreme -->
    <div class="category row editFields wmax">
      <div v-for="catr in editStore.category" :key="catr.idDish">
        <input type="checkbox" :value="catr.idDish" v-model="editStore.categorySelected" />

        {{ catr.dishTitle }}
      </div>
    </div>
    {{ editStore.categorySelected }}: check
    <div class="podaci">
      <div class="main">
        <div>
          <span class="titles"> Ime recepta : </span>
          <h1>
            <textarea
              type="text"
              class="editFields"
              v-model="editStore.imeRecepta"
              :placeholder="store.title"
            >
<h1></h1></textarea
            >
          </h1>
        </div>
        <div>
          <span class="titles"> User : {{ store.user }} </span>
        </div>
        <div>
          <span class="titles"> Broj osoba : </span>
          <input
            class="editFields row"
            type="text"
            v-model="editStore.brOsoba"
            :placeholder="store.peopleCount"
          />
        </div>
        <div>
          <span class="titles"> Opis : </span>
          <textarea
            class="editFields row"
            type="text"
            v-model="editStore.opisRecepta"
            :placeholder="store.description"
          ></textarea>
        </div>
        <div>
          <span class="titles"> Vreme pripreme : </span>
          <input
            class="editFields row"
            type="number"
            min="1"
            step="1"
            v-model="editStore.vremePripreme"
            :placeholder="store.prepDuration"
          />
        </div>
      </div>
      <div class="file-upload">
        <div class="file-aria">
          <input ref="file-input" type="file" class="file-input" @change="editStore.handleImage" />
          <button class="animated-text" @click="choseFileMain">Ubaci sliku</button>
          <div id="image">
            <img v-if="editStore.mainImageDisplay" :src="editStore.mainImageDisplay" alt="" />
            <img v-else :src="store.img" alt="" />
          </div>
        </div>
      </div>

      <!-- izbor sastojaka -->
      <div>
        <div class="sastojci" v-for="(sastojak, index) in editStore.sastojci" :key="sastojak.id">
          <input
            id="sas-kolicina"
            class="sastojak editFields"
            type="number"
            min="0"
            step="1"
            :placeholder="store.quantitys[index]"
            v-model="sastojak.kolicina"
            @input="handleHandlers(index, $event.target.value, 2)"
          />
          <select
            @change="handleHandlers(index, $event.target.value, 1)"
            id="sas-mera"
            class="sastojak editFields"
            v-model="measureFromSelect[index]"
          >
            <option disabled value="">-- select some --</option>
            <option v-for="mera in editStore.mere" :key="mera.idM" :value="mera.idM">
              {{ mera.mUnit }} / {{ mera.mTitle }}
            </option>
          </select>
          <select
            @change="handleHandlers(index, $event.target.value, 3)"
            id="sas-naziv"
            class="sastojak editFields"
            v-model="ingrFromSelect[index]"
          >
            <option disabled value="">-- select some --</option>
            <option
              v-for="sas in editStore.sast"
              :key="sas.idIng"
              :value="sas.idIng"
              class="ime-sas"
              :class="{ lenten: sas.ingLenten, vegan: sas.ingVegan, vegetarian: sas.ingVegetarian }"
              :placeholder="store.ingredients"
            >
              {{ sas.ingTitle }}
            </option>
          </select>
          <button @click="editStore.skiniSastojak(sastojak.id)">obrisi</button>
        </div>
        <button class="dodaj" @click="editStore.dodajSastojak">Dodaj sastojak</button>
      </div>

      <!-- kraj izbora sastojaka -->

      <!--   KORACI   -->
    </div>
    <div class="priprema">
      <hr />
      <div>Koraci pripreme</div>
      <div class="stepovi">
        <div class="koraci" v-for="(korak, index) in editStore.koraci" :key="korak">
          <div class="slikaKoraka">
            <div class="file-upload">
              <div class="file-aria">
                <input
                  ref="file-input-korak"
                  type="file"
                  class="file-input-korak"
                  @change="handleImageStepHelp($event)"
                />
                <button class="animated-text" @click="choseFileStep(index)">
                  {{ korak.idImg ? 'Zameni Sliku' : ' Ubaci sliku' }}
                </button>
                <div id="image-korak">
                  <img
                    v-if="editStore.getImageStep(index)"
                    :src="editStore.getImageStep(index)"
                    alt=""
                  />
                  <img v-else :src="store.pushImage(index)" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div class="opisKoraka">
            <div class="naslovKoraka">
              <input
                type="text"
                class="editFields"
                v-model="korak.korakNaslov"
                :placeholder="store.stepTitles[index]"
                @input="store.inpHandle(index, $event.target.value, 1)"
              />
            </div>
            <textarea
              id="opiskoraka"
              rows="8"
              cols="54"
              class="editFields"
              v-model="korak.text"
              :placeholder="store.stepTexts[index]"
              @input="store.inpHandle(index, $event.target.value, 2)"
            ></textarea>
          </div>
          <div>
            <button @click="editStore.skiniKorak(index)">Ukloni</button>
          </div>
        </div>

      </div>
      <button class="dodaj" @click="editStore.dodajKorak">Dodaj Korak</button>
      <div class="finish">
        <button @click="handleClickEdit('reset')">Obrisi sve / reset</button>
        <button @click="handleClickEdit">Posalji Izmene</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dodaj {
  background-color: rgba(160, 133, 99, 0.847);
}
::-webkit-scrollbar {
  width: 5px; /* Širina scrollbara */
  height: 5px; /* Visina scrollbara */
}

::-webkit-scrollbar-track {
  background: transparent; /* Pozadina trake scrollbara */
  margin-right: 10px; /* Odvajanje od desne ivice */
}

::-webkit-scrollbar-thumb {
  background-color: rgb(69, 53, 32);
  border-radius: 10px;
  max-height: 50%;
}
.column {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
}
.row {
  display: flex;
  align-items: center;
}
.editFields,
button {
  font-family: 'candara';
  border: 1px solid rgb(122, 95, 59);
  text-align: center;
  font-size: 1rem;
  border-radius: 0.5rem;
  margin-left: 15px;
  margin-bottom: 5px;
  background-color: rgba(255, 253, 253, 0.385);
}
.wmax {
  padding: 10px;
  gap: 15px;
}
.titles {
  font-family: 'candara';
}
.test-area {
  border: 1px solid rgb(128, 101, 66);
  border-radius: 0.51rem;
  padding: 10px;
  margin: 10px;
}
.prikaz {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  padding: 1rem;
  gap: 1rem;
  border: 1px solid rgb(124, 99, 58);
  border-radius: 1rem;
}

.finish {
  place-self: end;
}
.naslovi {
  font-weight: bolder;
  font-family: 'Candata';
  font-size: larger;
}
.stepovi {
  display: flex;
  flex-direction: column;
}
.koraci {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border: 1px dashed gainsboro;
  border-radius: 1rem;
  margin: 0.5rem 0;
}
.opisKoraka {
  display: flex;
  flex-direction: column;
  align-items: center;
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
.RecTemplate {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70vw;
  height: fit-content;
  max-height: 70vh;
  padding: 20px;
  margin: 10px;
  background-color: rgba(240, 248, 255, 0.069);
  border: 3px solid rgba(126, 109, 63, 0.624);
  border-radius: 1rem;
  overflow-y: scroll;
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
</style>
