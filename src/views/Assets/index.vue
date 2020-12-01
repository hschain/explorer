<template>
  <div class="AssetsList containerWrap">
    <el-backtop class="backtop" :bottom="150">
      <img src="@/assets/common/top.png" alt="">
      <p>顶部</p>
    </el-backtop>
    <div class="titleWrapper">
      <h2 class="pageTitle">资产</h2>
    </div>
    <el-card shadow="never" class="table">
      <div class="searchBar">
        <div class="queryIndex">
          <el-input class="inputKeyword" v-model="textarea" placeholder="请输入查询名称" clearable></el-input>
        </div>
      </div>
      <el-table v-loading="loading" :default-sort="{prop: 'value', order: 'descending'}" :data="AssetsList" stripe style="width: 100%">
        <el-table-column sortable prop="denom" label="名称" width="150">
          <template slot-scope="scope">
            <div class="nameDetail">
              <div class="icon">
                <img class="fixedIcon" v-if="scope.row.denom === 'HST'" :src="require('@/assets/common/logo.png')" alt="">
                <img v-else :src="require('@/assets/common/symbol_none.svg')" alt="">
              </div>
              <span class="name">{{scope.row.denom }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column sortable prop="value" label="市值">
          <template slot-scope="scope">
            <span>{{ scope.row.value }}</span>
          </template>
        </el-table-column>
        <el-table-column sortable prop="price" label="汇率">
          <template slot-scope="scope">
            <span>$ {{scope.row.price}}{{scope.row.priceunit}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable prop="amount" label="发行量">
          <template slot-scope="scope">
            <span>{{scope.row.amount}}</span>
          </template>
          </el-table-column>
      </el-table>
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
import { setDelayTimer } from "@/utils/common";
import Pagination from "@/components/Pagination/Pagination";
export default {
  name: "Assets",
  components: {
    Pagination,
  },
  data() {
    return {
      timer: null,
      textarea: "",
      AssetsList: [],
      oAssetsList: [],
      loading: true,
      listQuery: {
        page: 1,
        size: 20
      },
      total: 0,
      textFilter: '',
      update: true,
      stopLastRequest: false,
    };
  },
  watch: {
    textarea: function (val, oldVal) {
      this.textFilter = val
      if (val) {
        this.AssetsList = this.oAssetsList.filter((item) =>
          item.denom.toLowerCase().indexOf(val.toLowerCase()) !== -1
        );
      } else {
        this.AssetsList = this.oAssetsList;
      }
    },
  },
  created() {
    this.getAssetsList()
    // this.timer = setInterval(() => {
    //   this.getAssetsList();
    // }, 5000);
  },
  beforeDestroy() {
    // clearInterval(this.timer)
    this.update = false
  },
  methods: {
    getAssetsList() {
      // this.oAssetsList = this.AssetsList;
      this.$http(this.$api.getCurrency).then((res) => {
        if (res.code === 200) {
          this.oAssetsList = res.data.result
          this.oAssetsList.forEach(item => {
            item.price = (item.price*1).toFixed(6)
            if(/^u/i.test(item.denom)) {
              item.denom = item.denom.toUpperCase().slice(1)
              item.amount = (item.amount/1000000).toFixed(6)
            } else {
              item.denom = item.denom.toUpperCase()
            }
            item.value = (item.price*item.amount).toFixed(6)
          })
          if (this.textFilter) {
            this.AssetsList = this.oAssetsList.filter((item) =>
              item.denom.toLowerCase().indexOf(this.textFilter.toLowerCase()) !== -1
            );
          } else {
            this.AssetsList = this.oAssetsList
          }
          this.total = this.AssetsList.length
          this.handlePage()
        }
      }).finally(() => {
        this.loading = false
        if (this.update && !this.stopLastRequest) {
          setTimeout(() => {
            this.getAssetsList()
          }, setDelayTimer);
        } else {
          this.stopLastRequest = false
        }
      })
    },
    handlePage() {
      if (this.AssetsList.length > this.listQuery.size) this.AssetsList = this.oAssetsList.slice((this.listQuery.page-1)*this.listQuery.size, this.listQuery.page*this.listQuery.size)
    },
    pagination(val) {
      this.listQuery = {
        page: val.page,
        size: val.limit
      }
      this.stopLastRequest = true
      this.getAssetsList()
    }
  },
};
</script>

<style lang="scss" scoped>
.AssetsList {
  .table {
    .searchBar {
      margin-bottom: 10px;
      display: flex;
      justify-content: flex-end;
      .queryIndex {
        display: flex;
        .inputKeyword {
          width: 400px;
        }
        .searchBtn {
          margin-left: 20px;
        }
      }
    }
    .nameDetail {
      display: flex;
      .icon {
        margin-right: 10px;
        .fixedIcon {
          width: 30px;
          height: 30px;
          border-radius: 50%
        }
      }
      .name {
        line-height: 30px;
      }
    }
  }
  @media (max-width: 550px){
    .inputKeyword{
      display: none !important;
    }
  }
}
</style>
