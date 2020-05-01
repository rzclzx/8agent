<template>
  <div class="agent-alert">
    <div class="alert-model">
      <div class="header-alert">
        设置补贴
        <span class="close" @click="closeDailag"><img src="../../assets/images/svg/close-hover.svg" alt=""></span>
      </div>
      <div class="content-alert">
        <el-form :label-position="'right'" :rules="rules" ref="dataForms" label-width="100px" :model="dataForm">
          <el-form-item label="补贴返佣率：" prop="inviteeSubsidy">
            <el-input suffix-icon="btfyl iconfont icon-baifenhao" v-model="dataForm.inviteeSubsidy"></el-input>
          </el-form-item>
          <el-form-item label="补贴返佣周期：" prop="cycle">
            <el-input suffix-icon="btfyzq icon-baifenhao" v-model="dataForm.cycle"></el-input>
          </el-form-item>
          <el-form-item label="补贴开始月份：" prop="subsidyStart">
            <el-date-picker
              v-model="dataForm.subsidyStart"
              type="month"
              :clearable="false"
              @change="beginDate"
              value-format="yyyy-MM"
              placeholder="选择补贴开始月份"
              :picker-options="pickerOptionsStart">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="补贴结束月份：" prop="subsidyEnd">
            <el-date-picker
              v-model="dataForm.subsidyEnd"
              type="month"
              :clearable="false"
              @change="endMonth"
              value-format="yyyy-MM"
              placeholder="选择补贴结束月份"
              :disabled="disabledSubsidyEnd"
              :picker-options="pickerOptionsEnd">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <p :style="{'text-align': 'center','color': '#FF1564','font-size': '12px','line-height': '20px','margin-top': errMsg?'20px':'0'}">{{errMsg}}</p>
      </div>
      <div class="footer-alert">
        <button
          v-loading.fullscreen.lock="fullscreenLoading"
          @click="submit('dataForms')">提交</button>
      </div>
    </div>
  </div>
</template>

