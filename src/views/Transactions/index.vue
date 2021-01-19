<template>
  <div class="TransactionsList containerWrap">
    <el-backtop class="backtop" :right="20" style="bottom: 25vh">
      <img src="@/assets/common/top.png" alt="">
      <p>{{ $t('transactions.top') }}</p>
    </el-backtop>
    <div class="titleWrapper">
      <h2 class="pageTitle">{{ $t('transactions.title') }}</h2>
    </div>
    <el-card shadow="never" class="table">
      <div class="updateCheckbox">
        <!-- 小分页组件 -->
        <small-pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.size"
        @pagination="pagination"></small-pagination>
        <el-checkbox v-model="update" @change="handleCheckedChange">{{ $t('transactions.liveUpdate') }}</el-checkbox>
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
import { setTxsType, setDelayTimer } from "@/utils/common";
import TxsTable from "@/components/TxsTable/TxsTable";
import Pagination from "@/components/Pagination/Pagination";
import smallPagination from "@/components/smallPagination/smallPagination";

export default {
  name: "Transactions",
  components: {
    Pagination,
    TxsTable,
    smallPagination
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
      end: 0, // 第一页的最后一条
      timer: null,
      update: true,
      stopLastRequest: false
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
        page: this.listQuery.page,
        limit: this.listQuery.size
      };
      // if (this.listQuery.page !== 1) {
      //   params.begin = this.end - (this.listQuery.page - 2) * this.listQuery.size - 1;
      // }
      this.$http(this.$api.getTransactionsList, params).then(res => {
        if (res.code === 200 && res.data) {
          // console.log(this.listQuery.page)
          if(this.listQuery.page == 1){
            this.end = res.paging.end;
          }
          // console.log(this.end)
          this.TransactionsList = res.data;
          this.TransactionsList.forEach((item, i) => {
            if (item.messages[0].success) {
              if (item.messages[0].events.transfer && /^u/i.test(item.messages[0].events.transfer.denom)) {
                item.messages[0].events.transfer.denom = item.messages[0].events.transfer.denom.slice(1).toUpperCase()
                item.messages[0].events.transfer.amount = (item.messages[0].events.transfer.amount/1000000).toFixed(6)
              }else if(item.messages[0].events.set_distr_address && /^u/i.test(item.messages[0].events.set_distr_address.distr_address)){
                item.messages[0].events.transfer.denom = '';
                item.messages[0].events.transfer.amount = (item.messages[0].events.transfer.amount/1000000).toFixed(6)
              }
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
          }, setDelayTimer);
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

<style lang="scss" scope>
  @media (max-width: 890px) and (min-width: 100px){
    .el-table__header-wrapper>.el-table__header{
      // width: auto !important;
    }
    .el-table__footer-wrapper, .el-table__header-wrapper {
      // overflow-x: auto !important;
    }
    .el-table{
      overflow: auto !important;
    }
  }

</style>
