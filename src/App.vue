<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <div class="nav">
      <router-link v-for="(route, index) in routes" :key="index" :to="route.path">{{route.name}} <span class="splitLine">|</span> </router-link>
    </div>
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
      message: 'helloworld',
      routes: []
    }
  },
  created () {
    this.routes = this.$router.options.routes
  },
  mounted () {
    // console.log(this.$router.options.routes)
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
.nav {
  width: 100%;
  height: 60px;
  line-height: 60px;
  background-color: skyblue;
}
.nav a.router-link-exact-active {
  color: #ff0000;
}
.splitLine {
  color: blue;
  margin: 0 5px;
}
.nav a:last-child .splitLine {
  display: none;
}

</style>