<script>
import {Decimal} from 'decimal.js'
export default {
  props: {
    closeCallback: Function,
    refreshList: Function,
    detailinfo: {
      type: Object,
      default: {},
      required: false
    }
  },
  data () {
    var inviteeSubsidy = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('补贴返佣率不能为空'))
      } else if (!/^\d+$/.test(value)) {
        return callback(new Error('请输入整数'))
      } else if (value > this.detailinfo.maxSubsidy*100) {
        return callback(new Error('补贴返佣率最大为'+this.detailinfo.maxSubsidy*100+'%'))
      } else {
        callback()
      }
    }
    var cycle = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('补贴返佣周期不能为空'))
      } else if (!/^\d+$/.test(value)) {
        return callback(new Error('请输入整数'))
      } else if (value < 1) {
        return callback(new Error('返佣周期最小为1，请重新选择'))
      } else if (value > 24) {
        return callback(new Error('返佣周期最大为24个月'))
      } else {
        callback()
      }
    }
    var subsidyStart = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('补贴开始月份不能为空'))
      } else if (new Date(value) < new Date(new Date().getFullYear()+ '-' +(new Date().getMonth()+1))) {
        return callback(new Error('补贴开始月份不能小于当前月份'))
      } else {
        callback()
      }
    }
    var subsidyEnd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('补贴结束月份不能为空'))
      } else {
        callback()
      }
    }
    return {
      errMsg: '',
      dataForm: {
        inviteeId: this.detailinfo.customerId, // 被邀请人用户id
        subsidyStart: this.detailinfo.subsidyStart,// 补贴开始时间
        subsidyEnd: this.detailinfo.subsidyEnd, // 补贴结束时间
        inviteeSubsidy: this.muls(this.detailinfo.inviteeSubsidy, 100) ? this.muls(this.detailinfo.inviteeSubsidy, 100) : '' , // 补贴比率
        cycle: '' // 周期
      },
      rules: {
        subsidyStart: [
          { validator: subsidyStart, trigger: 'change' }
        ],
        subsidyEnd: [
          { validator: subsidyEnd, trigger: 'change' }
        ],
        inviteeSubsidy: [
          { validator: inviteeSubsidy, trigger: 'change' }
        ],
        cycle: [
          { validator: cycle, trigger: 'change' }
        ]
      },
      fullscreenLoading: false,
      // 开始日期
      pickerOptionsStart: {
        disabledDate: (time) => {
          return time.getTime() < Date.now()
        }
      },
      // 结束日期(不能小于开始日期)
      pickerOptionsEnd: {
        disabledDate: (time) => {
          if (this.dataForm.subsidyStart) {
            return time.getTime() < new Date(this.dataForm.subsidyStart)
          } else {
            return time.getTime() < Date.now()
          }
        }
      },
      disabledSubsidyEnd: true
    }
  },
  watch: {
    "dataForm.cycle" () {
      if (!this.dataForm.subsidyEnd && this.dataForm.subsidyStart) {
        this.dataForm.subsidyEnd = this.addMonth(this.dataForm.subsidyStart,this.dataForm.cycle)
      } else if (this.dataForm.subsidyEnd && !this.dataForm.subsidyStart) {
        this.dataForm.subsidyStart = this.reduceMonth(this.dataForm.subsidyEnd,this.dataForm.cycle)
      } else if (this.dataForm.subsidyEnd && this.dataForm.subsidyStart && this.dataForm.cycle) {
        this.dataForm.subsidyEnd = this.addMonth(this.dataForm.subsidyStart,this.dataForm.cycle)
      } else if (!this.dataForm.cycle) {
        this.dataForm.subsidyEnd=''
      }
    },
    "dataForm.subsidyStart" () {
      this.dataForm.subsidyStart ? this.disabledSubsidyEnd = false : this.disabledSubsidyEnd = true
      return this.disabledSubsidyEnd
    }
  },
  methods: {
    muls (val,format) {
      return Number(new Decimal(val).mul(format))
    },
    // 关闭弹窗
    closeDailag () {
      this.dataForm.inviteeId = ''
      this.dataForm.subsidyStart = ''
      this.dataForm.subsidyEnd = ''
      this.dataForm.inviteeSubsidy = ''
      this.dataForm.cycle = ''
      this.closeCallback()
    },
    endMonth () {
      if (!this.dataForm.subsidyStart && this.dataForm.cycle) {
        this.dataForm.subsidyStart = this.reduceMonth(this.dataForm.subsidyEnd,this.dataForm.cycle)
      } else if (this.dataForm.subsidyStart && !this.dataForm.cycle) {
        let cyc = this.CalculationMonth(this.dataForm.subsidyStart,this.dataForm.subsidyEnd)
        if (cyc < 0) {
          this.dataForm.cycle = cyc -1
        } else {
          this.dataForm.cycle = cyc +1
        }
      } else if (this.dataForm.subsidyStart && this.dataForm.cycle) {
        this.dataForm.subsidyStart = this.reduceMonth(this.dataForm.subsidyEnd,this.dataForm.cycle)
      }
    },
    beginDate () {
      if (!this.dataForm.subsidyEnd && this.dataForm.cycle) {
        this.dataForm.subsidyEnd = this.addMonth(this.dataForm.subsidyStart,this.dataForm.cycle)
      } else if (this.dataForm.subsidyEnd && !this.dataForm.cycle) {
        let cyc = this.CalculationMonth(this.dataForm.subsidyStart,this.dataForm.subsidyEnd)
        if (cyc < 0) {
          this.dataForm.cycle = cyc -1
        } else {
          this.dataForm.cycle = cyc +1
        }
      } else if (this.dataForm.subsidyEnd && this.dataForm.cycle) {
        this.dataForm.subsidyEnd = this.addMonth(this.dataForm.subsidyStart,this.dataForm.cycle)
      }
    },
    // 加月份
    addMonth (month,num) {
      let d = new Date(month)
      d.setMonth(d.getMonth()+(num-1))
      let year = d.getFullYear()
      let mounth = (d.getMonth()+1)<10?'0'+(d.getMonth()+1):(d.getMonth()+1)
      return year +'-'+ mounth
    },
    // 减月份
    reduceMonth (month,num) {
      let d = new Date(month)
      d.setMonth(d.getMonth()-(num-1))
      let year = d.getFullYear()
      let mounth = (d.getMonth()+1)<10?'0'+(d.getMonth()+1):(d.getMonth()+1)
      return year +'-'+ mounth
    },
    // 计算多少个月
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
    },
    // 获取设置的周期
    getCycle () {
      if (this.detailinfo.subsidyStart && this.detailinfo.subsidyEnd) {
        this.dataForm.cycle = this.CalculationMonth(this.detailinfo.subsidyStart,this.detailinfo.subsidyEnd) + 1
      }
    },
    submit (formName) {
      this.errMsg = ''
      let $this =this
      $this.$refs['dataForms'].validate((valid) => {
        if (valid) {
          let dataNum = this.CalculationMonth(this.dataForm.subsidyStart,this.dataForm.subsidyEnd)
          if (dataNum < 0) {
            this.errMsg = "补贴结束月份不能小于补贴开始月份"
          } else {
            this.fullscreenLoading = true
            this.customer.usersSubsidy({
              inviteeId: this.dataForm.inviteeId, // 被邀请人用户id
              subsidyStart: this.dataForm.subsidyStart,// 补贴开始时间
              subsidyEnd: this.dataForm.subsidyEnd, // 补贴结束时间
              inviteeSubsidy: this.dataForm.inviteeSubsidy/100, // 补贴比率
              cycle: this.dataForm.cycle // 周期
            })
              .then(res => {
                this.$message({
                  message: res.msg,
                  type: 'success'
                })
                this.closeCallback()
                this.refreshList()
                this.fullscreenLoading = false
              })
              .catch(err => {
                this.$message({
                  message: err.data.msg,
                  type: 'error'
                })
                this.fullscreenLoading = false
              })
          }
        } else {
          console.log('error submit!!')
        }
      })
    }
  },
  created () {
    this.getCycle()
  }
}
</script>

<style lang='less' >
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
    overflow: hidden;
    width: 382px;
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
      .el-form-item__error{
        padding-top:2px;
      }

      .btfyl::before{
        content: "%";
        font-size: 14px;
        margin-right: 5px;
      }
      .btfyzq::before{
        content: "月";
        font-size: 14px;
        margin-right: 5px;
        font-style: normal;
      }
      .el-form-item{
        margin-bottom: 16px !important;
      }
      .el-form-item:nth-last-child(1){
        margin-bottom: 0px !important;
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
