<template>
  <div class="Dashboard">
    <div class="main_Dashboard">
      <img src="@/assets/view/main_dashboard.png" alt="" />
    </div>
    <div class="dashboardContent">
      <div class="cardDisplay">
        <div class="cardBox" v-for="item in cardList" :key="item.value">
          <div class="cardStatus">
            <div class="titleWrapper">
              <div class="title">{{ item.title }}</div>
              <div class="value">{{ item.value }}</div>
            </div>
            <div class="contentWrapper">{{ item.lastTime }}</div>
          </div>
        </div>
      </div>
      <div class="BlockTxWrapper">
        <Blocks />
        <Transactions />
      </div>
    </div>
  </div>
</template>

<script>
import Blocks from "./Blocks";
import Transactions from "./Transactions";
export default {
  name: "Dashboard",
  components: { Blocks, Transactions },
  data() {
    return {
      cardList: [
        {
          title: "价格",
          value: "421,552",
          lastTime: "Last 7h ago"
        },
        {
          title: "价格",
          value: "431,552",
          lastTime: "Last 7h ago"
        },
        {
          title: "价格",
          value: "521,552",
          lastTime: "Last 7h ago"
        },
        {
          title: "价格",
          value: "121,552",
          lastTime: "Last 7h ago"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scope>
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
    max-width: 1200px;
    padding: 0 50px;
    @media screen and (max-width: 1100px) {
      max-width: 800px;
    }
    .cardDisplay {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      @media screen and (max-width: 1100px) {
        grid-template-rows: 1fr 1fr;
        grid-template-columns: 1fr 1fr;
      }
      grid-gap: 10px;
      .cardBox {
        min-height: calc(100% - 12px);
        padding: 15px 20px;
        border-radius: 5px;
        background-color: #fff;
        box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
        margin-bottom: 12px;
        .cardStatus {
          display: flex;
          font-family: Montserrat;
          .titleWrapper {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 70px;
            .title {
              font-size: 13px;
              color: #4b525d;
            }
            .value {
              font-size: 18px;
              color: #222;
              font-weight: 500;
              line-height: 1.2;
            }
          }
          .contentWrapper {
            flex: 1;
            display: flex;
            flex-direction: column-reverse;
            font-size: 13px;
            align-items: flex-end;
            color: #4b525d;
          }
        }
      }
    }
    .BlockTxWrapper {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr;
      grid-column-gap: 15px;
      grid-row-gap: 15px;
      @media screen and (max-width: 1100px) {
        grid-template-rows: 1fr 1fr;
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>
