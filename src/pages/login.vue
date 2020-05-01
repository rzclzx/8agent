<template>
<div class="agent-login-div">
  <div class="agent-login">
    <div class="agent-login-banner float-left clear">
      <div class="agent-logo">
        <img src="../assets/images/58logo.png" alt="">
      </div>
      <img src="../assets/images/banner.png" alt="">
      <p class="agent-info">
        58COIN - 全球数字货币交易平台领跑者
      </p>
    </div>
    <el-form :model="form" :rules="rules" ref="login" class="login-container float-left">
      <p class="title">Hi，您好！</p>
      <p class="title-small">欢迎使用58COIN经纪人管理系统!</p>
      <el-form-item  class="agent-username" prop="username">
        <img src="../assets/images/svg/usename.svg" :style="{opacity: icon_opacity1}" class="user-icon" alt="">
        <el-input type="text" clearable v-model="form.username"
                  @focus="icon_opacity1 = 1"
                  @blur="form.username ? icon_opacity1 = 1 : icon_opacity1 = 0.6"
                  placeholder="请输入58COIN注册手机号"></el-input>
      </el-form-item>
      <el-form-item  class="agent-username" style="margin-bottom:0px;" prop="password">
        <img src="../assets/images/svg/password.svg" :style="{opacity: icon_opacity2}" class="user-icon" alt="">
        <el-input type="password" clearable v-model="form.password"
                  @keyup.enter.native="submit"
                  @focus="icon_opacity2 = 1"
                  @blur="form.password ? icon_opacity2 = 1 : icon_opacity2 = 0.6"
                  placeholder="请输入密码"></el-input>
      </el-form-item>
      <p class="err_message">{{ err_msg }}</p>
      <el-form-item class="footer" style="margin-top: 50px; width: 100%;height:50px;margin-bottom:0;">
        <el-button
          class="submit-button"
          type="primary"
          :disabled="disabled"
          :style="{width: '100%',opacity:button_opacity}"
          @keyup.enter.native="submit"
          @click.native.prevent="submit"
        >
        <i class="iconfont icon-loading1" v-show="loading"></i>
          {{loginText}}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</div>

</template>

