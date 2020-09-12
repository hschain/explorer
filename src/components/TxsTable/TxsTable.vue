<template>
    <el-table v-loading="loading" :data="TransactionsList" stripe style="width: 100%">
      <el-table-column label="交易hash值" width="180">
        <template slot-scope="scope">
          <el-link
            type="primary"
            :underline="false"
            @click="getDetails('transactions', scope.row.tx_hash)"
          >{{scope.row.tx_hash | hash}}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="100">
        <template slot-scope="scope">
          <div>{{scope.row.type}}</div>
        </template>
      </el-table-column>
      <el-table-column label="地址">
        <template slot-scope="scope">
          <div class="TransferAddress">
            <el-link
              type="primary"
              :underline="false"
              @click="getDetails('account', scope.row.messages[0].events.message.sender)"
            >{{scope.row.messages[0].events.message.sender | hash}}</el-link>
            <img
              v-if="scope.row.messages[0].events.transfer"
              class="trans_icon"
              :src="require('@/assets/common/transferarrow_gr.svg')"
              alt
            />
            <el-link
              v-if="scope.row.messages[0].events.transfer"
              type="primary"
              :underline="false"
              @click="getDetails('account', scope.row.messages[0].events.transfer.recipient)"
            >{{scope.row.messages[0].events.transfer.recipient | hash}}</el-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="交易金额" width="120">
        <template slot-scope="scope">
          <div
            v-if="scope.row.messages[0].events.transfer"
          >{{scope.row.messages[0].events.transfer.amount}}</div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column label="交易货币" width="150">
        <template slot-scope="scope">
          <div
            v-if="scope.row.messages[0].events.transfer"
          >{{scope.row.messages[0].events.transfer.denom}}</div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column label="区块高度" width="100">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click="getDetails('Blocks', scope.row.height)">{{scope.row.height}}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="80">
        <template slot-scope="scope">
          <div>{{scope.row.timestamp | time}}</div>
        </template>
      </el-table-column>
    </el-table>
</template>

<script>
import { formatTime } from "@/utils";
export default {
  name: "TxsTable",
  props: {
    txsList: {
      type: Array,
      default() {
        return []
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      TransactionsList: this.$store.state.option.transactionList,
      begin: 0, //区块高度起始信息
    };
  },
  watch: {
    txsList(newVal) {
      this.TransactionsList = newVal;
    },
    size(newVal) {
      this.listQuery.size = newVal;
    },
    page(newVal) {
      this.listQuery.page = newVal;
    },
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
    getDetails(target, detail) {
      this.$router.push({ path: `/${target}/${detail}` });
    },
  },
};
</script>

<style>
</style>