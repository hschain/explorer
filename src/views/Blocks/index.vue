<template>
  <div class="BlocksList containerWrap">
    <el-backtop class="backtop" :right="20" style="bottom: 25vh">
      <img src="@/assets/common/top.png" alt="">
      <p>{{ $t('blocks.top') }}</p>
    </el-backtop>
    <div class="titleWrapper">
      <h2 class="pageTitle">{{ $t('dashboard.blocks.title') }}</h2>
    </div>
    <el-card shadow="never" class="table">
      <div class="updateCheckbox">
        <!-- 小分页组件 -->
        <small-pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.size"
        @pagination="pagination"></small-pagination>
        <el-checkbox v-model="update" @change="handleCheckedChange">{{ $t('blocks.liveUpdate') }}</el-checkbox>
      </div>
      <el-table v-loading="loading" :data="BlocksList" stripe style="width: 100%">
        <el-table-column :label="$t('blocks.blocksHeight')" width="120">
          <template slot-scope="scope">
            <el-link
              type="primary"
              :underline="false"
              @click="getDetails(scope.row.height)"
            >{{scope.row.height}}</el-link>
          </template>
        </el-table-column>
        <el-table-column :label="$t('blocks.blocksHash')">
          <template slot-scope="scope">
            <el-link
              type="info"
              :underline="false"
              @click="getDetails(scope.row.height)"
            >{{scope.row.block_hash | hash}}</el-link>
          </template>
        </el-table-column>
        <el-table-column :label="$t('blocks.blocksReward')">
          <template slot-scope="scope">
            <div>{{scope.row.amount}} {{scope.row.denom}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="num_txs" :label="$t('blocks.transactionsNumber')" width="100"></el-table-column>
        <el-table-column :label="$t('blocks.time')" width="100">
          <template slot-scope="scope">
            <div>{{scope.row.timestamp | time}}</div>
          </template>
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
import { formatTime } from "@/utils";
import { setDelayTimer } from "@/utils/common"
import Pagination from "@/components/Pagination/Pagination";
import smallPagination from "@/components/smallPagination/smallPagination";

export default {
  name: "Blocks",
  components: {
    Pagination,
    smallPagination
  },
  data() {
    return {
      BlocksList: [],
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
    this.getBlocksList();
    // this.timer = setInterval(() => {
    //   this.getBlocksList();
    // }, 5000);
  },
  beforeDestroy() {
    // clearInterval(this.timer)
    this.update = false
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
          this.total - (this.listQuery.page - 1) * this.listQuery.size;
      }
      this.$http(this.$api.getBlocksList, params).then((res) => {
        if (res.code === 200) {
          this.BlocksList = res.data;
          // console.log(this.BlocksList)
          this.BlocksList.forEach(item => {
            if (/^u/i.test(item.denom)) {
              item.amount = (item.amount/1000000).toFixed(2)
              item.denom = item.denom.slice(1).toUpperCase()
            }
          })
          this.total = res.paging.total;
        }
      }).finally(() => {
        this.loading = false
        if (this.update && !this.stopLastRequest) {
          setTimeout(() => {
            this.getBlocksList()
          }, setDelayTimer);
        } else {
          this.stopLastRequest = false
        }
      })
    },
    getDetails(item) {
      this.$router.push({ path: `/blocks/${item}` });
    },
    handleCheckedChange(val) {
      if (val) {
        this.getBlocksList();
        // this.timer = setInterval(() => {
        //   this.getBlocksList();
        // }, 5000);
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
      this.getBlocksList()
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
