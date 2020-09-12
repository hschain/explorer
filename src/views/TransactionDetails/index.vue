<template>
  <div class="TransactionDetails containerWrap">
    <div class="titleWrapper">
      <h2 class="pageTitle">交易详情</h2>
    </div>
    <el-card shadow="never" class="firstContainer containerWrapper">
      <div class="containerTitle">交易信息</div>
      <div class="containerDetail">
        <ul class="infoRow" v-for="(item,name) in Information" :key="name">
          <li class="infoLabel">{{InformationLabel[name]}}</li>
          <li class="infoValue">
            <img
              v-if="name === 'status' && item"
              :src="require('@/assets/common/success_ic.svg')"
              alt
            />
            <img
              v-else-if="name === 'status' && !item"
              :src="require('@/assets/common/fail_ic.svg')"
              alt
            />
            <el-link
              type="primary"
              :underline="false"
              v-if="name === 'height'"
              @click="getBlockDetails(item)"
            >{{item}}</el-link>
            <div style="display:inline-block" v-else-if="name === 'status'">{{item ? '成功' : '失败'}}</div>
            <span v-else>{{item}}</span>
          </li>
        </ul>
      </div>
    </el-card>
    <el-card shadow="never" class="secondContainer containerWrapper">
      <div class="containerTitle">交易内容</div>
      <div class="TxMessageWrapper">
        <div class="TxMessageType">
          <img :src="require('@/assets/common/msgsic_2.svg')" alt />
          <span>{{Msgs.type}}</span>
        </div>
        <div class="TxMessage">
          <div class="TxMessage_toValue" v-if="Msgs.action === 'send'">
            <div class="TxMessage_label">去向 / 交易值</div>
            <div class="TxMessage_contentWrapper">
              <div class="TxMessage_content">
                <ul class="TxMessage_show">
                  <li class="TxMessage_label">去向</li>
                  <li class="TxMessage_value">
                    <el-link
                      type="primary"
                      :underline="false"
                      @click="() => this.$router.push({ path: `/account/${Msgs.to}` })"
                    >{{Msgs.to}}</el-link>
                  </li>
                </ul>
                <ul class="TxMessage_show">
                  <li class="TxMessage_label">交易值</li>
                  <li class="TxMessage_value">
                    <span>{{Msgs.amount}} {{Msgs.denom}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <ul v-else-if="Msgs.action === 'create_validator'" class="InfoRow">
            <li class="InfoRow_label">验证者</li>
            <li class="InfoRow_value">{{Msgs.validator}}</li>
          </ul>
          <ul class="InfoRow">
            <li class="InfoRow_label">来源</li>
            <li class="InfoRow_value">{{Msgs.from}}</li>
          </ul>
          <ul class="InfoRow">
            <li class="InfoRow_label">交易备注</li>
            <li class="InfoRow_value">{{Msgs.memo || '-'}}</li>
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
        tx_hash: "交易hash值",
        status: "状态",
        height: "区块高度",
        timestamp: "交易时间",
      },
      Msgs: {
        type: "Transfer",
        to: "hsc1mv98ptkrhdpp5r4d9n782dqrvua4pds2rwhsvr",
        from: "hsc1mv98ptkrhdpp5r4d9n782dqrvua4pds2rwhsvr",
        amount: 1,
        denom: "HST",
        memo: "test-hst",
      },
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
        "",
        this.$route.params.data
      ).then((res) => {
        if (res.code === 200) {
          this.handleResult(res);
        }
      });
    },
    //处理获取的结果
    handleResult(res) {
      let time = formatTime(res.data[0].timestamp, true);
      this.Information = {
        tx_hash: res.data[0].tx_hash,
        status: res.data[0].messages[0].success,
        height: res.data[0].height,
        timestamp:
          formatTime(res.data[0].timestamp) +
          " ( " +
          formatTime(res.data[0].timestamp, true) +
          " )",
      };
      this.Msgs = {
        type: setTxsType(res.data[0].messages[0].events.message.action),
        action: res.data[0].messages[0].events.message.action,
        from: res.data[0].messages[0].events.message.sender,
        memo: res.data[0].memo,
      };
      if (this.Msgs.action === "send") {
        this.Msgs.to = res.data[0].messages[0].events.transfer.recipient;
        if (/^u/i.test(res.data[0].messages[0].events.transfer.denom)) {
          this.Msgs.denom = res.data[0].messages[0].events.transfer.denom.slice(1)
          this.Msgs.amount = (res.data[0].messages[0].events.transfer.amount/1000000).toFixed(6)
        } else {
          this.Msgs.denom = res.data[0].messages[0].events.transfer.denom;          
          this.Msgs.amount = res.data[0].messages[0].events.transfer.amount;
        }
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
          height: fit-content;
          display: flex;
          flex-flow: row;
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
            padding: 15px 20px;
            max-height: 300px;
            width: calc(100% - 203px);
            border-radius: 5px;
            background-color: #f9fafc;
            .TxMessage_content {
              max-height: 245px;
              overflow-y: auto;
              display: flex;
              flex-flow: row;
              align-items: center;
              justify-content: space-between;
              align-items: flex-start;
              .TxMessage_show {
                .TxMessage_label {
                  height: 18px;
                  font-size: 13px;
                  font-weight: 400;
                  line-height: 2.31;
                  text-align: left;
                  color: #89909b;
                  margin-bottom: 15px;
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
                  display: flex;
                  flex-flow: column;
                }
              }
              .TxMessage_show:last-child {
                .TxMessage_label {
                  text-align: right;
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
            color: #4b525d;
            overflow-wrap: break-word;
          }
        }
      }
    }
  }
}
</style>
