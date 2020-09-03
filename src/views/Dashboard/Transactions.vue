<template>
  <div class="Transactions BlockTxBox">
    <div class="titleWrapper">
      <h2 class="title">交易</h2>
      <el-button type="primary" size="small" plain @click="() => $router.push('/transactions')">显示更多</el-button>
    </div>
    <el-table class="containerTable" :data="TransactionsList" stripe style="width: 100%">
      <el-table-column label="交易hash值" width="150">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click="getDetails('TransactionDetails')">{{scope.row.TxHash}}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="类型">
        <template>
          <div>Transfer</div>
        </template>
      </el-table-column>
      <el-table-column label="区块高度" width="100">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click="getDetails('blockDetails')">{{scope.row.Height}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="Time" label="时间" width="80"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "TransactionsBox",
  data() {
    return {
      TransactionsList: [
        {
          TxHash: "60C191 … 023D2E",
          Type: "Transfer",
          Height: 520202,
          Time: "24s ago",
        },
        {
          TxHash: "60C191 … 023D2E",
          Type: "Transfer",
          Height: 520202,
          Time: "24s ago",
        },
        {
          TxHash: "60C191 … 023D2E",
          Type: "Transfer",
          Height: 520202,
          Time: "24s ago",
        },
        {
          TxHash: "60C191 … 023D2E",
          Type: "Transfer",
          Height: 520202,
          Time: "24s ago",
        },
        {
          TxHash: "60C191 … 023D2E",
          Type: "Transfer",
          Height: 520202,
          Time: "24s ago",
        },
      ],
    };
  },
  created() {
    // this.getTransactionsList();
  },
  methods: {
    getTransactionsList() {
      this.$http(this.$api.getTransactionsList, { limit: 5 }).then((res) => {
        
      });
    },
    getDetails(target) {
      this.$router.push('/'+target)
    }
  },
};
</script>

<style lang="scss" scope>
</style>
