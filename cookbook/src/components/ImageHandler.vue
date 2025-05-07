<script setup>
import api from '../../api'
import { watch, computed, useTemplateRef } from 'vue'

const props = defineProps(['image'])
const emit = defineEmits(['image-id'])

/////////////////////////////////////////////////////////////////////////////////////////////////////
//////   Input Image File  ///////////////

//fotografija

const ImageFile = computed(() => props.image) // image file
const ImgDisplayUpload = computed(() => ImageFile.value && URL.createObjectURL(ImageFile.value)) // url for <img src=""> from input
const ImgDisplayResponse = computed(() => ImageFile.value && imgFromString(ImageFile.value)) // url for <img src=""> from database

function getImage(src) {
  if (src === 0) {
    return ImgDisplayResponse.value
  } else {
    return ImgDisplayUpload.value
  }
}

// file upload hendler
const file_input_image = useTemplateRef('file-input')

function choseFileStep() {
  file_input_image.value[0].click()
}

function handleImage(e) {
  ImageFile.value = e.target.files[0]
}

watch(ImageFile, (novaVrednost, staraVrednost) => {
  if (novaVrednost !== staraVrednost) {
    ImageUpload(novaVrednost)
  }
})
//--

////////////////////////////////////////////////////////////////////////////////////////////////////
///////   f  Image url from String   ///////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// API - Image Upload ///////////////////

async function ImageUpload(file, sid) {
  try {
    // slanje slika za upis u bazu :
    // file = Image file => upisivanje u bazu. dobijanje ID gde je upisana u bazi
    // file = null => dobijanje ID gde je upisana u bazi

    const response = await api.imgHandle({ image: file, sid: sid })
    const imageId = response.data.idImg
    emit('image-Id', imageId)
  } catch (error) {
    console.log('error:', error)
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
</script>

<template>
  <div class="Template">
    <div class="images-handler">
      <div class="file-upload">
        <div class="file-aria">
          <input
            ref="file-input-korak"
            type="file"
            class="file-input-korak"
            @change="handleImage($event)"
          />
          <button class="animated-text" @click="choseFileStep()">
            {{ korak.idImg ? 'Zameni Sliku' : ' Ubaci sliku' }}
          </button>
          <div id="image-korak">
            <img v-if="editStore.getImage(1)" :src="getImage(1)" alt="" />
            <img v-else :src="getImage(0)" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.images-handler {
  width: 400px;
  height: 200px;
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
.wmax {
  width: 90%;
  padding: 10px;
  gap: 15px;
}
.titles {
  font-family: 'candara';
}

.Template {
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
