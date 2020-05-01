<template>
  <div class="assembly">
    <div class="assembly-header">
      <img src="../../assets/images/separate.png" alt="">
      客户
    </div>
    <div class="assembly-content">
      <el-row type="flex" class="assembly-content-row clearfix">
        <el-col :span="6" class="assembly-content-col">
          <img src="../../assets/images/jrzzkh.png" alt="">
          <div class="profit-info" style="max-width:calc(100% - 48px)">
            <div class="header-msg-title">今日增长客户（人）</div>
            <div class="header-msg-content">{{ todayNew }}</div>
          </div>
        </el-col>
        <el-col :span="6" class="assembly-content-col">
          <img src="../../assets/images/yljyxkh.png" alt="">
          <div class="profit-info" style="max-width:calc(100% - 48px)">
            <div class="header-msg-title clearfix">
              <span>本月累计有效客户（人）</span>
              <el-popover
                popper-class="home-tooltip"
                placement="top"
                width="212"
                trigger="hover"
                content="注册当月完成初级认证并进行一笔交易（币币交易、融资融币、抵押贷款、永续合约交易）">
                <!-- <el-button >hover 激活</el-button> -->
                <span class="doubt" slot="reference"></span>
              </el-popover>
            </div>
            <div class="header-msg-content">{{ monthAvailable }}</div>
          </div>
        </el-col>
        <el-col :span="6" class="assembly-content-col">
          <img src="../../assets/images/byljkh.png" alt="">
          <div class="profit-info" style="max-width:calc(100% - 48px)">
            <div class="header-msg-title">本月累计客户（人）</div>
            <div class="header-msg-content">{{ monthNew }}</div>
          </div>
        </el-col>
        <el-col :span="6" class="assembly-content-col">
          <img src="../../assets/images/zkh.png" alt="">
          <div class="profit-info" style="max-width:calc(100% - 48px)">
            <div class="header-msg-title">总客户（人）</div>
            <div class="header-msg-content">{{ total }}</div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        todayNew: 0,                        // 今日新增客户
        total: 0,                       // 总客户
        monthAvailable: 0,                  // 本月有效客户
        monthNew: 0                         // 本月新增客户
      }
    },
    mounted () {
      this.backCount()
    },
    methods: {
      backCount () {
        this.customer.usersCount().then(res => {
          this.todayNew= res.result.todayNew
          this.total= res.result.total
          this.monthAvailable= res.result.monthAvailable
          this.monthNew= res.result.monthNew
        }).catch(e => {
          if (e.data && e.data.msg) {
            this.$message({
              message: e.data.msg?e.data.msg:'请求出错',
              type: 'error'
            })
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
