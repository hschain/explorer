<template>
  <div class="Blocks">test</div>
</template>

<script>
export default {
  name: "BlocksBox",
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
  },
  created() {
    this.getBlocksList()
  },
  methods: {
    getBlocksList() {
      this.$http(this.$api.getBlocksList,{limit: 5}).then(res => {
        console.log(res);
      })
    }
  }
};
</script>

<style lang="scss" scope>
.Blocks {
  padding: 15px 20px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  margin-bottom: 0;
  min-height: 372px;
}
</style>
