<template>
  <div class="TransactionsList containerWrap">
    <div class="titleWrapper">
      <h2 class="pageTitle">交易</h2>
    </div>
    <div class="table">
      <el-table :data="TransactionsList" stripe style="width: 100%">
        <el-table-column label="交易hash值" width="180">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="getDetails()">{{scope.row.TxHash}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="100">
          <template>
            <div>Transfer</div>
          </template>
        </el-table-column>
        <el-table-column label="地址">
          <template slot-scope="scope">
            <div class="TransferAddress">
              <el-link type="primary" :underline="false">{{scope.row.Address}}</el-link>
              <img class="trans_icon" :src="require('@/assets/common/transferarrow_gr.svg')" alt="">
              <el-link type="primary" :underline="false">{{scope.row.Address}}</el-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="交易金额" width="100">
          <template slot-scope="scope">
            <div>{{scope.row.Value}}.</div>
          </template>
        </el-table-column>
        <el-table-column prop="Currency" label="交易货币" width="150"></el-table-column>
        <el-table-column label="区块高度" width="100">
          <template slot-scope="scope">
            <el-link type="info" :underline="false">{{scope.row.Height}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="Time" label="时间" width="80"></el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.size"
        @pagination="TransactionsList"
      />
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination/Pagination";
export default {
  name: "Transactions",
  components: {
    Pagination,
  },
  data() {
    return {
      TransactionsList: [
        {
          TxHash: "	BE2513F2 ... 63C7E27F",
          Type: "Transfer",
          Address: "hsc1nc ... jn6wj7",
          Value: 5,
          Currency: "HST",
          Height: "542411",
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
    getTransactionsList() {},
    getDetails() {
      this.$router.push('/transactionDetails')
    }
  },
};
</script>

<style lang="scss" scope>
</style>
