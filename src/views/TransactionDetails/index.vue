<template>
  <div class="TransactionDetails containerWrap">
    <div class="titleWrapper">
      <h2 class="pageTitle">{{ $t('transactionsDetail.title') }}</h2>
    </div>
    <el-card shadow="never" class="firstContainer containerWrapper">
      <div class="containerTitle">{{ $t('transactionsDetail.transactionsInfo') }}</div>
      <div class="containerDetail">
        <ul class="infoRow" v-for="(item,name) in Information" :key="name">
          <li class="infoLabel">{{InformationLabel[name]}}</li>
          <li class="infoValue">
            <img v-if="name === 'status' && item" :src="require('@/assets/common/success_ic.svg')" alt/>
            <img v-else-if="name === 'status' && !item" :src="require('@/assets/common/fail_ic.svg')" alt/>
            <el-link type="primary" :underline="false" v-if="name === 'height'" @click="getBlockDetails(item)">{{item}}</el-link>
            <div style="display:inline-block" v-else-if="name === 'status'">{{item ? $t('status.success') : $t('status.fail')}}</div>
            <span v-else>{{item}}</span>
          </li>
        </ul>
      </div>
    </el-card>
    <el-card shadow="never" class="secondContainer containerWrapper">
      <div class="containerTitle">{{ $t('transactionsDetail.transactionsContent') }}</div>
      <div class="TxMessageWrapper">
        <div class="TxMessageType">
          <img :src="require('@/assets/common/msgsic_2.svg')" alt />
          <span>{{Msgs.type}}</span>
        </div>
        <div v-if="Information.status" class="TxMessage">
          <ul class="InfoRow">
            <li class="InfoRow_label">{{ $t('transactionsDetail.transactionsOrigin') }}</li>
            <li>
              <el-link type="primary" class="InfoRow_value" :underline="false" @click="() => this.$router.push({ path: `/account/${Msgs.from}` })">{{Msgs.from}}</el-link>
            </li>
          </ul>
          <div class="TxMessage_toValue" v-if="Msgs.action === 'send' || Msgs.action === 'issue'">
