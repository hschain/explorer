<template>
  <div class="BlocksList containerWrap">
    <el-backtop class="backtop" :right="20" style="bottom: 25vh">
      <img src="@/assets/common/top.png" alt="">
      <p>顶部</p>
    </el-backtop>
    <div class="titleWrapper">
      <h2 class="pageTitle">区块</h2>
    </div>
    <el-card shadow="never" class="table">
      <div class="updateCheckbox">
        <el-checkbox v-model="update" @change="handleCheckedChange">实时更新</el-checkbox>
      </div>
      <el-table v-loading="loading" :data="BlocksList" stripe style="width: 100%">
        <el-table-column label="区块高度" width="120">
          <template slot-scope="scope">
            <el-link
              type="primary"
              :underline="false"
              @click="getDetails(scope.row.height)"
            >{{scope.row.height}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="当前区块Hash">
          <template slot-scope="scope">
            <el-link
              type="info"
              :underline="false"
              @click="getDetails(scope.row.height)"
            >{{scope.row.block_hash | hash}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="区块奖励">
          <template slot-scope="scope">
            <div>{{scope.row.amount}} {{scope.row.denom}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="num_txs" label="交易数量" width="100"></el-table-column>
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
    </el-card>
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
      loading: true,
      timer: null,
      update: true,
    };
  },
  created() {
    this.getBlocksList();
    this.timer = setInterval(() => {
      this.getBlocksList();
    }, 3000);
  },
  beforeDestroy() {
    clearInterval(this.timer)
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
          this.BlocksList.forEach(item => {
            if (/^u/i.test(item.denom)) {
              item.amount = (item.amount/1000000).toFixed(2)
              item.denom = item.denom.slice(1).toUpperCase()
            }
          })
          this.total = res.paging.total;
          if (this.listQuery.page === 1) {
            this.begin = res.paging.begin;
          }
        }
      }).finally(() => {
        this.loading = false
      })
    },
    getDetails(item) {
      this.$router.push({ path: `/blocks/${item}` });
    },
    handleCheckedChange(val) {
      if (val) {
        this.getBlocksList();
        this.timer = setInterval(() => {
          this.getBlocksList();
        }, 3000);
      } else {
        clearInterval(this.timer)
      }
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
