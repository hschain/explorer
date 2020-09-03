<template>
  <div class="AccountDetails containerWrap">
    <div class="titleWrapper">
      <h2 class="pageTitle">
        账户详情
      </h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "AccountDetails",
  data() {
    return {
    };
  },
  methods: {
    //获取列表
    getAccountDetails() {},
  },
};
</script>

<style lang="scss" scope>
.AccountDetails {
  .titleWrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .pageTitle {
      .height {
        font-size: 22px;
      }
    }
  }
}
</style>
