<template>
  <div class="TransactionsList containerWrap">
    <div class="titleWrapper">
      <h2 class="pageTitle">交易</h2>
    </div>
    <div class="table">
      <TxsTable :loading="loading" :txsList="TransactionsList" />
      <Pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.size"
        @pagination="getTransactionsList"
      />
    </div>
  </div>
</template>

<script>
import { setTxsType } from "@/utils/common";
import TxsTable from "@/components/TxsTable/TxsTable";
import Pagination from "@/components/Pagination/Pagination";
export default {
  name: "Transactions",
  components: {
    Pagination,
    TxsTable
  },
  data() {
    return {
      TransactionsList: [],
      listQuery: {
        page: 1,
        size: 20
      },
      loading: true,
      total: 0,
      begin: 0 //区块高度起始信息
    };
  },
  created() {
    this.getTransactionsList();
  },
  methods: {
    getTransactionsList() {
      let params = {
        limit: this.listQuery.size
      };
      if (this.listQuery.page !== 1) {
        params.begin =
          this.begin - (this.listQuery.page - 1) * this.listQuery.size;
      }
      this.$http(this.$api.getTransactionsList, params).then(res => {
        if (res.code === 200) {
          this.TransactionsList = res.data;
          this.TransactionsList.forEach((item, i) => {
            item.type = setTxsType(
              res.data[i].messages[0].events.message.action
            );
          });
          this.total = res.paging.total;
          if (this.listQuery.page === 1) {
            this.begin = res.paging.begin;
          }
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
};
</script>

<style lang="scss" scope></style>
