<template>
  <el-card shadow="hover" class="Transactions BlockTxBox">
    <div class="titleWrapper">
      <h2 class="title">交易</h2>
      <el-button type="primary" size="small" plain @click="() => $router.push('/transactions')">显示更多</el-button>
    </div>
    <el-table class="containerTable" :data="TransactionsList" stripe style="width: 100%">
      <el-table-column label="交易Hash" width="180">
        <template slot-scope="scope">
          <el-link
            type="primary"
            :underline="false"
            @click="getDetails('Transactions', scope.row.tx_hash)"
          >{{scope.row.tx_hash | hash}}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="交易类型">
        <template slot-scope="scope">
          <div>{{scope.row.type}}</div>
        </template>
      </el-table-column>
      <el-table-column label="区块高度" width="100">
        <template slot-scope="scope">
          <el-link
            type="primary"
            :underline="false"
            @click="getDetails('blocks', scope.row.height)"
          >{{scope.row.height}}</el-link>
        </template>
      </el-table-column>
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
import { setTxsType, setDelayTimer } from "@/utils/common";
export default {
  name: "TransactionsBox",
  data() {
    return {
      TransactionsList: [],
      timer: null,
      update: true
    };
  },
  created() {
    this.getTransactionsList();
    // this.timer = setInterval(() => {
    //   this.getTransactionsList();
    // }, 1000);
  },
  beforeDestroy() {
    // clearInterval(this.timer)
    this.update = false
  },
  filters: {
    hash: function (value) {
      return value.slice(0, 6) + " … " + value.slice(-6);
    },
    time: function (value) {
      return formatTime(value);
    },
  },
  methods: {
    getTransactionsList() {
      this.$http(this.$api.getTransactionsList, { limit: 5 }).then((res) => {
        if (res.code === 200 && res.data) {
          this.TransactionsList = res.data;
          this.TransactionsList.forEach((item, i) => {
            item.type = setTxsType(res.data[i].messages[0].events.message.action)
          });
          this.$emit('sendTransferValue', res.paging.begin)
        }
      }).finally(() => {
        if (this.update) {
          setTimeout(() => {
            this.getTransactionsList()
          }, setDelayTimer);
        }
      })
    },
    getDetails(target, detail) {
      this.$router.push({ path: `/${target}/${detail}` });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
