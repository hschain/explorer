<template>
  <div class="Dashboard">
    <div class="main_Dashboard main_Dashboard-app main_Dashboard-pc">
      <!-- banner文本 -->
      <div class="banner-content">
        <!-- <div class="banner-title">HSChain</div> -->
        <div class="banner-desc">{{ $t('bannerDesc.bannerDesc') }}</div>

        <!-- 搜索框 -->
        <div class="searchBar_toolBar">

          <!-- <div class="clear" /> -->
          <div class="searchBar_selectWarpper searchBar_input">
            <el-select v-model="selectValue" class="select" placeholder="" @change="selectOption">
              <template slot="prefix" />
              <el-option v-for="(item, index) of selectStatus" :key="index" :label="item.name" :value="item.name" />
            </el-select>
            <el-input v-model="keyword" :placeholder="$t('header.searchPlaceholder')" class="inputMargin" clearable
              @keyup.enter.native="querykeyword()">
              <el-button slot="append" icon="el-icon-search" @click="querykeyword()">{{ $t('header.search') }}</el-button>
            </el-input>
          </div>

        </div>

      </div>
      <div class="download_button">
        <el-popover class="buttonWrapper" placement="bottom" width="175" trigger="click" :disabled="!isPc">
          <div class="download_button_box">
            <img class="qrcode" src="@/assets/app_QRCode/DownloadQRCode.png" style="width: 150px; height: 150px" alt>
          </div>
          <el-button type="success" slot="reference" @click="download('ios')">
            <span class="icon-button MobilePhone"></span>
            <span class="icon-font">{{ $t('dashboard.clickDownUpload') }}</span>
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
  import {
    currencyFormat
  } from "@/utils";
  import {
    setDelayTimer
  } from "@/utils/common";
  export default {
    name: "Dashboard",
    components: {
      Blocks,
      Transactions
    },
    data() {
      return {
        timer: null,
        update: true,
        isPc: true, //是否为pc打开网页
        visibles: false,
        cardData: {
          height: {
            title: this.$t('dashboard.blocksHeight'),
            value: '0'
          },
          transfer: {
            title: this.$t('dashboard.transactionsNumber'),
            value: '0'
          },
          tps: {
            title: this.$t('dashboard.transactionsPerSecond'),
            value: '0'
          },
          total_circulation_supply: {
            title: this.$t('dashboard.circulation'),
            value: '0'
          },
          current_day_provisions: {
            title: this.$t('dashboard.dailyOutput'),
            value: '0'
          },
          usersNumber: {
            title: this.$t('dashboard.subscribers'),
            value: '0'
          }
        },
        // 搜索框
        selectValue: 'hschain',
        selectStatus: [],
        keyword: '',
      }
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
          if (res.code === 200) {
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
      currencyFormat(val) {
        return currencyFormat(val, true)
      },
      download(form) {
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
      },
      // 搜索框
      selectOption(val) {
        this.selectStatus.forEach(item => {
          if (item.name === val) {
            window.open(item.url)
          }
        })
        this.selectValue = this.localName
      },
      // 查询内容
      querykeyword() {
        // 去除首尾空格
        this.keyword = this.keyword.replace(/(^\s*)|(\s*$)/g, '')

        if (/^\d+$/g.test(this.keyword)) {
          // 纯数字直接查询区块信息
          this.$http(this.$api.getBlocksList, '', this.keyword).then(res => {
            if (res.code === 200 && res.data) {
              this.$store.dispatch('option/getBlockData', res)
              this.$router.push({
                path: `/blocks/${this.keyword}`
              })
            } else {
              this.$message.error(this.$t('tip.noResult'))
            }
          })
        } else if (/^hsc/i.test(this.keyword)) {
          // hsc开头查询账户信息
          this.$http(this.$api.getAccountDetail, null, this.keyword).then(res => {
            if (res.code === 200 && res.data) {
              this.$store.dispatch('option/getAccountDetail', res)
              this.$router.push({
                path: `/account/${this.keyword}`
              })
            } else {
              this.$message.error(this.$t('tip.noResult'))
            }
          })
        } else if (this.keyword.length === 64) {
          // 长度为64时查询交易信息或者区块信息
          this.$http(this.$api.getTransactionsList, null, this.keyword).then(res => {
            if (res.code === 200 && res.data) {
              this.$store.dispatch('option/getTransactionData', res)
              this.$router.push({
                path: `/transactions/${this.keyword}`
              })
            } else {
              this.$http(this.$api.getBlocksList, '', this.keyword).then(res => {
                if (res.code === 200 && res.data) {
                  this.$store.dispatch('option/getBlockData', res)
                  this.$router.push({
                    path: `/blocks/${this.keyword}`
                  })
                } else {
                  this.$message.error(this.$t('tip.noResult'))
                }
              })
            }
          })
        } else {
          // this.$message.error(this.$t('tip.noMsg'));
        }
      },
    }
  };
</script>

<style lang="scss">
  .Dashboard {
    .main_Dashboard-pc {
      width: 100%;
      height: 350px;
      background-image: url("../../assets/view/main/banner.jpg");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      display: flex;
      justify-content: center;
      position: relative;

      .dashboardImg {
        width: auto;
      }

      .download_button {
        position: absolute;
        top: 65%;
        left: 23%;
        width: auto;
        height: auto;

        .buttonWrapper {
          &:last-child {
            margin-left: 20px;
          }

          .download_button_box {
            .qrcode {}
          }

          .el-button {
            padding: 5px 25px;
            display: inline-block;
            border-color: #1576E5;
            background: #1576E5;
            border-radius: 25px;

            .icon-button {
              width: 35px;
              height: 35px;
              margin-right: 10px;
            }

            .MobilePhone {
              background: url("../../assets/app_QRCode/MobilePhone.png");
              background-size: 35px;
            }

            .icon-font {
              line-height: 35px;
              color: #fff;
              font-size: 15px;
            }
          }
        }
      }

      .banner-content {
        // width: 375px;
        text-align: left;
        color: #fff;
        position: absolute;
        top: 24%;
        left: 23.5%;

        .banner-title {
          font-size: 48px;
          font-weight: bold;
        }

        .banner-desc {
          font-size: 40px;
          margin-top: 8px;
        }

        .select {
          width: 120px;
        }
        .searchBar_toolBar{
          display: none;
          margin-top: 10px;
        }
      }

      @media screen and (max-width: 1400px) {
        .banner-content {
          left: 5%;
        }

        .download_button {
          left: 5%;
        }
      }

      @media screen and (max-width: 1500px) {
        .banner-content {
          left: 10%;
        }

        .download_button {
          left: 10%;
        }
      }
    }

    @media screen and (max-width: 890px) {
      .main_Dashboard-app {
        width: 100%;
        height: 250px;
        // background-image: url("../../assets/view/main/main_mini.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        margin-top: 0px;

        .banner-content {
          left: 4%;
          top: 10%;

          .banner-desc {
            font-size: 24px;
          }

          .searchBar_toolBar {
            display: block;
            div {
              // display: inline-flex;
            }

            .searchBar_input {
              display: flex;
              margin-top: 5px;
            }
          }


        }

        .download_button {
          left: 2%;

          .buttonWrapper {
            .download_button_box {
              border: 1px solid salmon;
              display: none;
            }
          }
        }
      }

      .el-input__inner{
          height: 34px;
          line-height: 34px;
          // margin-left: 5px;
      }

      .inputMargin{
        .el-input__inner{
          margin-left: 5px;
        }
      }
      .el-input-group{
        flex: 1;
        padding-right: 15px;
      }
      .el-input__icon{
        line-height: 28px;
      }
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

            img {
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

  .el-popper {
    width: 225px;
    position: absolute;
    top: 471px;
    left: 317px;
    transform-origin: center bottom;
    z-index: 2001;
  }

  @media screen and (max-width: 800px) {
    .el-popover {
      display: none;
    }

    .Dashboard {
      .main_Dashboard {
        .dashboardImg {
          display: none;

          .main_Dashboard {
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

        .download_button {
          top: 65%;
          //left: 2%;
        }
      }
    }
  }

  @media (min-width: 801px) {
    .dashboardMini {
      display: none;
    }
  }

  @media screen and (max-width: 550px) {
    .Dashboard {
      .main_Dashboard-app {
        width: 100%;
        height: 150px;
        background-image: url("../../assets/view/main/banner.jpg");
        background-repeat: no-repeat;
        background-size: 100% 100%;

        .banner-content {
          // width: 187px;
          left: 2%;
          // top: 23%;

          .banner-title {
            font-size: 24px;
          }

          .banner-desc {
            font-size: 14px;
            margin-top: 0;
          }


        }

        .download_button {
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

          .buttonWrapper {
            display: block;
            margin-bottom: 10px;

            &:last-child {
              margin-left: 0px;
            }

            .el-button {
              padding: 5px 20px;

              .icon-button {
                width: 25px;
                height: 25px;
                background-size: 25px;
              }

              .icon-font {
                line-height: 25px;
                font-size: 12px;
              }
            }
          }
        }
      }

      .dashboardContent {
        padding: 0 15px;

        .cardDisplay {
          .el-card {
            .el-card__body {
              .cardStatus {
                .titleWrapper {
                  .value {
                    font-size: 15px;
                  }

                  .title {
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

  .download_button_IOS>img {
    width: 200px;
    height: 200px;
  }

  .el-button>span {
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
