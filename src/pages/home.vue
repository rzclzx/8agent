<template>
  <div style="height:100%;">
    <el-container style="height:100%;">
    <el-header style="height:48px;box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14);z-index:10;padding-left:20px;">
      <div class="flex">
        <i class="logo"></i>
        <span style="font-size: 14px;">58COIN经纪人管理系统</span>
      </div>
      <div class="header-right">
        <div class="flex">
          <i class="user"></i>
          <div>{{ $store.state.user.mobile }}</div>
        </div>
        <div @click="logout" class="flex pointer logout-box">
          <i class="logout"></i>
          <div>退出</div>
        </div>
      </div>
    </el-header>
    <el-container  style="height: calc(100% - 48px)">
      <el-aside width="140px" style="min-width:140px;min-height: calc(100% - 48px);box-shadow: inset -1px 0 0 0 #F0F1F5;overflow-y:auto;">
        <Menu />
      </el-aside>
      <el-container>
        <el-header class="title-header">
          <TitleNav/>
        </el-header>
        <el-main  style="padding:0px;padding-top:16px;">
          <div style="padding:0px 16px 20px 16px;">
            <div class="grid-content bg-purple-light">
              <transition name="fade" mode="out-in">
                <router-view></router-view>
              </transition>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
  </div>


</template>

<script>
  import Menu from '@/components/menu'
  import Cookie from '@/assets/js/common/cookie'
  import TitleNav from '@/components/Titletabs'
  export default {
    components: {
      Menu,
      TitleNav
    },
    data () {
      return {
        userId: '',
        token: ''
      }
    },
    methods: {
      logout () {
        let that = this
        this.manageAction.logout().then(res => {
          Cookie.clearCookie('access_token')
          that.$router.push('/login')
          sessionStorage.removeItem('title_list')
          that.$store.commit('clearTitle',[
            {
              name: '首页',
              path: '/home'
            }
          ])
        }).catch(e => {
          if (e.data && e.data.message) {
            if (e.data.code === 105) {
              Cookie.clearCookie('access_token')
              that.$router.push('/login')
              sessionStorage.removeItem('title_list')
              that.$store.commit('clearTitle',[
                {
                  name: '首页',
                  path: '/home'
                }
              ])
              that.$message({
                message: e.data.message,
                type: 'error'
              })
              this.$router.push('/login')
            } else {
              that.$message({
                message: e.data.message,
                type: 'error'
              })
            }
          }
        })
      }
    },
    created () {
      window.localStorage.user && this.$store.commit('setUser', JSON.parse(window.localStorage.user))
    }
  }
</script>

<style lang="less" scoped>
  @import "../assets/css/theme.less";
  header {
    .flex-box(@justifyContent: space-between);
    height: 48px;
    line-height: 48px;
    padding-left: 30px;
    color: #fff;
    .header-right {
      .flex-box(@justifyContent: space-between);
      padding-right: 0px;
    }
    background: linear-gradient(to right, #52AEFE  , #4C72F9);
  }
  aside {
    width: 139px;
    height: 100%;
    background: #fff;
    overflow-y: scroll;
  }
  .logo {
    display: block;
    width: 30px;
    height: 24px;
    margin-right: 10px;
    background: url("../assets/images/logo.png") no-repeat;
    background-size: 100% 100%;
  }
  .logout {
    display: block;
    width: 20px;
    height: 20px;
    margin-right: 5px;
    background: url("../assets/images/logout.png") no-repeat;
    background-size: 100% 100%;
  }
  .pointer {
    cursor: pointer;
  }
  .user {
    display: block;
    width: 20px;
    height: 20px;
    margin-right: 5px;
    background: url("../assets/images/user.png") no-repeat;
    background-size: 100% 100%;
  }
  .logout-box {
    margin-left: 24px;
  }
  .flex {
    .flex-box(@justifyContent: space-between, @alignItem: center);
  }
  .title-header{
    background:rgba(255, 255,255, 0);
    height: 36px !important;
    // margin-bottom: 16px;
    padding:0;
    box-shadow: 0 4px 5px 0 rgba(33,41,50,0.04);
    z-index: 2;
  }
</style>
