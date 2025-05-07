<script setup>
import { ref, onMounted, computed } from 'vue'
import gsap from 'gsap'

const modal = ref()
const body = ref()
const prop = defineProps(['buttonName', 'callNumber', 'message', 'login'])
const emit = defineEmits(['close-popup'])

const buttonName = computed(() => prop.buttonName)
const callNumber = computed(() => prop.callNumber)
const message = computed(() => prop.message)
//const login = computed(() => prop.login) /// dodato

function close(value) {
  emit('close-popup', value)
}

onMounted(() => {
  gsap.from(modal.value, {
    duration: 0.3,
    y: -400,
    opacity: 1,
    ease: 'ease',
  })
})
</script>

<template>
  <div class="popup" ref="body">
    <div class="body" ref="modal">
      <div class="header">
        <slot name="header"></slot>
      </div>
      <div class="content">
        <slot name="content"></slot>
      </div>
      <div class="footer">
        <slot name="footer"></slot>
      </div>
      <button class="close maloDugme" @click="close(0)">x</button>
      <div class="answer" v-if="!message">
        <button class="confirm maloDugme" @click="close(callNumber[0])">{{ buttonName[0] }}</button>
        <button v-if="buttonName.length > 1" class="cancel maloDugme" @click="close(callNumber[1])">
          {{ buttonName[1] }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.267);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 99;
}
.body {
  position: relative;
  width: 350px;
  height: 210px;
  background-color: rgba(204, 200, 195, 0.877);
  border-radius: 1rem;
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.091);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 20px;
  z-index: 99;
}
.close {
  position: absolute;
  top: 10%;
  right: 5%;
  padding: 1% 3%;
  background-color: var(--sivkasta);
  z-index: 999;
}
.answer {
  width: 100%;
  position: absolute;
  bottom: 10%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  z-index: 999;
}
.confirm {
  z-index: 999;
}
.cancel {
  z-index: 999;
}
.header {
  font-weight: bolder;
  font-size: larger;
  z-index: 99;
  margin-bottom: 0.5rem;
}

.footer {
  position: absolute;
  bottom: 25%;
  left: 40%;
  z-index: 99;
}
@media (max-width: 400px) {
  .body {
    width: 95%;
    z-index: 99;
  }
}
</style>
