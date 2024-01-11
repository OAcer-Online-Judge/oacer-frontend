<template>
  <div class="home">
    <MdEditor :value="value" :handle-change="handleChange" />
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import HelloWorld from "@/components/HelloWorld.vue";
import MdEditor from "@/components/MdEditor.vue"; // @ is an alias to /src

const value = ref();
const handleChange = (v: string) => {
  value.value = v;
};
</script>
