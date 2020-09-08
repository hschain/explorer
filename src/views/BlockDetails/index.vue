<template>
  <div class="BlockDetails containerWrap">
    <div class="titleWrapper">
      <h2 class="pageTitle">
        区块链详情&nbsp;
        <span class="height">#{{blockData.height}}</span>
      </h2>
      <el-button-group>
        <el-button
          type="info"
          icon="el-icon-arrow-left"
          size="small"
          circle
          @click="() => $router.push({ path: `/blocks/${blockData.height+1}` })"
        ></el-button>
        <el-button
          type="info"
          icon="el-icon-arrow-right"
          size="small"
          circle
          @click="() => $router.push({ path: `/blocks/${blockData.height-1}` })"
        ></el-button>
      </el-button-group>
    </div>
    <div class="firstContainer containerWrapper">
      <div class="containerTitle">区块链信息</div>
      <div class="containerDetail">
        <ul class="infoRow" v-for="(item,name) in blockData" :key="name">
          <li class="infoLabel">{{blockDataLabel[name]}}</li>
          <li class="infoValue">
            <el-link
              type="primary"
              :underline="false"
              v-if="name === 'parent_hash'"
              @click="() => $router.push({ path: `/blocks/${blockData.height-1}` })"
            >{{item}}</el-link>
            <span v-else>{{item}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="secondContainer containerWrapper">
      <div class="containerTitle">交易信息</div>
      <!-- <el-table
        v-if="TransactionsInfo && TransactionsInfo.length"
        :data="TransactionsInfo"
        stripe
        style="width: 100%"
      >
        <el-table-column label="交易hash值" width="180">
          <template slot-scope="scope">
            <el-link
              type="primary"
              :underline="false"
              @click="getTransactionDetails(scope.row.tx_hash)"
            >{{scope.row.tx_hash | hash}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="100">
          <template slot-scope="scope">
            <div>{{scope.row.type}}</div>
          </template>
        </el-table-column>
        <el-table-column label="地址">
          <template slot-scope="scope">
            <div class="TransferAddress">
              <el-link type="primary" :underline="false">{{scope.row.messages[0].events.message.sender | hash}}</el-link>
              <img v-if="scope.row.messages[0].events.transfer" class="trans_icon" :src="require('@/assets/common/transferarrow_gr.svg')" alt />
              <el-link v-if="scope.row.messages[0].events.transfer" type="primary" :underline="false">{{scope.row.messages[0].events.transfer.recipient | hash}}</el-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="交易金额" width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.messages[0].events.transfer">{{scope.row.messages[0].events.transfer.amount}}.</div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="交易货币" width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.messages[0].events.transfer">{{scope.row.messages[0].events.transfer.denom}}</div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="区块高度" width="100">
          <template slot-scope="scope">
            <el-link type="info" :underline="false">{{scope.row.height}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="时间" width="80">
          <template slot-scope="scope">
            <div>{{scope.row.timestamp | time}}</div>
          </template>
        </el-table-column>
      </el-table>-->
      <TxsTable v-if="TransactionsInfo" :txsList="TransactionsInfo" />
      <div v-else class="noTX">
        <img :src="require('@/assets/common/noitem_ic.svg')" alt />
        <p class="msg">交易信息为空</p>
      </div>
    </div>
  </div>
</template>

<script>
import { formatTime } from "@/utils";
import { setTxsType } from "@/utils/common";
import TxsTable from "@/components/TxsTable/TxsTable";
export default {
  name: "BlockDetails",
  components: {
    TxsTable,
  },
  data() {
    return {
      blockData: {},
      blockDataLabel: {
        height: "区块高度",
        timestamp: "区块创建时间",
        block_hash: "当前区块hash值",
        parent_hash: "上一个区块hash值",
        num_txs: "当前块交易数量",
      },
      TransactionsInfo: [],
    };
  },
  created() {
    this.getBlockDetails();
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
    getBlockDetails() {
      this.$http(this.$api.getBlocksList, "", this.$route.params.data).then(
        (res) => {
          if (res.code === 200) {
            let time = formatTime(res.data[0].timestamp, true);
            this.blockData = {
              height: res.data[0].height,
              timestamp:
                formatTime(res.data[0].timestamp) +
                " ( " +
                time[0] +
                " / " +
                time[1] +
                " )",
              block_hash: res.data[0].block_hash,
              parent_hash: res.data[0].parent_hash,
              num_txs: res.data[0].num_txs,
            };
            this.TransactionsInfo = res.data[0].txs;
            this.TransactionsInfo.forEach((item, i) => {
              item.type = setTxsType(
                res.data[0].txs[i].messages[0].events.message.action
              );
            });
          }
        }
      );
    },
    getTransactionDetails(item) {
      this.$router.push({ path: `/transactions/${item}` });
    },
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
