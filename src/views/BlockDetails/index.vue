<template>
  <div class="BlockDetails containerWrap">
    <div class="titleWrapper">
      <h2 class="pageTitle">
        区块链详情&nbsp;
        <span class="height">#{{ blockData.height }}</span>
      </h2>
      <el-button-group>
        <el-button
          type="info"
          icon="el-icon-arrow-left"
          size="small"
          circle
          @click="
            () => $router.push({ path: `/blocks/${blockData.height + 1}` })
          "
        ></el-button>
        <el-button
          type="info"
          icon="el-icon-arrow-right"
          size="small"
          circle
          @click="
            () => $router.push({ path: `/blocks/${blockData.height - 1}` })
          "
        ></el-button>
      </el-button-group>
    </div>
    <div class="firstContainer containerWrapper">
      <div class="containerTitle">区块链信息</div>
      <div class="containerDetail">
        <ul class="infoRow" v-for="(item, name) in blockData" :key="name">
          <li class="infoLabel">{{ blockDataLabel[name] }}</li>
          <li class="infoValue">
            <el-link
              type="primary"
              :underline="false"
              v-if="name === 'parent_hash'"
              @click="
                () => $router.push({ path: `/blocks/${blockData.height - 1}` })
              "
              >{{ item }}</el-link
            >
            <span v-else>{{ item }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="secondContainer containerWrapper">
      <div class="containerTitle">交易信息</div>
      <TxsTable v-if="TransactionsInfo.length" :txsList="TransactionsInfo" />
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
    TxsTable
  },
  data() {
    return {
      blockData: {},
      blockDataLabel: {
        height: "区块高度",
        timestamp: "区块创建时间",
        block_hash: "当前区块hash值",
        parent_hash: "上一个区块hash值",
        num_txs: "当前块交易数量"
      },
      TransactionsInfo: []
    };
  },
  created() {
    if (this.$store.state.option.blockData) {
      this.handleResult(this.$store.state.option.blockData)
      this.$store.dispatch('option/blockData', null)
    } else {
      this.getBlockDetails()
    }
  },
  beforeDestroy() {
    this.$store.dispatch('option/setTransactionList', [])
  },
  filters: {
    hash: function(value) {
      return value.slice(0, 6) + " … " + value.slice(-6);
    },
    time: function(value) {
      return formatTime(value);
    }
  },
  methods: {
    //获取列表
    getBlockDetails() {
      this.$http(this.$api.getBlocksList, "", this.$route.params.data).then(res => {
        if (res.code === 200) {
          this.handleResult(res)
        }
      });
    },
    //处理获取的结果
    handleResult(res) {
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
        num_txs: res.data[0].num_txs
      };
      if (res.data[0].txs) {
        this.TransactionsInfo = res.data[0].txs;
        this.TransactionsInfo.forEach((item, i) => {
          item.type = setTxsType(
            res.data[0].txs[i].messages[0].events.message.action
          );
        })
        //props父传子失效，暂时使用store传值
        this.$store.dispatch('option/setTransactionList', this.TransactionsInfo)
      }
    },
    getTransactionDetails(item) {
      this.$router.push({ path: `/transactions/${item}` });
    }
  }
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
