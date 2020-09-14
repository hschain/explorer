<template>
  <div class="AccountDetails containerWrap">
    <div class="titleWrapper">
      <h2 class="pageTitle">账户详情</h2>
    </div>
    <div class="address">
      <div class="qrAddress">
        <el-popover placement="bottom-start" trigger="hover" popper-class="showQrCode">
          <div class="qrModal">
            <vue-qr class="qrCode" :text="$route.params.data" :margin="0" :size="128"></vue-qr>
          </div>
          <div slot="reference" class="qrWrapper">
            <img :src="require('@/assets/common/qr_code.svg')" alt />
          </div>
        </el-popover>
        <ul class="addressDisplay">
          <li class="addressLabel">地址</li>
          <li class="addressValue">
            <p>{{ $route.params.data }}</p>
            <img
              @click="copy($route.params.data)"
              :src="require('@/assets/common/copy_btn.svg')"
              alt
            />
          </li>
        </ul>
      </div>
      <div class="statistics">
        <ul class="totalWrapper">
          <li class="addressValue">估值</li>
          <li class="addressDollars">
            $ {{ assetsData[0] ? (assetsData[0].price * assetsData[0].amount).toFixed(6) : "-" }}
          </li>
        </ul>
        <ul class="compareWrapper">
          <li class="addressValue">
            {{
            assetsData[0]
            ? '$ ' + assetsData[0].price + assetsData[0].priceunit
            : "0.00"
            }}
          </li>
          <li
            class="addressDollars"
          >{{ assetsData[0] ? assetsData[0].amount + ' HST' : "-" }}</li>
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
        <el-menu-item class="menuTitle" index="Hashrate">算力</el-menu-item>
      </el-menu>
      <div class="assetTxsTable">
        <el-table
          v-show="activeIndex === 'Assets'"
          :data="assetsData"
          stripe
          style="width: 100%"
          v-loading="loading"
        >
          <el-table-column label="资产" width="150">
            <template slot-scope="scope">
              <div class="nameDetail">
                <div class="icon">
                  <img
                    class="fixedIcon"
                    v-if="scope.row.denom === 'HST'"
                    :src="require('@/assets/common/logo.png')"
                    alt
                  />
                  <img v-else :src="require('@/assets/common/symbol_none.svg')" alt />
                </div>
                <span class="name">
                  {{ scope.row.denom }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="可用余额">
            <template slot-scope="scope">
              <span>
                {{ scope.row.amount }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="冻结余额">
            <template>
              <span>0.00</span>
            </template>
          </el-table-column>
          <el-table-column label="合计余额">
            <template slot-scope="scope">
              <span>
                {{ scope.row.amount }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="汇率">
            <template slot-scope="scope">
              <span>$ {{ scope.row.price }}{{ scope.row.priceunit }}</span>
            </template>
          </el-table-column>
          <el-table-column label="估值">
            <template slot-scope="scope">
              <span>$ {{ (scope.row.price * scope.row.amount).toFixed(6) }}</span>
            </template>
          </el-table-column>
        </el-table>
        <TxsTable v-show="activeIndex === 'Transactions'" :txsList="TransactionsData" />
        <el-table
          v-show="activeIndex === 'Hashrate'"
          :data="hashrateData"
          stripe
          style="width: 100%"
          v-loading="loading"
        >
          <el-table-column label="算力">
            <template slot-scope="scope">
              <span>{{ scope.row.hashrate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="系统总算力">
            <template slot-scope="scope">
              <span>{{ scope.row.totalHashrate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="百分比">
            <template slot-scope="scope">
              <span>{{ scope.row.rate }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { setTxsType } from "@/utils/common";
import vueQr from "vue-qr";
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
      activeIndex: "Assets",
      assetsData: [],
      TransactionsData: [],
      hashrateData: [],
      loading: true,
    };
  },
  created() {
    if (this.$store.state.option.accountDetail) {
      this.loading = false
      this.handleResult(this.$store.state.option.accountDetail)
      this.$store.dispatch("option/getAccountDetail", null);
    } else {
      this.getAccountDetails();
    }
  },
  methods: {
    //获取资产列表
    getAccountDetails() {
      this.$http(this.$api.getAccountDetail, null, this.$route.params.data)
        .then((res) => {
          if (res.code === 200) {
            this.handleResult(res)
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleResult(res) {
      this.assetsData = res.data.result.value.coins;
      this.assetsData.forEach((item) => {
        if (/^u/i.test(item.denom)) {
          item.denom = item.denom.slice(1).toUpperCase();
          item.amount = (item.amount / 1000000).toFixed(6);
        }
        item.price = (item.price*1).toFixed(6)
      });
    },
    // 获取交易列表
    getTransactionsList() {
      this.$http(this.$api.getTransactionsList, {
        address: this.$route.params.data,
      })
        .then((res) => {
          if (res.code === 200 && res.data) {
            this.TransactionsData = res.data;
            this.TransactionsData.forEach((item, i) => {
              if (/^u/i.test(item.messages[0].events.transfer.denom)) {
                item.messages[0].events.transfer.denom = item.messages[0].events.transfer.denom.slice(
                  1
                );
                item.messages[0].events.transfer.amount = (
                  item.messages[0].events.transfer.amount / 1000000
                ).toFixed(6);
              }
              item.type = setTxsType(
                res.data[i].messages[0].events.message.action
              );
            });
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    copy(val) {
      this.$copyText(val)
        .then((res) => {
          this.$message.success("复制成功");
        })
        .catch((err) => {
          this.$message.error("复制失败");
        });
    },
    handleSelect(val) {
      this.activeIndex = val;
      if (
        !this.TransactionsData.length &&
        this.activeIndex === "Transactions"
      ) {
        this.loading = true;
        this.getTransactionsList();
      } else if (!this.hashrateData.length && this.activeIndex === "Hashrate") {
        this.loading = false;
      }
    },
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
  .address {
    border-radius: 5px;
    background-color: #020e46;
    color: #fff;
    padding: 24px 30px;
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: space-between;
    .qrAddress {
      display: flex;
      padding: 6px 0;
      align-items: center;
      .qrWrapper {
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
      .addressDisplay {
        .addressLabel {
          height: 28px;
          font-size: 15px;
          font-weight: 600;
        }
        .addressValue {
          height: 28px;
          font-size: 14px;
          font-weight: 400;
          display: flex;
          align-items: center;
          p {
            margin-right: 8px;
          }
          img {
            cursor: pointer;
            width: 24px;
            height: 24px;
          }
        }
      }
    }
    .statistics {
      display: flex;
      justify-content: flex-end;
      max-width: 100%;
      font-size: 15px;
      font-weight: 400;
      text-align: right;
      color: #fff;
      .totalWrapper {
        padding-right: 20px;
        border-right: 1px solid #4b525d;
        margin-right: 20px;
      }
      .addressValue {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        height: 28px;
      }
      .addressDollars {
        font-size: 18px;
        font-weight: 550;
      }
    }
  }
  .assetTxs {
    margin: 10px 0 70px;
    .menu {
      margin-bottom: 15px;
      .menuTitle {
        padding: 0 60px;
        font-size: 24px;
      }
    }
  }
  .assetTxsTable {
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
    padding: 10px 20px 30px;
    .nameDetail {
      display: flex;
      .icon {
        margin-right: 10px;
        .fixedIcon {
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
      }
      .name {
        line-height: 30px;
      }
    }
  }
}
</style>

<style lang="scss">
.showQrCode {
  .qrModal {
    z-index: 100;
    position: relative;
    padding: 10px;
    border: 2px solid #848e9c;
    .qrCode {
      position: relative;
      z-index: 101;
    }
    &:before {
      position: absolute;
      transform: translate(-50%, -50%);
      left: 50%;
      top: 50%;
      z-index: 99;
      width: calc(101% + 4px);
      height: calc(90% + 4px);
      background: #fff;
      content: "";
    }
    &:after {
      position: absolute;
      transform: translate(-50%, -50%);
      left: 50%;
      top: 50%;
      z-index: 99;
      width: calc(90% + 4px);
      height: calc(101% + 4px);
      background: #fff;
      content: "";
    }
  }
}
</style>
