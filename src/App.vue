<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    {{message}}
    <input v-model="message" />
    <button @click="changeMessage">改变</button>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      message: 'helloworld'
    }
  },
  methods: {
    changeMessage () {
      this.message === 'helloworld' ? this.message = '你好' : this.message = 'helloworld'
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
