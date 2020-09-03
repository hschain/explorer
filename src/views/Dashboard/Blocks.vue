<template>
  <div class="Blocks BlockTxBox">
    <div class="titleWrapper">
      <h2 class="title">区块链</h2>
      <el-button type="primary" size="small" plain @click="() => $router.push('/blocks')">显示更多</el-button>
    </div>
    <el-table class="containerTable" :data="BlocksList" stripe style="width: 100%">
      <el-table-column label="区块高度" width="100">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click="getDetails">{{scope.row.Height}}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="区块hash值">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click="getDetails">{{scope.row.BlockHash}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="Txs" label="交易信息" width="80"></el-table-column>
      <el-table-column prop="Time" label="时间" width="80"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "BlocksBox",
  data() {
    return {
      BlocksList: [
        {
          Height: 537821,
          BlockHash: "60C191 … 023D2E",
          Txs: 0,
          Time: "24s ago",
        },
        {
          Height: 537821,
          BlockHash: "60C191 … 023D2E",
          Txs: 0,
          Time: "5s ago",
        },
        {
          Height: 537821,
          BlockHash: "60C191 … 023D2E",
          Txs: 0,
          Time: "5s ago",
        },
        {
          Height: 537821,
          BlockHash: "60C191 … 023D2E",
          Txs: 0,
          Time: "5s ago",
        },
        {
          Height: 537821,
          BlockHash: "60C191 … 023D2E",
          Txs: 0,
          Time: "5s ago",
        },
      ],
    };
  },
  created() {
    this.getBlocksList();
  },
  methods: {
    getBlocksList() {
      this.$http(this.$api.getBlocksList, { limit: 5 }).then((res) => {
        
      });
    },
    getDetails() {
      this.$router.push('/blockDetails')
    }
  },
};
</script>

<style lang="scss" scope>
</style>
