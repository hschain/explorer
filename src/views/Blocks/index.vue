<template>
  <div class="BlocksList containerWrap">
    <div class="titleWrapper">
      <h2 class="pageTitle">区块链</h2>
    </div>
    <div class="table">
      <el-table :data="BlocksList" stripe style="width: 100%">
        <el-table-column label="区块高度" width="150">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="getDetails()">{{scope.row.Height}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="上一个区块hash值">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false">{{scope.row.ParentHash}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="当前区块hash值">
          <template slot-scope="scope">
            <el-link type="info" :underline="false">{{scope.row.BlockHash}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="Txs" label="交易信息" width="100"></el-table-column>
        <el-table-column prop="Time" label="时间" width="80"></el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.size"
        @pagination="getBlocksList"
      />
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination/Pagination";
export default {
  name: "Blocks",
  components: {
    Pagination,
  },
  data() {
    return {
      BlocksList: [
        {
          Height: "542411",
          ParentHash: "	BE2513F2 ... 63C7E27F",
          BlockHash: "5839EE42 ... C0368AF9",
          Txs: 0,
          Time: "6m ago",
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
    //获取列表
    getBlocksList() {

    },
    getDetails() {
      this.$router.push('/blockDetails')
    }
  },
};
</script>

<style lang="scss" scope>
</style>
