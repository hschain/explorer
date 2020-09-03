<template>
  <div class="TransactionDetails containerWrap">
    <div class="titleWrapper">
      <h2 class="pageTitle">交易详情</h2>
    </div>
    <div class="firstContainer containerWrapper">
      <div class="containerTitle">交易信息</div>
      <div class="containerDetail">
        <ul class="infoRow" v-for="(item,name) in Information" :key="name">
          <li class="infoLabel">{{InformationLabel[name]}}</li>
          <li class="infoValue">
            <img
              v-show="name === 'Status' && item"
              :src="require('@/assets/common/success_ic.svg')"
              alt
            />
            <img
              v-show="name === 'Status' && !item"
              :src="require('@/assets/common/fail_ic.svg')"
              alt
            />
            <el-link
              type="primary"
              :underline="false"
              v-if="name === 'Height'"
              @click="getBlockDetails()"
            >{{item}}</el-link>
            <div style="display:inline-block" v-else-if="name === 'Status'">{{item ? '成功' : '失败'}}</div>
            <span v-else>{{item}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="secondContainer containerWrapper">
      <div class="containerTitle">交易内容</div>
      <div class="TxMessageWrapper">
        <div class="TxMessageType">
          <img :src="require('@/assets/common/msgsic_2.svg')" alt />
          <span>{{Information.type}}</span>
        </div>
        <div class="TxMessage">
          <div class="TxMessage_toValue">
            <div class="TxMessage_label">去向 / 交易值</div>
            <div class="TxMessage_contentWrapper">
              <div class="TxMessage_content">
                <ul class="TxMessage_show">
                  <li class="TxMessage_label">去向</li>
                  <li class="TxMessage_value">
                    <el-link type="primary" :underline="false">{{Msgs.To}}</el-link>
                  </li>
                </ul>
                <ul class="TxMessage_show">
                  <li class="TxMessage_label">交易值</li>
                  <li class="TxMessage_value">
                    <span>{{Msgs.amount}}{{Msgs.denom}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <ul class="InfoRow">
            <li class="InfoRow_label">来源</li>
            <li class="InfoRow_value">{{Msgs.From}}</li>
          </ul>
          <ul class="InfoRow">
            <li class="InfoRow_label">交易备注</li>
            <li class="InfoRow_value">{{Msgs.memo}}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TransactionDetails",
  data() {
    return {
      Information: {
        TxHash:
          "C0A6C5B3F784D4C5FF339C026533B0CE6DE103352343C7BC4F229A826183AF71",
        Status: true,
        Height: "579113",
        Time: "2h ago ( 2020-09-03 / 14:45:43 )",
      },
      InformationLabel: {
        TxHash: "交易hash值",
        Status: "状态",
        Height: "区块高度",
        Time: "交易时间",
      },
      Msgs: {
        type: "Transfer",
        To: "hsc1mv98ptkrhdpp5r4d9n782dqrvua4pds2rwhsvr",
        From: "hsc1mv98ptkrhdpp5r4d9n782dqrvua4pds2rwhsvr",
        amount: 1,
        denom: "HST",
        memo: 'test-hst'
      }
    };
  },
  methods: {
    //获取列表
    getTransactionDetails() {
      
    },
    getBlockDetails() {
      this.$router.push("/blockDetails");
    },
  },
};
</script>

<style lang="scss" scope>
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
              .TxMessage_show:first-child {
                height: fit-content;
              }
              .TxMessage_show:last-child {
                margin-bottom: 0;
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
