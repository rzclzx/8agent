<template>
    <div class="title-tabs">
        <div class="title-list">
            <span class="title-tabs-item-prev" @click="prevClick()">
                <i class="el-icon-d-arrow-left"></i>
            </span>
            <div class="title-tabs-list-info" ref="titleList">
                <ul class="title-tabs-list">
                    <li @click.stop="activeFun($event,item)" v-for="(item,index) in $store.state.title_nav_main1" :key="index" :class=" { 'title-tabs-item' : true, 'is-active' : item.path == activePath , 'is-closed' : index ==0 }" >
                        {{ item.name }}
                        <i class="title-close el-icon-close" :class="{'is-show':item.path == activePath}" @click.stop="deleteTitle(item,index)"></i>
                    </li>
                </ul>
            </div>
            <span class="title-tabs-item-next" @click="nextClick()">
                <i class="el-icon-d-arrow-right"></i>
            </span>
            <el-popover
              placement="bottom"
              width="110"
              popper-class='item-more'
              @hide="hideMore"
              trigger="hover">
              <ul>
                <li v-for="(item,index) in moreList" :key="index" :class="{ 'is_active':index==selected}" @click="clearMore(item,index)" >
                  <img :src="item.src" />{{item.name}}
                </li>
              </ul>
              <span class="title-tabs-item-more" slot="reference">
                  <i class="el-icon-more"></i>
              </span>
            </el-popover>
        </div>
    </div>
</template>
<script>
import axios from "../assets/js/axios/config.js"
import Cookie from '@/assets/js/common/cookie'
export default {
  name: 'titletabs',
  data () {
    return {
      titleTabsList: this.$store.state.title_nav_main1,
      activePath: '',
      ulWidth: 0,
      divWidth: 0,
      marginLeft: 0,
      selected: -1,
      moreList: [
        {
          name: "关闭所有",
          src: '/static/img/delete.svg',
          type: 1
        }
        // ,{
        //   name: "全屏",
        //   src: '/static/img/full.svg',
        //   type: 2
        // }
      ]
    }
  },
  mounted () {
    this.setUlwidth()
    let that = this
    window.onresize = () => {
      that.ulWidth = 0
      that.setUlwidth()
    }
  },
  watch: {
    "$route": function () {
      this.activePath = this.$route.path
      this.searchType()
    }
  },
  created () {
    this.activePath = this.$route.path
    this.searchType()
  },
  methods: {
    searchType () {
      axios({
        method: 'post',
        url: 'agent/type'
      })
      .then(res => {
        if (res.result && (res.result.inBlackList === 1 || res.result.type !== this.$store.state.user.userType)) {
          Cookie.clearCookie('access_token')
          this.$router.push('/login')
          sessionStorage.removeItem('title_list')
          this.$store.commit('clearTitle',[
            {
              name: '首页',
              path: '/home'
            }
          ])
        }
        if (res && res.data && (res.data.code === 117 || res.data.code === 110)) {
          Cookie.clearCookie('access_token')
          this.$router.push('/login')
          sessionStorage.removeItem('title_list')
          this.$store.commit('clearTitle',[
            {
              name: '首页',
              path: '/home'
            }
          ])
        }
      })
      .catch(res => {
        if (res && res.data && (res.data.code === 117 || res.data.code === 110)) {
          Cookie.clearCookie('access_token')
          this.$router.push('/login')
          sessionStorage.removeItem('title_list')
          this.$store.commit('clearTitle',[
            {
              name: '首页',
              path: '/home'
            }
          ])
        }
        if (res && res.msg) {
          this.$message({
            message: res.msg?res.msg:"请求出错",
            type: 'error'
          })
        }
      })
    },
    hideMore () {
      this.selected = -1
    },
    clearMore (val,index) {
      this.selected= index
      if (val.type === 1) {
        this.$router.push('/')
        sessionStorage.removeItem('title_list')
        this.$store.commit('clearTitle',[
          {
            name: '首页',
            path: '/home'
          }
        ])
      }
    },
    activeFun (el,val) {
      this.activePath = val.path
      if (val.query) {
        this.$router.push({path: val.path,query: val.query})
      } else {
        this.$router.push(val.path)
      }
    },
    deleteTitle (data,index) {
      this.titleTabsList.splice(index,1)
      if (index <=(this.titleTabsList.length-1)) {
        this.activePath = this.titleTabsList[index].path
        if (this.titleTabsList[index].query) {
          data.query = this.titleTabsList[index].query
        } else {
          data.query = {}
        }
      } else {
        this.activePath = this.titleTabsList[index-1].path
        if (this.titleTabsList[index-1].query) {
          data.query = this.titleTabsList[index-1].query
        } else {
          data.query = {}
        }
      }
      if (data.query) {
        this.$router.push({path: this.activePath,query: data.query})
      } else {
        this.$router.push(this.activePath,'444444')
      }
      this.$store.commit('closeTitle',this.titleTabsList)
    },
    setUlwidth () {
      this.divWidth = this.$refs.titleList.getBoundingClientRect().width
      let liList = this.$refs.titleList.getElementsByClassName("title-tabs-item")
      for (let i=0;i<liList.length;i++) {
        this.ulWidth+=liList[i].getBoundingClientRect().width
      }
      if (this.divWidth < this.ulWidth) {
        this.$refs.titleList.getElementsByClassName("title-tabs-list")[0].style.width = this.ulWidth + 'px'
      } else if (this.divWidth > this.ulWidth) {
        this.$refs.titleList.getElementsByClassName("title-tabs-list")[0].style.width = this.divWidth + 'px'
      } else {
        this.$refs.titleList.getElementsByClassName("title-tabs-list")[0].style.width = this.divWidth + 'px'
      }
    },
    prevClick () {
      if (this.divWidth < this.ulWidth+10) {
        if (this.ulWidth-this.divWidth <= Math.abs(this.marginLeft)) {
          this.marginLeft = this.divWidth-this.ulWidth
        } else {
          this.marginLeft -= 150
          if (this.ulWidth-this.divWidth <= Math.abs(this.marginLeft)) {
            this.marginLeft = this.divWidth-this.ulWidth
          }
        }
      }
      this.$refs.titleList.getElementsByClassName("title-tabs-list")[0].style.marginLeft =this.marginLeft + 'px'
      this.$refs.titleList.getElementsByClassName("title-tabs-list")[0].style.transition= "margin-left 0.5s"
    },
    nextClick () {
      this.marginLeft = 0
      let nextMarginLeft = this.$refs.titleList.getElementsByClassName("title-tabs-list")[0].style.marginLeft.replace(/px/,'')
      nextMarginLeft = Number(nextMarginLeft)
      if (nextMarginLeft && nextMarginLeft <0) {
        nextMarginLeft+=150
        if (nextMarginLeft >0) {
          nextMarginLeft = 0
        }
      }
      this.$refs.titleList.getElementsByClassName("title-tabs-list")[0].style.marginLeft = nextMarginLeft + 'px'
      this.$refs.titleList.getElementsByClassName("title-tabs-list")[0].style.transition = "margin-left 0.5s"
    }
  }
}
</script>
<style lang="less">
ul, ol { list-style:none; }

