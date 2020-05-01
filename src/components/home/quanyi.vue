<template>
  <div class="assembly">
    <div class="assembly-header">
      <img src="../../assets/images/separate.png" alt="">
      权益
    </div>
    <div class="assembly-content">
      <el-row type="flex" class="assembly-content-row clearfix">
        <el-col :span="6" class="assembly-content-col">
          <img src="../../assets/images/zfybl.png" alt="">
          <div class="profit-info" style="max-width:calc(100% - 48px)">
            <div class="header-msg-title clearfix">
              <span>总返佣比例 </span>
              <el-popover
                popper-class="home-tooltip"
                placement="top"
                width="212"
                trigger="hover"
                content="总返佣比率包括返给被邀请人的比率，经纪人实际返佣比率 = 总返佣比率 - 返给被邀请人的返佣比率。">
                <!-- <el-button >hover 激活</el-button> -->
                <span class="doubt" slot="reference"></span>
              </el-popover>
            </div>
            <div class="header-msg-content">{{ agentRatio | toRate(0) }}</div>
          </div>
        </el-col>
        <el-col :span="6" class="assembly-content-col">
          <img src="../../assets/images/mykpi.png" alt="">
          <div class="profit-info" style="max-width:calc(100% - 48px)">
            <div class="header-msg-title clearfix">
              <span>每月KPI（人）</span>
              <el-popover
                popper-class="home-tooltip"
                placement="top"
                width="212"
                trigger="hover"
                content="经纪人邀请一定数量的有效客户，当月才可享受经纪人返佣比率">
                <!-- <el-button >hover 激活</el-button> -->
                <span class="doubt" slot="reference"></span>
              </el-popover>
            </div>
            <div class="header-msg-content">{{ agentIndex }}</div>
          </div>
        </el-col>
        <el-col :span="6" class="assembly-content-col">
          <img src="../../assets/images/fyzq.png" alt="">
          <div class="profit-info" style="max-width:calc(100% - 48px)">
            <div class="header-msg-title">返佣周期</div>
            <div class="header-msg-content">永久返佣</div>
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
        agentRatio: 0,           // 总返佣比率
        agentIndex: 0,            // 每月KPI
        agentInterval: 1000        // 返佣周期
      }
    },
    mounted () {
      this.backCount()
    },
    methods: {
      backCount () {
        this.profit.configRights().then(res => {
          console.log(res)
          this.agentRatio = res.result.data.agentRatio
          this.agentIndex = res.result.data.agentIndex
          this.agentInterval = res.result.data.agentInterval
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
