<template>
  <div class="app-wrapper">
    <Header />
    <div class="main-container">
      <app-main />
      <Footer />
    </div>
  </div>
</template>

<script>
import { Header, AppMain, Footer } from "./components";

export default {
  name: "Layout",
  components: {
    Header,
    AppMain,
    Footer
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
