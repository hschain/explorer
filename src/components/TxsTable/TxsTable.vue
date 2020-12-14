<template>
  <el-table v-loading="loading" :data="TransactionsList" stripe style="width: 100%">
    <el-table-column :label="$t('transactions.transactionsHash')" width="180">
      <template slot-scope="scope">
        <el-link
          type="primary"
          :underline="false"
          @click="getDetails('transactions', scope.row.tx_hash)"
        >{{scope.row.tx_hash | hash}}</el-link>
      </template>
    </el-table-column>
    <el-table-column :label="$t('transactions.transactionsType')" width="80">
      <template slot-scope="scope">
        <div>{{scope.row.type}}</div>
      </template>
    </el-table-column>
    <el-table-column :label="$t('transactions.transactionsStatus')" width="90">
      <template slot-scope="scope">
        <div>
          <img
            v-if="scope.row.messages[0].success"
            :src="require('@/assets/common/success_ic.svg')"
            alt
          />
          <img v-else :src="require('@/assets/common/fail_ic.svg')" alt />
          <span>{{scope.row.messages[0].success ? $t('status.success') : $t('status.fail')}}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column :label="$t('transactions.transactionsAddress')">
      <template slot-scope="scope">
        <div class="TransferAddress">
          <div v-if="scope.row.messages[0].success">
            <span
              v-if="scope.row.messages[0].events.message.sender === $route.params.data"
            >{{scope.row.messages[0].events.message.sender | hash}}</span>
            <el-link
              v-else
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
            <span
              v-if="scope.row.messages[0].events.transfer && scope.row.messages[0].events.transfer.recipient === $route.params.data"
            >{{scope.row.messages[0].events.transfer.recipient | hash}}</span>
            <el-link
              v-else-if="scope.row.messages[0].events.transfer"
              type="primary"
              :underline="false"
              @click="getDetails('account', scope.row.messages[0].events.transfer.recipient)"
            >{{scope.row.messages[0].events.transfer.recipient | hash}}</el-link>
          </div>
          <div v-else>-</div>
        </div>
      </template>
    </el-table-column>
    <el-table-column :label="$t('transactions.transactionsValue')" width="120">
      <template slot-scope="scope">
        <div
          v-if="scope.row.messages[0].events.transfer && scope.row.messages[0].success"
        >{{scope.row.messages[0].events.transfer.amount}}</div>
        <div v-else>-</div>
      </template>
    </el-table-column>
    <el-table-column :label="$t('transactions.transactionsCurrency')" width="100">
      <template slot-scope="scope">
        <div
          v-if="scope.row.messages[0].events.transfer && scope.row.messages[0].success"
        >{{scope.row.messages[0].events.transfer.denom}}</div>
        <div v-else>-</div>
      </template>
    </el-table-column>
    <el-table-column :label="$t('transactions.blocksHeight')" width="120">
      <template slot-scope="scope">
        <el-link
          v-if="scope.row.height !== $route.params.data"
          type="primary"
          :underline="false"
          @click="getDetails('Blocks', scope.row.height)"
        >{{scope.row.height}}</el-link>
        <span v-else>{{scope.row.height}}</span>
      </template>
    </el-table-column>
    <el-table-column :label="$t('transactions.time')" width="100">
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
        return [];
      },
    },
    loading: {
      type: Boolean,
      default: false,
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