<!--            <div class="TxMessage_label">去向 / 交易值</div>-->
            <div class="TxMessage_contentWrapper">
              <div class="TxMessage_content">
                <ul class="TxMessage_show">
                  <li class="TxMessage_label">{{ $t('transactionsDetail.transactionsWhereabouts') }}</li>
                  <li class="TxMessage_value">
                    <el-link type="primary" :underline="false" @click="() => this.$router.push({ path: `/account/${Msgs.to}` })">{{Msgs.to}}</el-link>
                  </li>
                </ul>
                <ul class="TxMessage_show">
                  <li class="TxMessage_label">{{ $t('transactionsDetail.transactionsValue') }}</li>
                  <li class="TxMessage_value" style="color: #4b525d;">
                    <span>{{Msgs.amount}} {{Msgs.denom}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <ul v-else-if="Msgs.action === 'create_validator'" class="InfoRow">
            <li class="InfoRow_label">{{ $t('transactionsDetail.verifier') }}</li>
            <li class="InfoRow_value">{{Msgs.validator}}</li>
          </ul>
          <ul class="InfoRow">
            <li class="InfoRow_label">{{ $t('transactionsDetail.transactionNotes') }}</li>
            <li class="InfoRow_value">{{Msgs.memo || '-'}}</li>
          </ul>
        </div>
        <div v-else class="TxMessage">
          <ul class="InfoRow">
            <li class="InfoRow_label">{{ $t('transactionsDetail.failReason') }}</li>
            <li class="InfoRow_value">{{Msgs.errorInfo || '-'}}</li>
          </ul>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { formatTime } from "@/utils";
import { setTxsType } from "@/utils/common";
export default {
  name: "TransactionDetails",
  data() {
    return {
      Information: {},
      InformationLabel: {
        tx_hash: this.$t('transactionsDetail.transactionsHash'),
        status: this.$t('transactionsDetail.transactionsStatus'),
        height: this.$t('transactionsDetail.blocksHeight'),
        timestamp: this.$t('transactionsDetail.transactionsTime')
      },
      Msgs: {},
    };
  },
  created() {
    if (this.$store.state.option.transactionData) {
      this.handleResult(this.$store.state.option.transactionData);
      this.$store.dispatch("option/getTransactionData", null);
    } else {
      this.getTransactionDetails();
    }
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
    getTransactionDetails() {
      this.$http(
        this.$api.getTransactionsList,
        '',
        this.$route.params.data
      ).then((res) => {
        if (res.code === 200) {
          this.handleResult(res);
        }
      });
    },
    // 处理获取的结果
    handleResult(res) {
      let time = formatTime(res.data[0].timestamp, true);
      this.Information = {
        tx_hash: res.data[0].tx_hash,
        status: res.data[0].messages[0].success,
        height: res.data[0].height,
        timestamp:
          formatTime(res.data[0].timestamp) +
           '('  +
          formatTime(res.data[0].timestamp, true) +
           ')',
      };
      this.Msgs = {
        type: setTxsType(res.data[0].messages[0].events.message.action),
        action: res.data[0].messages[0].events.message.action,
        from: res.data[0].messages[0].events.message.sender,
        memo: res.data[0].memo,
      };
      if (this.Msgs.action === "send" && this.Information.status) {
        this.Msgs.to = res.data[0].messages[0].events.transfer.recipient;
        console.log(this.Msgs.to)
        if (/^u/i.test(res.data[0].messages[0].events.transfer.denom)) {
          // console.log(res.data[0].messages[0].events.transfer.denom)
          this.Msgs.denom = res.data[0].messages[0].events.transfer.denom.slice(
            1
          );
          this.Msgs.amount = (
            res.data[0].messages[0].events.transfer.amount / 1000000
          ).toFixed(6);
        } else {
          this.Msgs.denom = res.data[0].messages[0].events.transfer.denom;
          this.Msgs.amount = res.data[0].messages[0].events.transfer.amount;
        }
      } else if (this.Msgs.action === "send" && !this.Information.status) {
        this.Msgs.errorInfo = JSON.parse(res.data[0].messages[0].log).message
      } else {
        this.Msgs.validator =
          res.data[0].messages[0].events.create_validator.validator;
      }
    },

    getBlockDetails(item) {
      this.$router.push({ path: `/blocks/${item}` });
    },
  },
};
</script>

<style lang="scss" scoped>
.TransactionDetails {
  .secondContainer {
    .TxMessageWrapper {
      margin: 20px;
      border-radius: 5px;
      border: 1px solid #e6e6e6;
      .TxMessageType {
        height: 48px;
        border-bottom: 1px solid #e6e6e6;
        display: flex;
        align-items: center;
        padding-left: 15px;
        font-size: 15px;
        font-weight: 400;
        line-height: 2.67;
        text-align: left;
        color: #222;
      }
      .TxMessage {
        padding: 15px 20px;
        .TxMessage_toValue {
          width: 100%;
          height: auto;
          display: block;
          //flex-flow: row;
          align-items: center;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
          .TxMessage_label {
            height: 20px;
            font-size: 15px;
            font-weight: 500;
            text-align: left;
            color: #222;
          }
          .TxMessage_contentWrapper {
            padding: 0px 0px;
            max-height: 300px;
            //width: calc(100% - 203px);
            width: 100%;
            border-radius: 5px;
            background-color: #f9fafc;
            .TxMessage_content {
              //max-height: 245px;
              height: auto;
              //overflow-y: auto;
              //display: block;
              //flex-flow: row;
              align-items: center;
              justify-content: space-between;
              align-items: flex-start;
              .TxMessage_show {
                display: grid;
                grid-template-rows: 20px;
                grid-template-columns: 210px 1fr;
                margin: 10px 0;
                //display: flex;
                //flex-flow: row;
                .TxMessage_label {
                  height: 18px;
                  //line-height: 18px;
                  font-size: 13px;
                  font-weight: 400;
                  line-height: 18px;
                  text-align: left;
                  color: #222;
                  //margin: 15px;
                }
                .TxMessage_value {
                  min-width: 260px;
                  height: fit-content;
                  font-size: 15px;
                  font-weight: 400;
                  text-align: left;
                  color: #4b525d;
                  overflow-wrap: break-word;
                  min-width: 50px;
                  color: #222;
                  word-break: break-word;
                  flex-flow: column;
                }
              }
              .TxMessage_show:last-child {
                .TxMessage_label {
                  //text-align: right;
                }
              }
            }
          }
        }
        .InfoRow {
          display: grid;
          grid-template-rows: 20px;
          grid-template-columns: 210px 1fr;
          margin: 10px 0;
          .InfoRow_label {
            font-size: 15px;
            text-align: left;
          }
          .InfoRow_value {
            min-width: 260px;
            height: fit-content;
            font-weight: 400;
            overflow-wrap: break-word;
          }
        }
      }
    }
  }

  @media (max-width: 890px) and (min-width: 100px){
    .el-card__body{
      .TxMessageWrapper{
        margin: 20px 0;
        .TxMessage{
          padding: 15px 5px;
          .InfoRow{
            display: block;
            .InfoRow_value{
              word-break: normal;
              display: block;
              //margin-left: 30px;
            }
          }
          .TxMessage_toValue{
            .TxMessage_contentWrapper{
              .TxMessage_content{
                .TxMessage_show{
                  display: block;
                  .TxMessage_value{
                    .el-link{
                      word-break: normal;
                      display: block;
                      //margin-left: 30px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    .el-table--fit{
      width: auto !important;
    }
  }
}
</style>
