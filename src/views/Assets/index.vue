<template>
  <div class="AssetsList containerWrap">
    <div class="titleWrapper">
      <h2 class="pageTitle">资产</h2>
    </div>
    <div class="table">
      <div class="searchBar">
        <div class="queryIndex">
          <el-input class="inputKeyword" v-model="textarea" placeholder="请输入查询名称" clearable></el-input>
        </div>
      </div>
      <el-table :default-sort="{prop: 'value', order: 'descending'}" :data="AssetsList" stripe style="width: 100%">
        <el-table-column sortable prop="denom" label="名称" width="150">
          <template slot-scope="scope">
            <div class="nameDetail">
              <div class="icon">
                <img class="fixedIcon" v-if="scope.row.denom === 'uhst'" :src="require('@/assets/common/logo.png')" alt="">
                <img v-else :src="require('@/assets/common/symbol_none.svg')" alt="">
              </div>
              <span class="name">{{scope.row.denom === 'uhst' ? 'hst' : scope.row.denom }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column sortable prop="value" label="市值">
          <template slot-scope="scope">
            <span>{{scope.row.denom === 'uhst' ? (scope.row.price*scope.row.amount/1000000).toFixed(6) : (scope.row.price*scope.row.amount).toFixed(6) }}</span>
          </template>
        </el-table-column>
        <el-table-column sortable prop="price" label="汇率">
          <template slot-scope="scope">
            <span>{{scope.row.price}}{{scope.row.priceunit}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable prop="amount" label="发行量">
          <template slot-scope="scope">
            <span>{{scope.row.denom === 'uhst' ? (scope.row.amount/1000000).toFixed(6) : scope.row.amount }}</span>
          </template>
          </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.size"
        @pagination="getAssetsList"
      />
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination/Pagination";
export default {
  name: "Assets",
  components: {
    Pagination,
  },
  data() {
    return {
      textarea: "",
      AssetsList: [],
      oAssetsList: [],
      listQuery: {
        page: 1,
        size: 10,
      },
      total: 0,
    };
  },
  watch: {
    textarea: function (val, oldVal) {
      if (val) {
        this.AssetsList = this.oAssetsList.filter((item) =>
          item.denom.indexOf(val) !== -1
        );
      } else {
        this.AssetsList = this.oAssetsList;
      }
    },
  },
  created() {
    this.getAssetsList();
  },
  methods: {
    getAssetsList() {
      this.oAssetsList = this.AssetsList;
      this.$http(this.$api.getCurrency).then((res) => {
        if (res.code === 200) {
          this.AssetsList = res.data.result
          this.oAssetsList = this.AssetsList
        }
      })
    },
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
}
</style>
