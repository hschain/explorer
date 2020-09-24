<template>
  <div class="Dashboard">
    <div class="main_Dashboard">
      <img src="@/assets/view/main/main_dashboard.png" alt />
    </div>
    <div class="dashboardContent">
      <div class="cardDisplay">
        <el-card class="cardBox" shadow="hover" v-for="(item, name) in cardData" :key="name">
          <div class="cardStatus">
            <div class="logoWrapper"><img :src="require(`@/assets/view/main/${name}.png`)" alt=""></div>
            <div class="titleWrapper">
              <div class="value">{{ currencyFormat(item.value) }}</div>
              <div class="title">{{ item.title }}</div>
            </div>
          </div>
        </el-card>
      </div>
      <div class="BlockTxWrapper">
        <Blocks @sendHeightValue="getHeightValue" />
        <Transactions @sendTransferValue="getTransferValue" />
      </div>
    </div>
  </div>
</template>

<script>
import Blocks from "./Blocks";
import Transactions from "./Transactions";
import { currencyFormat } from "@/utils"
export default {
  name: "Dashboard",
  components: { Blocks, Transactions },
  data() {
    return {
      timer: null,
      update: true,
      cardData: {
        height: {
          title: "区块高度",
          value: "0",
        },
        transfer: {
          title: "总交易数",
          value: "0",
        },
        flow: {
          title: "总流通量",
          value: "0",
        },
        output: {
          title: "每秒交易数",
          value: "0",
        },
      }
    };
  },
  created() {
    this.getMinting()
    this.getTps()
    // this.timer = setInterval(() => {
    //   this.getMinting();
    // }, 5000);
  },
  beforeDestroy() {
    // clearInterval(this.timer)
    this.update = false
  },
  methods: {
    getMinting() {
      this.$http(this.$api.getMinting).then((res) => {
        this.cardData.flow.value = res.data.result.status.total_minted_supply/1000000
        // this.cardData.output.value = res.data.result.mint_plans[0].total_per_day/1000000
      }).finally(() => {
        if (this.update) {
          this.getMinting()
        }
      })
    },
    getTps() {
      this.$http(this.$api.getTps).then(res => {
        this.cardData.output.value = res.data
      }).finally(() => {
        if (this.update) {
          this.getTps()
        }
      })      
    },
    getHeightValue(val) {
      this.cardData.height.value = val
    },
    getTransferValue(val) {
      this.cardData.transfer.value = val
    },
    currencyFormat (val) {
      return currencyFormat(val, true)
    }
  }
};
</script>

<style lang="scss" scoped>
.Dashboard {
  .main_Dashboard {
    display: flex;
    justify-content: center;
    img {
      min-width: 2000px;
    }
    @media screen and (max-width: 1100px) {
      img {
        display: none;
      }
      width: 100%;
      height: 200px;
      background: #000;
    }
  }
  .dashboardContent {
    height: fit-content;
    margin: 15px auto 70px;
    max-width: 1300px;
    padding: 0 50px;
    @media screen and (max-width: 1100px) {
      max-width: 800px;
    }
    .cardDisplay {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      .cardBox {
        min-height: calc(100% - 12px);
        margin-bottom: 12px;
        .cardStatus {
          display: flex;
          font-family: Montserrat;
          .titleWrapper {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 55px;
            .value {
              font-size: 20px;
              color: #222;
              font-weight: 500;
              line-height: 1.2;
              text-align: center;
            }
            .title {
              font-size: 14px;
              color: #000;
              text-align: center;
            }
          }
          .logoWrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            img{
              height: 40px;
              width: 40px;
            }
          }
        }
      }
    }

    .BlockTxWrapper {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr;
      gap: 15px;
    }
    @media screen and (max-width: 1100px) {
      .cardDisplay {
        grid-template-rows: 1fr 1fr;
        grid-template-columns: 1fr 1fr;
      }
      .BlockTxWrapper {
        grid-template-rows: 1fr 1fr;
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>
