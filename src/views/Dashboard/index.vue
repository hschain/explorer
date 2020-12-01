<template>
  <div class="Dashboard">
    <div class="main_Dashboard main_Dashboard-app main_Dashboard-pc">
      <div class="download_button">
        <el-popover
          class="buttonWrapper"
          placement="bottom"
          width="175"
          trigger="click"
          :disabled="!isPc">
          <div class="download_button_box">
            <img class="qrcode" src="@/assets/app_QRCode/DownloadQRCode.png" style="width: 150px; height: 150px" alt>
          </div>
          <el-button type="success" slot="reference" @click="download('ios')">
            <span class="icon-button MobilePhone"></span>
            <span class="icon-font">点击下载</span>
          </el-button>
        </el-popover>
      </div>
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
import { currencyFormat } from "@/utils";
import { setDelayTimer } from "@/utils/common";
export default {
  name: "Dashboard",
  components: { Blocks, Transactions },
  data() {
    return {
      timer: null,
      update: true,
      isPc: true, //是否为pc打开网页
      visibles: false,
      cardData: {
        height: {
          title: '区块高度',
          value: '0'
        },
        transfer: {
          title: '交易数',
          value: '0'
        },
        tps: {
          title: '每秒交易数',
          value: '0'
        },
        total_circulation_supply: {
          title: '流通量',
          value: '0'
        },
        current_day_provisions: {
          title: '日产量',
          value: '0'
        },
        usersNumber: {
          title: '用户量',
          value: '0'
        }
      }
    };
  },
  created() {
    this.getFrame()
    this.IsPC()
  },
  beforeDestroy() {
    // clearInterval(this.timer)
    this.update = false
  },
  methods: {
    getFrame() {
      this.$http(this.$api.getFrame).then((res) => {
        if(res.code === 200) {
          for (let i in res.data) {
            this.cardData[i].value = res.data[i]
          }
        }
      }).finally(() => {
        if (this.update) {
          setTimeout(() => {
            this.getFrame()
          }, setDelayTimer)
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
    },
    download (form) {
      if (!this.isPc) {
          window.open("https://scan.hschain.io/#/Jump");
          // window.open("http://localhost:9528/#/Jump");
      }
    },
    IsPC() {
      var userAgentInfo = navigator.userAgent;
      var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
      var flag = true;
      for (var v = 0; v < Agents.length; v++) {
          if (userAgentInfo.indexOf(Agents[v]) > 0) {
              flag = false;
              break;
          }
      }
      this.isPc = flag
    }
  }
};
</script>

<style lang="scss">
.Dashboard {
  .main_Dashboard-pc {
    width: 100%;
    height: 350px;
    background-image: url("../../assets/view/main/main_dashboard.png");
    background-repeat:no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    position: relative;
    .dashboardImg {
      width: auto;
    }
    .download_button{
      position: absolute;
      top: 65%;
      left: 23%;
      width: auto;
      height: auto;
      .buttonWrapper{
        &:last-child {
          margin-left: 20px;
        }
        .download_button_box {
          .qrcode {
          }
        }
        .el-button{
          padding: 5px 25px;
          display: inline-block;
          border-color: #1576E5;
          background: #1576E5;
          border-radius: 25px;
          .icon-button{
            width: 35px;
            height: 35px;
            margin-right: 10px;
          }
          .MobilePhone{
            background: url("../../assets/app_QRCode/MobilePhone.png") ;
            background-size: 35px;
          }
          .icon-font{
            line-height: 35px;
            color: #fff;
            font-size: 15px;
          }
        }
      }
    }
    }
  @media screen and (max-width: 890px) {
    .main_Dashboard-app{
      width: 100%;
      height: 250px;
      background-image: url("../../assets/view/main/main_mini.png");
      background-repeat:no-repeat;
      background-size: 100% 100%;
      margin-top: 0px;
      .download_button{
        left: 2%;
        .buttonWrapper{
          .download_button_box{
            border: 1px solid salmon;
            display: none;
          }
        }
      }
    }
    }
  }
  .dashboardContent {
    height: fit-content;
    margin: 15px auto 70px;
    max-width: 1400px;
    padding: 0 50px;
    @media screen and (max-width: 1100px) {
      max-width: 800px;
    }
    .cardDisplay {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
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
              font-size: 18px;
              color: #222;
              font-weight: 500;
              line-height: 1.2;
              text-align: center;
            }
            .title {
              font-size: 13px;
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
  .el-popper{
    width: 225px;
    position: absolute;
    top: 471px;
    left: 317px;
    transform-origin: center bottom;
    z-index: 2001;
  }

@media screen and (max-width: 800px) {
  .el-popover{
    display: none;
  }
  .Dashboard{
    .main_Dashboard{
      .dashboardImg{
        display: none;
        .main_Dashboard{
          width: 100%;
          height: auto;
          background: none;
        }
      }
      .dashboardMini {
        display: block;
        height: auto;
        width: 100%;
      }
      .download_button{
        top: 65%;
        //left: 2%;
      }
    }
  }
}
@media (min-width: 801px) {
  .dashboardMini{
    display: none;
  }
}
@media screen and (max-width: 550px) {
  .Dashboard{
    .main_Dashboard-app{
      width: 100%;
      height: 150px;
      background-image: url("../../assets/view/main/main_mini.png");
      background-repeat:no-repeat;
      background-size: 100% 100%;
      .download_button{
        left: 2%;
      }
      .dashboardMini {
        display: block;
        height: 150px;
        width: 100%;
      }
      .download_button {
        top: 57%;
        left: 2%;
        .buttonWrapper{
          display: block;
          margin-bottom: 10px;
          &:last-child {
            margin-left: 0px;
          }
          .el-button{
            padding: 5px 20px;
            .icon-button{
              width: 25px;
              height: 25px;
              background-size: 25px;
            }
            .icon-font{
              line-height: 25px;
              font-size: 12px;
            }
          }
        }
      }
    }
    .dashboardContent{
      padding: 0 15px;
      .cardDisplay{
        .el-card{
          .el-card__body{
            .cardStatus{
              .titleWrapper{
                .value{
                  font-size: 15px;
                }
                .title{
                  font-size: 12px;
                }
              }
            }
          }
        }
      }
    }
  }

}
</style>
<style>
  .el-popover__title {
    color: #909399 !important;
    font-size: 16px;
    line-height: 1;
    margin-bottom: 12px;
    text-align: center !important;
  }
  .download_button_IOS>img{
    width: 200px;
    height: 200px;
  }
  .el-button>span{
    display: flex;
  }
  @media screen and (max-width: 890px) {
    .main-container {
      padding-top: 85px;
    }
  }
  @media screen and (max-width: 500px) {
    .main-container {
      padding-top: 65px;
    }
  }
</style>

