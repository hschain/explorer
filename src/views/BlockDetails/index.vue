<template>
  <div class="BlockDetails containerWrap">
    <div class="titleWrapper">
      <h2 class="pageTitle">
        区块链详情&nbsp;
        <span class="height">#{{blockData.Height}}</span>
      </h2>
      <el-button-group>
        <el-button type="info" icon="el-icon-arrow-left" size="small" circle></el-button>
        <el-button type="info" icon="el-icon-arrow-right" size="small" circle></el-button>
      </el-button-group>
    </div>
    <div class="firstContainer containerWrapper">
      <div class="containerTitle">区块链信息</div>
      <div class="containerDetail">
        <ul class="infoRow" v-for="(item,name) in blockData" :key="name">
          <li class="infoLabel">{{blockDataLabel[name]}}</li>
          <li class="infoValue">
            <el-link type="primary" :underline="false" v-if="name === 'ParentHash'">{{item}}</el-link>
            <span v-else>{{item}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="secondContainer containerWrapper">
      <div class="containerTitle">交易信息</div>
      <el-table v-if="TransactionsInfo.length" :data="TransactionsInfo" stripe style="width: 100%">
        <el-table-column label="交易hash值" width="180">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="getTransactionDetails">{{scope.row.TxHash}}</el-link>
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
              <img class="trans_icon" :src="require('@/assets/common/transferarrow_gr.svg')" alt />
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
      <div v-else class="noTX">
        <img :src="require('@/assets/common/noitem_ic.svg')" alt="">
        <p class="msg">交易信息为空</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BlockDetails",
  data() {
    return {
      blockData: {
        Height: "542411",
        BlockTime: "26m ago (2020-09-01 / 16:40:55)",
        BlockHash:
          "C0A6C5B3F784D4C5FF339C026533B0CE6DE103352343C7BC4F229A826183AF71",
        ParentHash:
          "ABAD65D7E9F45ED93E8F9597D638E96B8B1434975BE81B9C8EA96AC4E7BC8903",
        NumberOfTx: 1,
      },
      blockDataLabel: {
        Height: "区块高度",
        BlockTime: "区块创建时间",
        BlockHash: "当前区块hash值",
        ParentHash: "上一个区块hash值",
        NumberOfTx: "当前块交易数量",
      },
      TransactionsInfo: [
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
    };
  },
  created() {
    this.getBlockDetails();
  },
  methods: {
    //获取列表
    getBlockDetails() {
      console.log(localStorage.getItem('blockDetails'));
    },
    getTransactionDetails() {
      this.$router.push('/transactionDetails')
    }
  },
};
</script>

<style lang="scss" scope>
.BlockDetails {
  .titleWrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .pageTitle {
      .height {
        font-size: 22px;
      }
    }
  }
  .secondContainer {
    .noTX {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 40px 0;
      min-height: 100%;
      img {
        height: 60px;
        width: 60px;
      }
      .msg {
        font-size: 15px;
        font-weight: 500;
        line-height: 1.21;
      }
    }
  }
}
</style>
