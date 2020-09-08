<template>
  <div class="BlocksList containerWrap">
    <div class="titleWrapper">
      <h2 class="pageTitle">区块</h2>
    </div>
    <div class="table">
      <el-table :data="BlocksList" stripe style="width: 100%">
        <el-table-column label="区块高度" width="150">
          <template slot-scope="scope">
            <el-link
              type="primary"
              :underline="false"
              @click="getDetails(scope.row.height)"
            >{{scope.row.height}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="上一个区块hash值">
          <template slot-scope="scope">
            <el-link
              type="primary"
              :underline="false"
              @click="getDetails(scope.row.height - 1 )"
            >{{scope.row.parent_hash | hash}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="当前区块hash值">
          <template slot-scope="scope">
            <el-link
              type="info"
              :underline="false"
              @click="getDetails(scope.row.height)"
            >{{scope.row.block_hash | hash}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="num_txs" label="交易信息" width="100"></el-table-column>
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
        @pagination="getBlocksList"
      />
    </div>
  </div>
</template>

<script>
import { formatTime } from "@/utils";
import Pagination from "@/components/Pagination/Pagination";
export default {
  name: "Blocks",
  components: {
    Pagination,
  },
  data() {
    return {
      BlocksList: [],
      listQuery: {
        page: 1,
        size: 20,
      },
      total: 0,
      begin: 0, //区块高度起始信息
    };
  },
  created() {
    this.getBlocksList();
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
    //获取列表
    getBlocksList() {
      let params = {
        limit: this.listQuery.size,
      };
      if (this.listQuery.page !== 1) {
        params.begin =
          this.begin - (this.listQuery.page - 1) * this.listQuery.size;
      }
      this.$http(this.$api.getBlocksList, params).then((res) => {
        if (res.code === 200) {
          this.BlocksList = res.data;
          this.total = res.paging.total;
          if (this.listQuery.page === 1) {
            this.begin = res.paging.begin;
          }
        }
      });
    },
    getDetails(item) {
      this.$router.push({ path: `/blocks/${item}` });
    },
  },
};
</script>

<style lang="scss" scope>
</style>
