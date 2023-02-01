<template>
  <nav>
    <!--yo-auto-i18n-ignore-->
    <button class="change-button" @click="changeLanguage('zh')">{{ '改变为中文' }}</button>
     <!--yo-auto-i18n-ignore-->
    <button class="change-button" @click="changeLanguage('ja')">{{ '改变为日语' }}</button>
     <!--yo-auto-i18n-ignore-->
    <button class="change-button" @click="changeLanguage('ko')">{{ '改变为韩语' }}</button>
    <hr/>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <router-view/>
</template>

<script lang="ts" setup>
import { changeLanguage } from './lang/i18n'
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.change-button {
  width: 130px;
  height: 32px;
  margin: 5px;
  border-width: 0px;
  border-radius: 3px;
  background: #1E90FF;
  cursor: pointer;
  outline: none;
  color: white;
  font-size: 14px;
}

.change-button:hover {
  background: #5599FF;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
