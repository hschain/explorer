<template>
  <footer class="Footer">
    <div class="footerWrapper">
      <div class="footerLeft">
        <img src="@/assets/footer/HSC_footer.png" alt="" />
        <div class="walletLinkWrapper">
          <p class="title">HSCHAIN, THE NEXT GENERATION BLOCKCHAIN</p>
        </div>
      </div>
      <div class="footerRight">
        <div class="footerCopyright">
          © HSChain 2020
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer"
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
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px 20px 20px;
    .footerLeft {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      img {
        width: 160px;
      }
      .walletLinkWrapper {
        .title {
          font-size: 14px;
          font-weight: 400;
          line-height: 1.2;
          color: #cdcdcd;
          margin-bottom: 10px;
          margin-top: 10px;
        }
      }
    }
    .footerRight {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      line-height: 1.1;
      .footerCopyright {
      }
    }
  }
}
</style>
