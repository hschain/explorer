<template>
  <el-card shadow="hover" class="Blocks BlockTxBox">
    <div class="titleWrapper">
      <h2 class="title">区块</h2>
      <el-button type="primary" size="small" plain @click="() => $router.push('/blocks')">显示更多</el-button>
    </div>
    <el-table class="containerTable" :data="BlocksList" stripe style="width: 100%">
      <el-table-column label="区块高度" width="100">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click="getDetails(scope.row.height)">{{scope.row.height}}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="区块奖励">
        <template slot-scope="scope">
          <div>{{ scope.row.amount}} {{scope.row.denom}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="num_txs" label="交易数量" width="80"></el-table-column>
      <el-table-column label="时间" width="80">
        <template slot-scope="scope">
          <div>{{scope.row.timestamp | time}}</div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { formatTime } from "@/utils";
export default {
  name: "BlocksBox",
  data() {
    return {
      BlocksList: [],
      timer: null,
      update: true
    };
  },
  created() {
    this.getBlocksList();
    // this.timer = setInterval(() => {
    //   this.getBlocksList();
    // }, 5000);
  },
  beforeDestroy() {
    // clearInterval(this.timer)
    this.update = false
  },
  filters: {
    hash: function (value) {
      return value.slice(0, 6) + ' … ' + value.slice(-6)
    },
    time: function (value) {
      return formatTime(value)
    },
  },
  methods: {
    getBlocksList() {
      //document.documentElement.scrollHeight
      this.$http(this.$api.getBlocksList, { limit: 5 }).then((res) => {
        if (res.code === 200) {
          this.BlocksList = res.data
          this.BlocksList.forEach(item => {
            if (/^u/i.test(item.denom)) {
              item.amount = (item.amount/1000000).toFixed(2)
              item.denom = item.denom.slice(1).toUpperCase()
            }
          })
          this.$emit('sendHeightValue', res.paging.begin)
        }
      }).finally(() => {
        if (this.update) {
          this.getBlocksList()
        }
      })
    },
    getDetails(item) {
      this.$router.push({ path: `/blocks/${item}` })
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
