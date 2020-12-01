<template>
  <div id="app">
    <Layout />
  </div>
</template>

<script>
import jump from "@/jump/index";
import Layout from "@/layout/index";

export default {
  name: "App",
  components: {
    jump,
    Layout
  },
};
</script>
