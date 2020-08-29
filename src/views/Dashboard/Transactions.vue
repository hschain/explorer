<template>
  <div class="Transactions">test</div>
</template>

<script>
export default {
  name: "TransactionsBox",
  data() {
    return {
      transactionsList: [
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
.Transactions {
  padding: 15px 20px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  margin-bottom: 0;
  min-height: 372px;
}
</style>
