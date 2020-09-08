<template>
  <div class="TransactionsList containerWrap">
    <div class="titleWrapper">
      <h2 class="pageTitle">交易</h2>
    </div>
    <div class="table">
      <el-table :data="TransactionsList" stripe style="width: 100%">
        <el-table-column label="交易hash值" width="180">
          <template slot-scope="scope">
            <el-link
              type="primary"
              :underline="false"
              @click="getDetails(scope.row.tx_hash)"
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
              >{{scope.row.messages[0].events.transfer.recipient | hash}}</el-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="交易金额" width="120">
          <template slot-scope="scope">
            <div
              v-if="scope.row.messages[0].events.transfer"
            >{{scope.row.messages[0].events.transfer.amount}}.</div>
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
            <el-link type="info" :underline="false">{{scope.row.height}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="时间" width="80">
          <template slot-scope="scope">
            <div>{{scope.row.timestamp | time}}</div>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.size"
        @pagination="TransactionsList"
      />
    </div>
  </div>
</template>

<script>
import { formatTime } from "@/utils";
import { setTxsType } from "@/utils/common";
import Pagination from "@/components/Pagination/Pagination";
export default {
  name: "Transactions",
  components: {
    Pagination,
  },
  data() {
    return {
      TransactionsList: [],
      listQuery: {
        page: 1,
        size: 20,
      },
      total: 0,
      begin: 0, //区块高度起始信息
    };
  },
  created() {
    this.getTransactionsList();
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
      let params = {
        limit: this.listQuery.size,
      };
      if (this.listQuery.page !== 1) {
        params.begin =
          this.begin - (this.listQuery.page - 1) * this.listQuery.size;
      }
      this.$http(this.$api.getTransactionsList, params).then((res) => {
        if (res.code === 200) {
          this.TransactionsList = res.data;
          this.TransactionsList.forEach((item, i) => {
            item.type = setTxsType(res.data[i].messages[0].events.message.action)
          });
          this.total = res.paging.total;
          if (this.listQuery.page === 1) {
            this.begin = res.paging.begin;
          }
        }
      });
    },
    getDetails(item) {
      this.$router.push({ path: `/transactions/${item}` });
    },
  },
};
</script>

<style lang="scss" scope>
</style>