<script>
  import Cookie from '@/assets/js/common/cookie'
  import apiconfig from '../../myConfig/api.config.js'
  export default {
    name: 'login',
    data () {
      let checkMobile = (rule, value, callback) => {
        // if (!value) {
        //   return callback(new Error('请输入用户名'))
        // }
        // if (!(value.length <= 14) || (/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(value))) {
        //   callback(new Error('手机号格式不正确'))
        // } else {
        //   callback()
        // }
        if (!value) {
          return callback(new Error('请输入58COIN注册手机号'))
        } else if (!/^\d{1,14}$/.test(value)) {
          return callback(new Error('手机号格式不正确'))
        } else {
          callback()
        }
      }
      return {
        token: '',
        form: {
          username: '',
          password: ''
        },
        dialog: false,
        rules: {
          username: [
            { required: true,validator: checkMobile, trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        },
        err_msg: '',
        button_opacity: 0.7,
        icon_opacity1: 0.6,
        icon_opacity2: 0.6,
        loginText: '登录',
        disabled: true,
        loading: false
      }
    },
    watch: {
      "form": {
        handler () {
          if (this.form.username && this.form.password) {
            this.disabled = false
            this.button_opacity = 1
          } else {
            this.disabled = true
            this.button_opacity = 0.7
          }
          this.err_msg = ''
        },
        deep: true
      }
    },
    mounted () {
      window.onresize = ""
    },
    methods: {
      submit () {
        this.loginText = "登录中..."
        this.button_opacity = 0.7
        this.disabled = true
        let $this = this
        this.loading = true
        setTimeout(function () {
          $this.$refs['login'].validate(valid => {
            if (valid) {
              $this.manageAction.login({
                userName: $this.form.username,
                password: $this.form.password
              })
                .then(res => {
                  Cookie.setCookie('access_token', res.data.accessToken, '7', '/')
                  window.localStorage.user = JSON.stringify({
                    userId: res.data.info.id,
                    userType: res.data.type,
                    mobile: res.data.info.mobile
                  })
                  $this.loginText = "登录"
                  $this.loading = false
                  $this.button_opacity = 1
                  $this.disabled = false
                  $this.$router.push('/home')
                })
                .catch(e => {
                  $this.loginText = "登录"
                  $this.loading = false
                  $this.button_opacity = 1
                  $this.disabled = false
                  if (e.data && e.data.message) {
                    if (e.data.code === 117) {
                      $this.$msgbox({
                        message: '此账号还未注册，请立即前往58COIN.com进行注册！',
                        title: '此账号不是经纪人账号，无法登录！',
                        confirmButtonText: '去注册',
                        cancelButtonText: '知道了',
                        customClass: 'agent-login-err-msg',
                        showClose: false,
                        showCancelButton: true
                      }
                      ).then(() => {
                        // console.log("去注册")
                        window.open(apiconfig.mainDomain+'manage/register')
                      }).catch(() => {
                        // console.log("知道了")
                      })
                    } else {
                      $this.err_msg = e.data.message
                    }
                  }
                })
            }
          })
        },1000)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../assets/css/theme.less";

  .float-left{
    float: left;
  }
  .clear{
    clear: both;
  }
  .agent-login-div{
    width: 100%;
    height:100%;
    min-height:800px;
    background: url('/static/img/bg.png') no-repeat;
    background-size: 100% 100%;
  }
  .agent-login{
    width:960px;
    height:600px;
    position: absolute;
    top: 50%;
    left: 50%;
    background: #fff;
    .transform(translate(-50%,-50%));
    .border-radius(10px);
    box-shadow: 0 0 25px rgba(202, 239, 255, .2);
    position: relative;
    .agent-login-banner{
      width:380px;
      height:100%;
      img{
        width: 100%;
        height:100%;
      }
      .agent-logo{
        position: absolute;
        left:30px;
        top: 30px;
        width:120px;
        height:33px;
      }
      .agent-info{
        width:380px;
        position: absolute;
        bottom:20px;
        left:0;
        opacity: 0.6;
        font-family: PingFangSC-Light;
        font-size: 12px;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: center;
        line-height: 12px;
      }
    }
    .login-container {
      width:580px;
      height:100%;
      padding:100px 110px;
      .title {
        font-weight: normal;
        font-family: PingFangSC-Regular;
        font-size: 36px;
        color: #24324C;
        letter-spacing: 0;
        line-height: 40px;
        margin-bottom: 20px;
      }
      .title-small{
        font-family: PingFangSC-Regular;
        font-size: 24px;
        color: #24324C;
        letter-spacing: -1px;
        line-height: 28px;
        margin-bottom: 50px;
      }
      /deep/.el-form-item{
        margin-top: 30px;
      }
      .agent-username{
        position: relative;
        .user-icon{
          position:absolute;
          left:3px;
          top:10px;
          width:24px;
          z-index: 2;
        }
        .clear-input{
          display: inline-block;
          width:30px;
          height:48px;
          text-align: center;
          line-height: 48px;
          position: absolute;
          right:0;
          top:0;
          color:#C1CFDE;
        }

        /deep/.el-form-item__label{
          font-size: 14px;
          color: #758896;
          padding: 0;
          height: 48px !important;
        }
        /deep/.el-form-item__content{
          height: 48px !important;
          line-height: 48px !important;
        }
        /deep/.el-input{
          height: 48px !important;
        }
        /deep/.el-input__inner{
          width: 100% !important;
          border:none ;
          padding:12px 35px !important;
          font-family: PingFangSC-Medium;
          font-size: 14px;
          line-height: 24px;
          color: #24324C;
          letter-spacing: 0;
          border-bottom:1px solid #B8C6DF;
          border-radius: 0px;
          background: none;
          height:48px;
        }
        /deep/.el-input__inner::-webkit-input-placeholder {
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #D4DAE5;
          letter-spacing: 0;
        }
        /deep/.el-form-item__error{
          color: #FF9001;
          padding-top:10px;
        }
      }
      .err_message{
          height:20px;
          line-height: 20px;
          color: #FF9001;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          margin-top: 10px;
        }

      .footer /deep/.el-form-item__content{
          height: 50px !important;
          line-height: 50px !important;
      }
      .submit-button{
        height:50px;
        background-image: linear-gradient(45deg, #52AEFE 0%, #4C72F9 100%);
        box-shadow: 0 10px 20px 0 rgba(89,122,185,0.20);
        border-radius: 3px;
        border:none;
        @keyframes rotation {
          from {-webkit-transform: rotate(0deg);}
          to {-webkit-transform: rotate(360deg);}
        }

        @-moz-keyframes rotation /* Firefox */
        {
          from {-webkit-transform: rotate(0deg);}
          to {-webkit-transform: rotate(360deg);}
        }

        @-webkit-keyframes rotation /* Safari 和 Chrome */
        {
          from {-webkit-transform: rotate(0deg);}
          to {-webkit-transform: rotate(360deg);}
        }

        @-o-keyframes rotation /* Opera */
        {
          from {-webkit-transform: rotate(0deg);}
          to {-webkit-transform: rotate(360deg);}
        }
        .icon-loading1{
          display: inline-block;
          animation: rotation 1s linear infinite;
          -moz-animation: rotation 1s linear infinite;
          -webkit-animation: rotation 1s linear infinite;
          -o-animation: rotation 1s linear infinite;
        }
      }
    }
  }

</style>
<style lang="less">
.agent-login-err-msg{
    width:360px;
    height:200px;
    padding:10px 30px 20px;
    .el-message-box__header{
      padding-left:35px;
      margin-top: 20px;
      padding-bottom: 8px;
      padding-right:0px;
      .el-message-box__title{
        height:24px;
        line-height: 24px;
        color: #34495E;
        font-size: 16px;
      }
    }
    .el-message-box__header::before{
      content: "";
      display: inline-block;
      width:25px;
      height:25px;
      position:absolute;
      left:0px;
      top:15px;
      background: url('../assets/images/svg/info.svg') no-repeat;
      background-size: 100% 100%;
    }
    .el-message-box__content{
      // margin-bottom: 10px;
      padding: 10px 0;
      .el-message-box__message{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #758896;
        line-height: 22px;
      }
    }
    .el-button--default{
      width:64px;
      height:28px;
      padding:0;
      line-height: 28px;
      text-align: center;
      span{
        font-family: PingFangSC-Regular;
        font-size: 12px !important;
      }
    }
    .el-button--primary{
      background: #0C9AFF;
      border:none;
    }
  }
</style>