.title-tabs{
    width: 100%;
    height: 36px;
    line-height: 36px;
    font-size: 12px;
    box-sizing:border-box;
    .title-list{
        width:100%;
        height:100%;
        box-sizing:border-box;
        padding:0 60px 0 30px;
        position: relative;
        background: #fff;
        color:#34495E;
        .title-tabs-item-prev{
            display:inline-block;
            width:30px;
            height:36px;
            line-height:36px;
            position: absolute;
            left:0px;
            top:0px;
            text-align: center;
            color:#9AABB8;
        }
        .title-tabs-item-next{
            display:inline-block;
            width:30px;
            height:36px;
            line-height:36px;
            position: absolute;
            right:30px;
            top:0px;
            text-align: center;
            color:#9AABB8;
        }
        .title-tabs-item-more{
            display:inline-block;
            width:30px;
            height:36px;
            line-height:36px;
            position: absolute;
            right:0px;
            top:0px;
            // text-align: center;
            color:#9AABB8;
            i{
              transform: rotate(90deg);
            }
        }
        .title-tabs-list-info{
            width:100%;
            overflow: hidden;
            box-sizing:border-box;
            .title-tabs-list{
                box-sizing:border-box;
                height:36px;
                padding:0;
                margin:0;
                .title-tabs-item{
                    box-sizing:border-box;
                    float: left;
                    padding:0 30px 0 20px;
                    position: relative;
                    font-size:12px;
                    .title-close{
                        display: none;
                        line-height: 36px;
                        position:absolute;
                        right:8px;
                        top:0;
                    }
                    .is-show{
                        display: block;
                    }
                }
                .title-tabs-item:hover{
                    background: #F8F9FC;
                }
                .is-active{
                    background: #F8F9FC;
                }
                .is-closed{
                    padding-right:20px;
                    .title-close{
                        display: none;
                    }
                }
            }
        }
    }
}
</style>
