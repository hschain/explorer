<template>
  <div class="AccountDetails containerWrap">
    <div class="titleWrapper">
      <h2 class="pageTitle">
        账户详情
      </h2>
    </div>
    <div class="address">
      <div class="qrAddress">
        <el-tooltip class="item" effect="light"  placement="bottom-start">
          <div slot="content" class="qrModal">
            <vue-qr v-if="showQr" class="qrCode" :text="$route.params.data" :margin="0" :size="128"></vue-qr>
          </div>
          <div @mouseenter="showQrCode" class="qrWrapper">
            <img :src="require('@/assets/common/qr_code.svg')" alt="">
          </div>
        </el-tooltip>
        <ul class="addressDisplay">
          <li class="addressLabel">
            地址
          </li>
          <li class="addressValue">
            <p>{{$route.params.data}}</p>
            <img @click="copy($route.params.data)" :src="require('@/assets/common/copy_btn.svg')" alt="">
          </li>
        </ul>
      </div>
      <div class="statistics">
        <ul class="totalWrapper">
          <li class="addressValue">估值</li>
          <li class="addressDollars">$ {{assetsData[0] ? (assetsData[0].price * assetsData[0].amount/1000000).toFixed(6) : '-' }}</li>
        </ul>
        <ul class="compareWrapper">
          <li class="addressValue">{{assetsData[0] ? assetsData[0].price + assetsData[0].priceunit : '0.00'}}</li>
          <li class="addressDollars">{{assetsData[0] ? assetsData[0].amount : '-' }}</li>
        </ul>
      </div>
    </div>
    <div class="assetTxs">
      <el-menu 
        :default-active="activeIndex" 
        class="menu" 
        @select="handleSelect"
        mode="horizontal" 
        background-color="transparent"
        text-color="#b2b6bc"
        active-text-color="#222"
      >
        <el-menu-item class="menuTitle" index="Assets">资产</el-menu-item>
        <el-menu-item class="menuTitle" index="Transactions">交易</el-menu-item>
      </el-menu>
      <div class="assetTxsTable">
        <el-table v-show="activeIndex === 'Assets'" :data="assetsData" stripe style="width: 100%">
          <el-table-column prop="denom" label="资产" width="150">
            <template slot-scope="scope">
              <div class="nameDetail">
                <div class="icon">
                  <img class="fixedIcon" v-if="scope.row.denom === 'uhst'" :src="require('@/assets/common/logo.png')" alt="">
                  <img v-else :src="require('@/assets/common/symbol_none.svg')" alt="">
                </div>
                <span class="name">{{scope.row.denom === 'uhst' ? 'hst' : scope.row.denom }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="value" label="合计余额">
            <template slot-scope="scope">
              <span>{{scope.row.denom === 'uhst' ? (scope.row.price*scope.row.amount/1000000).toFixed(6) : (scope.row.price*scope.row.amount).toFixed(6) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="汇率">
            <template slot-scope="scope">
              <span>{{scope.row.price}}{{scope.row.priceunit}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="可用余额">
            <template slot-scope="scope">
              <span>{{scope.row.denom === 'uhst' ? (scope.row.amount/1000000).toFixed(6) : scope.row.amount }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="冻结余额">
            <template>
              <span>0</span>
            </template>
          </el-table-column>
        </el-table>
        <TxsTable v-show="activeIndex === 'Transactions'" :txsList="TransactionsData" />
      </div>
    </div>
  </div>
</template>

<script>
import { setTxsType } from "@/utils/common";
import vueQr from 'vue-qr'
import TxsTable from "@/components/TxsTable/TxsTable";
export default {
  name: "AccountDetails",
  components: {
    vueQr,
    TxsTable,
  },
  data() {
    return {
      showQr: false,
      activeIndex: 'Assets',
      assetsData: [],
      TransactionsData: [],
    };
  },
  created() {
    this.getAccountDetails();
  },
  methods: {
    //获取资产列表
    getAccountDetails() {
      this.$http(this.$api.getAccountDetail, null, this.$route.params.data).then( res => {
        if(res.code === 200) {
          this.assetsData = res.data.result.value.coins
        }
      })
    },
    // 获取交易列表
    getTransactionsList() {
      this.$http(this.$api.getTransactionsList, null, this.$route.params.data).then((res) => {
        if (res.code === 200) {
          if(res.data) {
            this.TransactionsData = res.data;
            this.TransactionsData.forEach((item, i) => {
              item.type = setTxsType(
                res.data[i].messages[0].events.message.action
              );
            });
          }
        }
      });
    },
    showQrCode() {
      setTimeout( ()=> {
        this.showQr = true
      },50)
    },
    copy(val) {
      this.$copyText(val).then(res => {
        this.$message.success('复制成功')
      }).catch(err => {
        this.$message.error('复制失败')
      })
    },
    handleSelect(val) {
      this.activeIndex = val
      if(!this.TransactionsData.length) {
        this.getTransactionsList();
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.AccountDetails {
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
  .address{
    border-radius: 5px;
    background-color: #222;
    color: #fff;
    padding: 24px 30px;
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: space-between;
    .qrAddress{
      display: flex;
      padding: 6px 0;
      align-items: center;
      .qrWrapper{
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50.4px;
        height: 50.4px;
        border-radius: 5px;
        border: 1px solid #e6e6e6;
        background-color: #fff;
        cursor: pointer;
        margin-right: 20.6px;
      }
      .addressDisplay{
        .addressLabel{
          height: 28px;
          font-size: 15px;
          font-weight: 600;
        }
        .addressValue{
          height: 28px;
          font-size: 14px;
          font-weight: 400;
          display: flex;
          align-items: center;
          p{margin-right: 8px}
          img{
            cursor: pointer;
            width: 24px;
            height: 24px;
          }
        }
      }
    }
    .statistics{
      display: flex;
      justify-content: flex-end;
      max-width: 100%;
      font-size: 15px;
      font-weight: 400;
      text-align: right;
      color: #fff;
      .totalWrapper{
        padding-right: 20px;
        border-right: 1px solid #4b525d;
        margin-right: 20px;
      }
      .compareWrapper{

      }
      .addressValue{
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
      }
      .addressDollars{
        font-size: 20px;
        font-weight: 550
      }
    }
  }
  .assetTxs{
    margin: 10px 0 70px;
    .menu{
      margin-bottom: 15px;
      .menuTitle{
        padding: 0 60px;
        font-size: 24px
      }
    }
  }
  .assetTxsTable{
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 3px 6px 0 rgba(0,0,0,.16);
    padding: 10px 20px 30px;
  }
}
</style>

<style lang="scss">
.el-tooltip__popper{
  .qrModal{
    z-index: 100;
    position: relative;
    padding: 10px;
    border: 2px solid #848e9c;
    .qrCode{
      position: relative;
      z-index: 101;
    }
    &:before{
      position: absolute;
      transform: translate(-50%, -50%);
      left: 50%;
      top: 50%;
      z-index: 99;
      width: calc(101% + 4px);
      height: calc(90% + 4px);
      background: #fff;
      content: ''
    }
    &:after{
      position: absolute;
      transform: translate(-50%, -50%);
      left: 50%;
      top: 50%;
      z-index: 99;
      width: calc(90% + 4px);
      height: calc(101% + 4px);
      background: #fff;
      content: ''
    }
  }
}
</style>