<template>
  <div class="TransactionsList containerWrap">
    <el-backtop class="backtop" :right="20" style="bottom: 25vh">
      <img src="@/assets/common/top.png" alt="">
      <p>顶部</p>
    </el-backtop>
    <div class="titleWrapper">
      <h2 class="pageTitle">交易</h2>
    </div>
    <el-card shadow="never" class="table">
      <div class="updateCheckbox">
        <el-checkbox v-model="update" @change="handleCheckedChange">实时更新</el-checkbox>
      </div>
      <TxsTable :loading="loading" :txsList="TransactionsList" :showCheckbox="true" @handleCheckedChange="handleCheckedChange" />
      <Pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.size"
        @pagination="pagination"
      />
    </el-card>
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
      timer: null,
      update: true,
      stopLastRequest: false,
    };
  },
  created() {
    this.getTransactionsList();
    // this.timer = setInterval(() => {
    //   this.getTransactionsList();      
    // }, 5000);
  },
  beforeDestroy() {
    // clearInterval(this.timer)
    this.update = false
  },
  methods: {
    getTransactionsList() {
      let params = {
        limit: this.listQuery.size
      };
      if (this.listQuery.page !== 1) {
        params.begin =
          this.total - (this.listQuery.page - 1) * this.listQuery.size;
      }
      this.$http(this.$api.getTransactionsList, params).then(res => {
        if (res.code === 200 && res.data) {
          this.TransactionsList = res.data;
          this.TransactionsList.forEach((item, i) => {
            if (item.messages[0].success && /^u/i.test(item.messages[0].events.transfer.denom)) {
              item.messages[0].events.transfer.denom = item.messages[0].events.transfer.denom.slice(1).toUpperCase()
              item.messages[0].events.transfer.amount = (item.messages[0].events.transfer.amount/1000000).toFixed(6)
            }
            item.type = setTxsType(
              res.data[i].messages[0].events.message.action
            );
          });
          this.total = res.paging.total;
        } else {
          this.TransactionsList = []
        }
      }).finally(() => {
        this.loading = false
        if (this.update && !this.stopLastRequest) {
          setTimeout(() => {
            this.getTransactionsList()
          }, 300);
        } else {
          this.stopLastRequest = false
        }
      })
    },
    handleCheckedChange(val) {
      if (val) {
        this.getTransactionsList();
        // this.timer = setInterval(() => {
        //   this.getTransactionsList();
        // }, 3000);
      } else {
        // clearInterval(this.timer)
      }
      this.update = val
    },
    pagination(val) {
      this.listQuery = {
        page: val.page,
        size: val.limit
      }
      this.stopLastRequest = true
      this.getTransactionsList()
    }
  }
};
</script>

<style lang="scss" scope></style>
