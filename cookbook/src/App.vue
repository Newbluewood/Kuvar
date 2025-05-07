<script setup>
import { RouterView } from 'vue-router'
import HeaderView from './views/partials/HeaderView.vue'
import SearchView from './views/partials/SearchView.vue'
import SocialsView from './views/partials/SocialsView.vue'
import FooterView from './views/partials/FooterView.vue'
</script>

<template>
  <div class="wrapper App">
    <main>
      <div class="content">
        <HeaderView />
        <SearchView />

        <RouterView />

        <SocialsView />
        <FooterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
.App {
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
}
.body,
.wrapper {
  background-image: url(/public/background_hr_0.png);
  position: fixed;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
