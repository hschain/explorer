<template>
  <div class="top500 containerWrap">
    <div class="titleWrapper">
      <h2 class="pageTitle">用户</h2>
    </div>
    <el-card shadow="never" class="table">
      <el-table v-loading="loading" :data="Top500List" stripe style="width: 100%">
        <el-table-column label="序号" width="100">
          <template slot-scope="scope">
            {{scope.$index + 1 + (listQuery.page - 1) * listQuery.size}}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="地址" width="450">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="getDetails(scope.row.address, scope)">{{scope.row.address}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="可用余额" width="300">
          <template slot-scope="scope">{{scope.row.amount}}</template>
        </el-table-column>
        <el-table-column prop="denom" label="货币" width="280">
          <template slot-scope="scope">{{scope.row.denom}}</template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.size"
        @pagination="pagination"
      />
    </el-card>
  </div>
</template>

<script>
  /* eslint-disable */

  import { formatTime } from "@/utils";
  import { setDelayTimer } from "@/utils/common"
  import Pagination from "@/components/Pagination/Pagination";
  export default {
    name: 'top500',
    components: {
      Pagination
    },
    data() {
      return {
        Top500List: [],
        listQuery: {
          page: 1,
          size: 20,
        },
        total: 0,
        loading: true,
        timer: null,
        update: true,
        stopLastRequest: false,
      };
    },
    created() {
      this.getTop500List()
    },
    methods: {
      //获取列表
      getTop500List() {
        let params = {
          limit: this.listQuery.size,
        };
        if (this.listQuery.page !== 1) {
          params.page = this.listQuery.page;
        }
        this.$http(this.$api.getTop500List, params).then((res) => {
          if (res.code === 200) {
            this.Top500List = res.data;
            this.Top500List.forEach((item) => {
              if (/^u/i.test(item.denom)) {
                item.amount = (item.amount/1000000).toFixed(2)
                item.denom = item.denom.slice(1).toUpperCase()
              }
            })
            this.total = res.paging.total
          }
        }).finally(() => {
          this.loading = false
        })
      },
      //跳转
      getDetails(item) {
        this.$router.push({ path: `/account/${item}` });
      },
      pagination(val) {
        this.listQuery = {
          page: val.page,
          size: val.limit
        }
        this.stopLastRequest = true
        this.getTop500List()
      }
    },
  }

</script>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

  .el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: hidden !important;
  }
</style>
