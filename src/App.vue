<template>
  <div id="app">
    <Layout />
  </div>
</template>

<script>
  import jump from "@/jump/index";
  import Layout from "@/layout/index";

  export default {
    name: "App",
    components: {
      jump,
      Layout
    },
    created() {
      var lang = navigator.language || navigator.userLanguage; //常规浏览器语言和IE浏览器
      lang = lang.substr(0, 2); //截取lang前2位字符

      // console.log(window.localStorage.language)

      if (window.localStorage.language != '中文' && window.localStorage.language != 'English') {
        if (lang == 'zh') {
          lang = 'cn';
          // window.localStorage.language = '中文';
        } else {
          lang = 'en';
          // window.localStorage.language = 'English';
        }

        window.localStorage.lang = lang;
      }



      // this.$i18n.locale = lang;
    }
  };
</script>
