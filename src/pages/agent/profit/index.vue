<template>
<div>
  <ProfitTitle></ProfitTitle>
  <div class="profit main-content-style">
    <Profit />
  </div>
</div>

</template>

<script>
  import Profit from './profit'
  import ProfitTitle from '../../../components/home/profit.vue'
  export default {
    components: {
      Profit,ProfitTitle
    },
    data () {
      return {
        a: 890
      }
    }
  }
</script>
<style lang="less">
  @import "../../../assets/css/theme.less";
  .profit{
    .el-tabs__header{
      display: none !important;
    }
  }
</style>
