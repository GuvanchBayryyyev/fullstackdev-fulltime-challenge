<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/coinlocker.png"> -->
    <div class="header">
      <b-icon id="icon" :color="$store.getters.statusColor" icon="shield-lock" font-scale="7.5"></b-icon>
      <div>
        <p style="padding-top:10px">{{ statusText }}</p>
      </div>
      <div>
        <h3>Welcome to Coin Locker System!</h3>
      </div>
    </div>
    <LockerComponent />
  </div>
</template>

<script>
import LockerComponent from './components/LockerComponent.vue'
import { mapState } from 'vuex'
import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

export default {
  name: 'App', 
  components: {
    LockerComponent
  },
  computed: {
    ...mapState({
      statusText: state => state.statusText,
    })
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}
.header {
  margin-bottom: 20px;
}
</style>
