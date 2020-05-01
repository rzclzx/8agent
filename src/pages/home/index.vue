<template>
	<div class="home-index">
    <Profit></Profit>
    <Customer></Customer>
    <Quanyi></Quanyi>
	</div>
</template>

<script>
import Profit from "../../components/home/profit"
import Customer from '../../components/home/customer'
import Quanyi from '../../components/home/quanyi'
export default {
  components: {
    Profit,Customer,Quanyi
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  created () {
  },
  methods: {
    name () {
    }
  }
}
</script>

<style lang="less" scoped>
  .home-index{
    background: none;
  }
</style>