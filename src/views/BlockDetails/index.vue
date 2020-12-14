<template>
  <div class="BlockDetails containerWrap">
    <div class="titleWrapper">
      <h2 class="pageTitle">
        {{ $t('blocksDetail.title') }}&nbsp;
        <span class="height">#{{ blockData.height }}</span>
      </h2>
      <el-button-group>
        <el-button
          type="info"
          icon="el-icon-arrow-left"
          size="small"
          circle
          @click="() => $router.push({ path: `/blocks/${$route.params.data*1 - 1}` })"
        ></el-button>
        <el-button
          type="info"
          icon="el-icon-arrow-right"
          size="small"
          circle
          @click="getBlockDetails(true)"
        ></el-button>
      </el-button-group>
    </div>
    <el-card shadow="never" class="firstContainer containerWrapper">
      <div class="containerTitle">{{ $t('blocksDetail.blocksInfo') }}</div>
      <div class="containerDetail">
        <ul class="infoRow" v-for="(item, name) in blockData" :key="name">
          <li class="infoLabel">{{ blockDataLabel[name] }}</li>
          <li class="infoValue">
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>
    </el-card>
    <el-card shadow="never" class="secondContainer containerWrapper">
      <div class="containerTitle">{{ $t('blocksDetail.transactionsInfo') }}</div>
      <TxsTable v-if="TransactionsInfo.length" :txsList="TransactionsInfo" />
      <div v-else class="noTX">
        <img :src="require('@/assets/common/noitem_ic.svg')" alt />
        <p class="msg">{{ $t('blocksDetail.transactionsInfoEmpty') }}</p>
      </div>
    </el-card>
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
        height: this.$t('blocksDetail.blocksHeight'),
        timestamp: this.$t('blocksDetail.creationTime'),
        block_hash: this.$t('blocksDetail.currentBlockHash'),
        bonus: this.$t('blocksDetail.blockReward'),
        num_txs: this.$t('blocksDetail.transactionsNum'),
      },
      TransactionsInfo: [],
    };
  },
  mounted() {
    if (this.$store.state.option.blockData) {
      this.handleResult(this.$store.state.option.blockData);
      this.$store.dispatch("option/getBlockData", null);
    } else {
      this.getBlockDetails();
    }
  },
  beforeDestroy() {
    this.$store.dispatch("option/setTransactionList", []);
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
    getBlockDetails(next) {
      this.$http(this.$api.getBlocksList, "", next ? this.$route.params.data*1 + 1 : this.$route.params.data).then(
        (res) => {
          if (res.code === 200) {
            if (next && res.data) {
              this.$store.dispatch('option/getBlockData', res)
              this.$router.push({ path: `/blocks/${this.$route.params.data*1 + 1}` })
            } else {
              this.handleResult(res)
            }
          }
        }
      );
    },
    //处理获取的结果
    handleResult(res) {
      this.blockData = {
        height: res.data[0].height,
        timestamp:
          formatTime(res.data[0].timestamp) +
          " ( " +
          formatTime(res.data[0].timestamp, true) +
          " )",
        block_hash: res.data[0].block_hash,
        bonus: /^u/i.test(res.data[0].denom)
          ? (res.data[0].amount / 1000000).toFixed(2) +
            " " +
            res.data[0].denom.slice(1).toUpperCase()
          : res.data[0].amount + " " + res.data[0].denom,
        num_txs: res.data[0].num_txs,
      };
      if (res.data[0].txs) {
        this.TransactionsInfo = res.data[0].txs;
        this.TransactionsInfo.forEach((item, i) => {
          if (item.messages[0].success && /^u/i.test(item.messages[0].events.transfer.denom)) {
            item.messages[0].events.transfer.denom = item.messages[0].events.transfer.denom.slice(
              1
            );
            item.messages[0].events.transfer.amount = (
              item.messages[0].events.transfer.amount / 1000000
            ).toFixed(6);
          }
          item.type = setTxsType(
            res.data[0].txs[i].messages[0].events.message.action
          );
        });
        //props父传子失效，暂时使用store传值
        this.$store.dispatch(
          "option/setTransactionList",
          this.TransactionsInfo
        );
      }
    },
    getTransactionDetails(item) {
      this.$router.push({ path: `/transactions/${item}` });
    },
  },
};
</script>

<style lang="scss" scoped>
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
