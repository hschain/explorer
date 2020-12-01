<template>
  <header class="header">
    <div class="searchBar ">
      <div class="searchBar_toolBar">
        <div class="sbara">
          <a class="mainLink" href="/">
            <img src="@/assets/header/hstlogo.png" alt="">
          </a>
        </div>
        <div  class="menu_bar">
          <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <i class=""></i>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-menu :default-active="activeIndex" class="el-menu" mode="horizontal" :router="true" active-text-color="#C1996C" @select="handleSelect">
                <el-menu-item v-for="item in menu" :key="item.meta.title" :index="item.path">
                  <i :class="item.meta.icon" />
                  <span slot="title" class="menu_title">{{ item.meta.title }}</span>
                </el-menu-item>
              </el-menu>
<!--              <el-dropdown-item command="中文">中文</el-dropdown-item>-->
<!--              <el-dropdown-item command="Englist">Englist</el-dropdown-item>-->
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="clear" />
        <div class="searchBar_selectWarpper">
          <el-select v-model="selectValue" class="select" placeholder="" @change="selectOption">
            <template slot="prefix" />
            <el-option v-for="(item, index) of selectStatus" :key="index" :label="item.name" :value="item.name" />
          </el-select>
          <el-input v-model="keyword" placeholder="查询区块，交易，地址详情等…" class="inputMargin" clearable @keyup.enter.native="querykeyword()">
            <el-button slot="append" icon="el-icon-search" @click="querykeyword()">查询</el-button>
          </el-input>
        </div>
      </div>
      <div class="SubHeader ">
        <div class="SubHeader__nav SubHeader-pc">
          <el-menu :default-active="activeIndex" class="el-menu" mode="horizontal" :router="true" active-text-color="#C1996C" @select="handleSelect">
            <el-menu-item v-for="item in menu" :key="item.meta.title" :index="item.path">
              <i :class="item.meta.icon" />
              <span slot="title" class="menu_title">{{ item.meta.title }}</span>
            </el-menu-item>
          </el-menu>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import "@/styles/app_style.css";
export default {
  name: 'Header',
  data() {
    return {
      selectValue: 'hschain',
      selectStatus: [],
      keyword: '',
      menu: [],
      activeIndex: '/',
      origin: window.location.origin,
      localName: '',
      show:true,
      language:'语言'
    }
  },
  watch: {
    '$store.state.option.path': function(newVal) {
      this.activeIndex = newVal
    }
  },
  created() {
    this.$router.options.routes.forEach(item => {
      if (!item.hidden) {
        this.menu.push(item)
      }
    })
    this.getMainNodes()
  },
  methods: {
    // 判断下拉框展示内容
    getMainNodes() {
      this.$http(this.$api.getNodes).then(res => {
        if (res.code === 200 && res.data) {
          this.selectStatus = res.data
          this.selectStatus.forEach(item => {
            if (this.origin === item.url) {
              this.selectValue = item.name
            }
          })
          this.localName = this.selectValue
        }
      })
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
            this.$router.push({ path: `/blocks/${this.keyword}` })
          } else {
            this.$message.error('未查询到结果')
          }
        })
      } else if (/^hsc/i.test(this.keyword)) {
        // hsc开头查询账户信息
        this.$http(this.$api.getAccountDetail, null, this.keyword).then(res => {
          if (res.code === 200 && res.data) {
            this.$store.dispatch('option/getAccountDetail', res)
            this.$router.push({ path: `/account/${this.keyword}` })
          } else {
            this.$message.error('未查询到结果')
          }
        })
      } else if (this.keyword.length === 64) {
        // 长度为64时查询交易信息或者区块信息
        this.$http(this.$api.getTransactionsList, null, this.keyword).then(res => {
          if (res.code === 200 && res.data) {
            this.$store.dispatch('option/getTransactionData', res)
            this.$router.push({ path: `/transactions/${this.keyword}` })
          } else {
            this.$http(this.$api.getBlocksList, '', this.keyword).then(res => {
              if (res.code === 200 && res.data) {
                this.$store.dispatch('option/getBlockData', res)
                this.$router.push({ path: `/blocks/${this.keyword}` })
              } else {
                this.$message.error('未查询到结果')
              }
            })
          }
        })
      } else {
        this.$message.error('请输入有效信息')
      }
    },
    handleSelect(key, keyPath) {
      // console.log(key, keyPath);
    },
    selectOption(val) {
      this.selectStatus.forEach(item => {
        if (item.name === val) {
          window.open(item.url)
        }
      })
      this.selectValue = this.localName
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  top: 0;
  left: 0;
  right: 0;
  position: fixed;
  z-index: 100;
  .searchBar {
    background: #020e46;
    .searchBar_toolBar {
      max-width: 1300px;
      margin: 0 auto;
      display: flex;
      padding: 20px 50px;
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
          .el-input__prefix{
            top: 9px;
          }
        }
        .inputMargin {
          width: 500px;
        }
      }
      .ChineseEnglishSwitch{
        .el-dropdown{
          color: #fff;
          font-size: 14px;
        }
      }
    }
  }
  @media (min-width: 891px) and (max-width: 950px){
    .searchBar_toolBar{
      .searchBar_selectWarpper{
        /deep/ .inputMargin {
          width: 69% ;
        }
      }
      .ChineseEnglishSwitch{
        width: 8%;
      }
    }
  }
  @media screen and (min-width: 891px){}
  @media screen and (max-width: 890px){
    .searchBar{
      .searchBar_toolBar{
        div{
          display: inline-flex;
        }
        .sbara{
          width: 85%;
        }
        .menu_bar{
          width: auto;
          outline: none;
        }
        .ChineseEnglishSwitch,
        .searchBar_selectWarpper{
          display: none;
        }
      }
    }
  }
  @media screen and (max-width: 500px){
    .searchBar{
      .searchBar_toolBar{
        padding: 10px;
        div{
          display: inline-flex;
        }
        .sbara{
          width: 85%;
        }
        .menu_bar{
          width: auto;
          outline: none;
        }
        .ChineseEnglishSwitch,.searchBar_selectWarpper{
          display: none;
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

