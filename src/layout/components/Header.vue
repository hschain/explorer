<template>
  <header class="header">
    <div class="searchBar">
      <div class="searchBar_toolBar">
        <a class="mainLink" href="/explorer/">
          <img src="@/assets/header/hstlogo.png" alt="" />
        </a>
        <div class="searchBar_selectWarpper">
          <el-select class="select" v-model="selectValue">
            <el-option
              v-for="(item, index) of selectStatus"
              :key="index"
              :label="item.status"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-model="keyword"
            placeholder="查询区块，交易，地址详情等…"
            class="inputMargin"
            clearable
            @keyup.enter.native="querykeyword()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="querykeyword()"
              >查询</el-button
            >
          </el-input>
        </div>
      </div>
    </div>
    <div class="SubHeader">
      <div class="SubHeader__nav">
        <el-menu
          :default-active="activeIndex"
          class="el-menu"
          mode="horizontal"
          @select="handleSelect"
          :router="true"
          active-text-color="#ffd04b"
        >
          <el-menu-item
            v-for="item in menu"
            :index="item.path"
            :key="item.meta.title"
          >
            <i :class="item.meta.icon"></i>
            <span class="menu_title" slot="title">{{ item.meta.title }}</span>
          </el-menu-item>
        </el-menu>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      selectValue: "hschain",
      selectStatus: [{ value: "hschain", status: "hschain" }],
      keyword: "",
      menu: [],
      activeIndex: "/",
    };
  },
  created() {
    this.$router.options.routes.forEach(item => {
      if (!item.hidden) {
        this.menu.push(item);
      }
    });
  },
  watch: {
    '$store.state.option.path': function(newVal) {
      this.activeIndex = newVal
    }
  },
  methods: {
    querykeyword() {
      //去除首尾空格
      this.keyword = this.keyword.replace(/(^\s*)|(\s*$)/g, "");

      if (/^\d+$/g.test(this.keyword)) {
        //纯数字直接查询区块信息
        this.$http(this.$api.getBlocksList, "", this.keyword).then(res => {
          if (res.code === 200 && res.data) {
            this.$store.dispatch('option/getBlockData', res)
            this.$router.push({ path: `/blocks/${this.keyword}` })
          } else {
            this.$message.error("未查询到结果");
          }
        });
      } else if (/^hsc/i.test(this.keyword)) {
        //hsc开头查询账户信息
        this.$http(this.$api.getAccountDetail, null, this.keyword).then(res => {
          if (res.code === 200 && res.data) {
            this.$store.dispatch('option/getAccountDetail', res)
            this.$router.push({ path: `/account/${this.keyword}` })
          } else {
            this.$message.error("未查询到结果");
          }
        })
      } else if (this.keyword.length === 64) {
        //长度为64时查询交易信息
        this.$http(this.$api.getTransactionsList, null, this.keyword).then(res => {
          if (res.code === 200 && res.data) {
            this.$store.dispatch('option/getTransactionData', res)
            this.$router.push({ path: `/transactions/${this.keyword}` })
          } else {
            this.$message.error("未查询到结果")
          }
        })
      } else {
        this.$message.error("请输入有效信息")
      }
    },
    handleSelect(key, keyPath) {
      // console.log(key, keyPath);
    }
  }
};
</script>

<style lang="scss">
.header {
  top: 0;
  left: 0;
  right: 0;
  position: fixed;
  z-index: 100;
  .searchBar {
    background: #020e46;
    .searchBar_toolBar {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .mainLink {
        img {
          height: 40px;
        }
      }
      .searchBar_selectWarpper {
        .select {
          width: 120px;
        }
        .inputMargin {
          width: 500px;
        }
        @media screen and (max-width: 1100px) {
          .inputMargin {
            display: none;
          }
        }
      }
    }
  }
  .SubHeader {
    box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.2);
    background: white;
    .SubHeader__nav {
      max-width: 1200px;
      margin: 0 auto;
      .el-menu {
        display: flex;
        justify-content: space-between;
        .menu_title {
          font-size: 20px;
        }
      }
    }
  }
}
</style>
