<template>
  <div class="agent-alert">
    <div class="alert-model">
      <div class="header-alert">
        补贴详情
        <span class="close" @click="closeCallback"><img src="../../assets/images/svg/close-hover.svg" alt=""></span>
      </div>
      <div class="content-alert">
        <div>
          <span class="span1">补贴返佣率：</span>
          <span class="span2">{{detailinfo.inviteeSubsidy | toRate() }}</span>
        </div>
        <div>
          <span class="span1">补贴返佣周期：</span>
          <span class="span2">{{cycle}}个月</span>
        </div>
        <div>
          <span class="span1">补贴开始月份：</span>
          <span class="span2">{{detailinfo.subsidyStart}}</span>
        </div>
        <div>
          <span class="span1">补贴结束月份：</span>
          <span class="span2">{{detailinfo.subsidyEnd}}</span>
        </div>
      </div>
      <div class="footer-alert">
        <button @click="closeCallback">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    detailinfo: {
      type: Object,
      default: {},
      required: false
    },
    closeCallback: Function
  },
  data () {
    return {
    }
  },
  computed: {
    cycle () {
      if (this.detailinfo.subsidyStart && this.detailinfo.subsidyEnd) {
        let cycle = this.CalculationMonth(this.detailinfo.subsidyStart,this.detailinfo.subsidyEnd)
        return cycle+1
      } else {
        return ''
      }
    }
  },
  methods: {
    CalculationMonth (start,end) {
      var date1 = start
      var date2 = end
      // 拆分年月日
      date1 = date1.split('-')
      // 得到月数
      date1 = parseInt(date1[0]) * 12 + parseInt(date1[1])
      // 拆分年月日
      date2 = date2.split('-')
      // 得到月数
      date2 = parseInt(date2[0]) * 12 + parseInt(date2[1])
      return date2 - date1
    }
  }
}
</script>

<style lang='less' scoped>
.agent-alert{
  position: fixed;
  left:0;
  top:0;
  background:  rgba(0,0,0,0.3);
  width: 100%;
  height: 100%;
  z-index: 10;
  min-height:500px;
  .alert-model{
    width: 382px;
    overflow: hidden;
    background: #FFFFFF;
    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.20);
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    min-height:100px;
    .header-alert{
      height: 40px;
      border-bottom:1px solid #EAF1F6;
      line-height: 40px;
      font-size: 14px;
      color: #34495E;
      font-weight: 600;
      padding-left: 20px;
      .close{
        display: inline-block;
        position: absolute;
        right: 12px;
        top:9px;
        width: 22px;
        height: 22px;
      }
    }
    .content-alert{
      padding: 20px 40px 30px;
      div{
        margin-bottom: 16px;
        span{
          display: inline-block;
        }
        .span1{
          width: 100px;
          font-size: 14px;
          color: #758896;
          text-align: right;
        }
        .span2{
          font-size: 14px;
          color: #34495E;
        }
      }
      div:nth-last-child(1){
        margin-bottom: 0;
      }
    }
    .footer-alert{
      height: 60px;
      background: #F4F9FC;
      text-align: center;
      padding: 14px 0;
      button{
        background: #0C9AFF;
        border-radius: 3px;
        color: #fff;
        width: 64px;
        height: 32px;
        border: none;
      }
      button:hover{
        cursor: pointer;
        background: #66b1ff;
      }
      button:focus{
        outline: none;
      }
    }
  }
}

</style>