<template>
  <div class="assembly">
    <div class="assembly-header">
      <img src="../../assets/images/separate.png" alt="">
      收益
    </div>
    <div class="assembly-content">
      <el-row type="flex" class="assembly-content-row clearfix">
        <el-col :span="6" class="assembly-content-col">
          <img src="../../assets/images/syfyzh.png" alt="">
          <div class="profit-info" style="max-width:calc(100% - 48px)">
            <div class="header-msg-title">上月返佣折合（USDT）</div>
            <div class="header-msg-content">{{ lastMonthCount | number_format(lastMonthCount ===0?8:lastMonthCount.toString().indexOf('.') != -1?lastMonthCount.toString().split('.')[1].length:0) }}</div>
          </div>
        </el-col>
        <el-col :span="6" class="assembly-content-col">
          <img src="../../assets/images/ljfyzh.png" alt="">
          <div class="profit-info" style="max-width:calc(100% - 48px)">
            <div class="header-msg-title">累计返佣折合（USDT）</div>
            <div class="header-msg-content">{{ poolCount | number_format(poolCount===0?8:poolCount.toString().indexOf('.') != -1?poolCount.toString().split('.')[1].length:0) }}</div>
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
        lastMonthCount: 0,
        poolCount: 0
      }
    },
    mounted () {
      this.backCount()
    },
    methods: {
      backCount () {
        this.profit.backCount().then(res => {
          this.lastMonthCount = res.result.data.lastMonthCount
          this.poolCount = res.result.data.poolCount
          // this.returnRatioNow = res.result.data.returnRatioNow
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