<template>
  <div class="AssetsList containerWrap">
    <div class="titleWrapper">
      <h2 class="pageTitle">资产</h2>
    </div>
    <div class="table">
      <div class="searchBar">
        <div class="queryIndex">
          <el-input class="inputKeyword" v-model="textarea" placeholder="请输入查询内容" clearable></el-input>
          <el-button class="searchBtn" type="primary" icon="el-icon-search">查询</el-button>
        </div>
      </div>
      <el-table :data="AssetsList" stripe style="width: 100%">
        <el-table-column sortable prop="Name" label="Name" width="150"></el-table-column>
        <el-table-column sortable prop="MarketCap" label="Market Cap(USD)"></el-table-column>
        <el-table-column sortable prop="Price" label="Price(USD)"></el-table-column>
        <el-table-column sortable prop="Supply" label="Supply"></el-table-column>
        <el-table-column prop="Owner" label="Owner" width="80"></el-table-column>
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
      textarea: '',
      AssetsList: [
        {
          Name: "vasvs",
          MarketCap: "421,552",
          Price: "421,552",
          Supply: "adadws",
          Owner: "hahah",
        },
      ],
      listQuery: {
        page: 1,
        size: 10,
      },
      total: 0,
    };
  },
  methods: {
    getAssetsList() {},
  },
};
</script>

<style lang="scss" scope>
.AssetsList{
  .table{
    .searchBar{
      margin-bottom: 10px;
      display: flex;
      justify-content: flex-end;
      .queryIndex{
        display: flex;
        .inputKeyword{
          width: 400px;
        }
        .searchBtn{
          margin-left: 20px;
        }
      }
    }
  }
}
</style>
