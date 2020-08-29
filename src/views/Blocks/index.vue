<template>
  <div class="BlocksList">
    <div class="titleWrapper">
      <h2 class="pageTitle">BLOCKS</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "Blocks",
  data() {
    return {
      BlocksList: [
        {
          title: "价格",
          value: "421,552",
          lastTime: "Last 7h ago"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scope>
.BlocksList {
  display: flex;
  flex-flow: column;
  justify-content: center;
  width: 1200px;
  margin: 25px auto 0;
  .titleWrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 10px 12px;
    .pageTitle {
      margin: 0;
      font-size: 30px;
      font-weight: 500;
      line-height: 1.23;
      color: #333;
      text-transform: uppercase;
    }
  }
}
</style>
