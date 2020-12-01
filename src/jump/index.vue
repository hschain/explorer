<template>
  <div class="Jump" onload="load()">
    <div class="JumpMain">
      <img class="img" src="../assets/app_QRCode/jumpbgimg.png" alt="">
      <div class="swiper-slide">
        <div class="fp-tableCell page">
          <div class="sc_two_wraper">
            <p class="title">了解HSC和式链</p>
            <p class="title_intro">
              用区块链的技术为去中心化的互联网经济提供用户、技术、经济模型、平台
              <br>
              以跨链技术为核心，融合的众多前沿技术的一种价值公链
              <br>
              HSC是一种采用跨链，预言机技术的一条价值共链，结合整个的商业模式闭环，实现了区块链分布式应用的扩展
              <br>
              跨链技术节点网络 公式算法
            </p>
            <!--          <div class="sc_two_item">-->
            <!--            <img src="../assets/app_QRCode/boe_tk.jpg" alt="">-->
            <!--          </div>-->
          </div>
        </div>
      </div>
    </div>
    <div class="DownloadButton" id="DownloadButton" @click="down">
      <a href="#">立即下载</a>
    </div>

    <!--  遮罩层-->
    <div id="loading-mask" class="loading-mask">
      <div class="loading">
        <div class="loading-indicator">
          <img class="curvilinear-arrow" src="../assets/app_QRCode/CurvilinearArrow.png" alt="">
          <br/>
          <span class="loading-msg">
              请点击右上角...
              <br>
              选择“在浏览器中打开”
            </span>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
window.onload = function(){
  //进入jump页面，判断是微信显示 隐藏的模态框
  let ua = navigator.userAgent.toLowerCase();
  if(isWeixinBrowser()) {
    this.show = !this.show;
    document.getElementById("loading-mask").style.display = "block";
  }
  function isWeixinBrowser() {
    return(/micromessenger/.test(ua)) ? true : false;
  }
}
import "@/styles/index.scss";
export default {
  name: "jump",
  components: {},
  methods: {
      down() {
          let ua = navigator.userAgent.toLowerCase();
          //android终端
          let isAndroid = ua.indexOf("Android") > -1 || ua.indexOf("Adr") > -1;
          let isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
          if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
              console.log('我是iPhone|iPad|iPod|iOS')
              window.location = 'itms-services://?action=download-manifest&url=https://wallet-hschain-io.oss-cn-hangzhou.aliyuncs.com/wallet-app/HSWallet.plist';
          } else if (/(Android)/i.test(navigator.userAgent)) {
              console.log('我是安卓')
              window.location ="https://wallet-hschain-io.oss-cn-hangzhou.aliyuncs.com/wallet-app/HSWallet.apk";
          }
      }
  }
}
</script>
<style lang="scss">
.main-container {
  padding-top: 0px;
  .Footer{
  }
}

@media screen and (max-width: 890px) {
  .Jump {
    overflow: hidden;
    .JumpMain {
      /* padding-bottom: 70px; */
      background: #120E58;
      height: 100%;
      .img {
        width: 100%;
        margin-top: 100px;
      }
      .swiper-slide {
        display: none;
        background-image: linear-gradient(#120E58 30%, #1F2533 50%);
        height: auto;
        padding: 30px 0;
        margin-top: -10px;

        .fp-tableCell {
          vertical-align: middle;
          width: 100%;
          display: block;

          .sc_two_wraper {
            position: static;
            padding: 0 20px;
            width: 100%;
          }

          .title {
            width: 100%;
            text-align: center;
            font-size: 1.2rem;
            color: #fff;
            padding-bottom: 15px;
          }

          .title_intro {
            color: #fff;
            text-align: center;
            font-size: .8rem;
            line-height: 1.6em;
            margin-bottom: 50px;
          }

          .sc_two_item {
            width: 100%;
            display: inline-block;
            text-align: center;

            img {
              width: 192px;
              height: auto;
            }
          }
        }
      }
    }
    .Download-now{
      background: #fff;
      width: 100%;
      height: 80px;
      z-index: 9999;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      .el-button{
        width: 100%;
        display: block;
        height: 50px;
        text-align: center;
        outline: none;
        border: none;
        color: #fff;
        font-size: 15px;
        border-radius: 5px;
        background: #0069bf;
        margin: 15px 0;
        span{
          //display: inline-block;
          //height: 50px;
          //line-height: 50px;
        }
      }

    }
    .DownloadButton {
      width: 100%;
      height: auto;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      padding: 0 29px;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      background: #eaf0fa;
      z-index: 9999;
      a {
        width: 100%;
        display: block;
        height: 50px;
        line-height: 50px;
        text-align: center;
        outline: none;
        border: none;
        color: #fff;
        font-size: 15px;
        border-radius: 5px;
        background: #0069bf;
        margin: 15px 0;
      }
    }
    .loading-mask{
      position:fixed;
      left:0;
      top:0;
      height:100%;
      z-index:9999;
      background: #333;
      background:rgba(0,0,0,0.6);
      width: 100%;
      display: none;
      .loading{
        position:absolute;
        left:45%;
        top:2%;
        padding:2px;
        z-index:20001;
        height:auto;
        .loading-indicator{
          color: #fff;
          margin: 0;
          height: auto;
          .curvilinear-arrow{
            width: 75px;
            height: 55px;
            position: relative;
            top: 20px;
            left: 100px;
          }
        }
      }
    }
  }
}
</style>
