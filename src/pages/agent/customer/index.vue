<template>
  <div>
    <Customer></Customer>
    <div class="customer main-content-style">
      <List/>
    </div>
  </div>

</template>

<script>
  import List from './list'
  import Customer from '../../../components/home/customer.vue'
  export default {
    components: {
      List,
      Customer
    },
    data () {
      return {

      }
    }
  }
</script>
<style lang="less">
  @import "../../../assets/css/theme.less";
  .customer{
    .el-tabs__header{
      display: none !important;
    }
  }

</style>
