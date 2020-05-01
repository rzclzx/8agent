<template>
  <div>
    <el-menu
      :default-active="$route.path"
      router
      unique-opened
      :default-openeds="openeds"
      active-text-color="#1890FF">
      <div v-for="(item,index) in menus" :key="index">
        <el-menu-item class="first-menu" v-if="!item.children" :index="item.path" @click="selectMenus(item)">{{item.name}}</el-menu-item>
        <el-submenu v-else :index="item.path">
          <template slot="title">
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item v-for="val in item.children" :key="val.path" :index="val.path" @click="selectMenus(val)">{{ val.name }}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </div>
      <!-- <el-submenu v-for="item in menus" :key="item.path" :index="item.path">
        <template slot="title">
          <span>{{ item.name }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item v-for="val in item.children" :key="val.path" :index="val.path" @click="selectMenus(val)">{{ val.name }}</el-menu-item>
        </el-menu-item-group>
      </el-submenu> -->
    </el-menu>
  </div>
</template>
<script>
export default {
  data () {
    return {
      menus: [
        {
          name: '首页',
          path: '/home'
        },
        {
          name: '经纪人',
          path: '/agent',
          children: [
            {
              name: '收益记录',
              path: '/agent/profit'
            },
            {
              name: '客户列表',
              path: '/agent/customer'
            }
          ]
        }
      ],
      // 默认打开经纪人菜单
      openeds: ['/agent']
    }
  },
  methods: {
    selectMenus (data) {
      let sessionTitle = this.$store.state.title_nav_main1
      let status = false
      sessionTitle.map((item) => {
        if (item.path === data.path) {
          status = true
        }
      })
      if (!status) {
        this.$store.commit('setTitleSession', data)
      }
    }
  }
}
</script>
<style lang="less">
  .el-menu {
    border-right: none !important;
    color:#34495E;
    width:139px;
    .el-submenu{
      .el-submenu__title{
        height:40px;
        line-height: 40px;
        .el-icon-arrow-down:before {
          content: "\E60B";
          color:#83868F;
        }
      }
      .el-menu--inline{
        .el-menu-item-group{
          .el-menu-item-group__title{
            padding:0;
          }
          .is-active{
            color:#0C9AFF;
            background: rgba(247,248,251,1);
          }
          .is-active::before{
            content: "";
            display: inline-block;
            width:3px;
            height:100%;
            position: absolute;
            left:0;
            top:0;
            background: #0C9AFF;
          }
        }
        .el-menu-item{
          height:40px;
          line-height: 40px;
          padding:0;
          padding-left: 20px !important;
          min-width: 0;
        }
      }
    }
    .el-menu-item{
      height: 40px;
      line-height: 40px;
    }
    .first-menu.is-active{
      background: #f7f8fb;
    }
    .first-menu.is-active::before{
      content: "";
      display: inline-block;
      width:3px;
      height:100%;
      position: absolute;
      left:0;
      top:0;
      background: #0C9AFF;
    }
  }

</style>


