<template>
  <footer class="Footer">
    <div class="footerWrapper">
      <div class="footerLeft">
        <img src="@/assets/footer/HSC_footer.png" alt="" />
        <div class="walletLinkWrapper">
          <p class="title">HSChain | 全球新经济网络基础公链</p>
        </div>
      </div>
      <div class="footerRight">
        <div class="social">
          <a href="https://github.com/hschain" target="_blank" title="Github">
            <img class="picture" :src="require('@/assets/footer/github_btn.svg')" alt="">
          </a>
        </div>
        <div class="footerCopyright">
          © HSChain 2020
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style lang="scss">
.Footer {
  width: 100%;
  height: 160px;
  background: #020e46;
  overflow-x: hidden;
  .footerWrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: #cdcdcd;
    font-size: 12px;
    position: relative;
    height: 100%;
    max-width: 1300px;
    margin: 0 auto;
    padding: 30px 50px 20px;
    .footerLeft {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      img {
        width: 160px;
      }
      .walletLinkWrapper {
        .title {
          font-size: 16px;
          font-weight: 500;
          line-height: 1.2;
          color:#e2e2e2;
          margin-bottom: 10px;
          margin-top: 10px;
        }
      }
    }
    .footerRight {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      line-height: 1.5;
      .social{
        display: flex;
        justify-content: flex-end;
        .picture{
          opacity: 0.7;
          transition: opacity 0.3s;
          &:hover{
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
