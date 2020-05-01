<template>
  <div>
    <!-- <el-row :gutter="24" class="profit-title">
      <el-col :span="8" class="profit-list">
        <img src="/static/img/lastm.png" alt="">
        <div class="profit-info">
          <div class="header-msg-title">上月返佣总计折合（USDT）</div>
          <div class="header-msg-content">{{ lastMonthCount }}</div>
        </div>

      </el-col>
      <el-col :span="8" class="profit-list">
        <img src="/static/img/total.png" alt="">
        <div class="profit-info">
          <div class="header-msg-title">累计返佣总计折合（USDT）</div>
          <div class="header-msg-content">{{ poolCount }}</div>
        </div>

      </el-col>
      <el-col :span="8" class="profit-list">
        <img src="/static/img/ratio.png" alt="">
        <div class="profit-info">
          <div class="header-msg-title">上月返佣比率</div>
          <div class="header-msg-content">{{ returnRatioNow | toRate(2) }}</div>
        </div>
      </el-col>
    </el-row> -->
    <el-form :model="forms" :rules="rules" ref="forms" class="flex form">
      <el-row style="width:100%;line-height:30px;height:30px;">
        <el-col :span="8" class="font-color">
          <span style="padding-left: 16px;">交易时间：</span>
          <el-date-picker
            class="w230"
            v-model="range"
            size="small"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :clearable="false"
            value-format="timestamp"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-col>
        <el-col :span="6" class="font-color" v-if="$store.state.user.userType === 1">
          <div class="flex">
            <span style="">客户账号：</span>
            <el-form-item prop="customerAccount" size="small">
              <el-input v-model="forms.customerAccount" placeholder="请输入客户账号" @keyup.enter.native="refresh"></el-input>
            </el-form-item>
          </div>
        </el-col>

        <el-col :span="6" class="font-color">
          <div>
            <span style="">是否结算：</span>
            <el-radio v-model="balanceStatus" label="1">是</el-radio>
            <el-radio v-model="balanceStatus" label="0">否</el-radio>
            <el-radio v-model="balanceStatus" label="">不限</el-radio>
          </div>
        </el-col>
        <el-col :span="4" style="float:right">
          <div class="end">
            <el-button type="primary" @click="refresh(1)" size="small">搜索</el-button>
            <el-button @click="clear" size="small">清空</el-button>
          </div>
        </el-col>

      </el-row>
    </el-form>
    <div>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="dealTime"
          class-name="first-column"
          align="left"
          width="250"
          label="交易时间">
        </el-table-column>
        <el-table-column
          prop="customerAccount"
          min-width="150"
          label="客户账号">
        </el-table-column>
        <el-table-column
          prop="dealType"
          align="center"
          label="交易类型">
          <template slot-scope="scope">
            <span>{{ scope.row.dealType | toBool({ '0': '合约交易'}) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="brokerageCount"
          align="right"
          min-width="180"
          label="总手续费">
          <template slot-scope="scope">
            <span>{{ scope.row.brokerageCount }} <span style="color:#758896">{{ scope.row.currency}}</span></span>
          </template>
        </el-table-column>
        <el-table-column
          align="right"
          min-width="120"
          label="返佣比率">
          <template slot-scope="scope">
            <span>{{ scope.row.returnRatio? scope.row.returnRatio : '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="rakeBack"
          align="right"
          min-width="180"
          label="获得返佣">
          <template slot-scope="scope">
            <span>{{ scope.row.rakeBack ? scope.row.rakeBack : '--' }} <span v-if="scope.row.rakeBack" style="color:#758896">{{
              scope.row.currency}}</span></span>
          </template>
        </el-table-column>
        <el-table-column
          class-name="sfjs"
          prop="status"
          align="right"
          min-width="150"
          label="是否结算">
          <template slot-scope="scope">
            <span>{{ scope.row.status | toBool({ '0': '否', '1': '是'}) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page">
      <el-pagination
        prev-text="上一页"
        next-text="下一页"
        :page-size="pageSize"
        :current-page.sync="page"
        @current-change="pageChange"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        forms: {},
        rules: {},
        lastMonthCount: '--',
        poolCount: '--',
        returnRatioNow: '--',
        page: 1,
        pageSize: 20,
        total: 0,
        tableData: [],
        range: [],
        balanceStatus: '',
        balanceOptions: [
          {
            value: 1,
            label: '是'
          },
          {
            value: 0,
            label: '否'
          }
        ]
      }
    },
    created () {
      this.backCount()
      this.refresh()
    },
    methods: {
      clear () {
        this.range = []
        this.balanceStatus = ''
        this.forms.customerAccount = ''
        // if (this.$store.state.user.userType === 2) {
        //   this.$refs.forms.resetFields()
        // } else {
        //   this.balanceStatus = ''
        // }
      },
      pageChange (val) {
        this.page = val
        this.refresh()
      },
      backCount () {
        this.profit.backCount().then(res => {
          this.lastMonthCount = res.result.data.lastMonthCount
          this.poolCount = res.result.data.poolCount
          this.returnRatioNow = res.result.data.returnRatioNow
        }).catch(e => {
          if (e.data && e.data.msg) {
            this.$message({
              message: e.data.msg?e.data.msg:'请求出错',
              type: 'error'
            })
          }
        })
      },
      refresh (type) {
        if (type) {
          this.page = 1
        }
        let myObj = {
          page: this.page,
          pageSize: this.pageSize,
          customerAccount: this.forms.customerAccount,
          status: this.balanceStatus,
          beginDate: this.range[0],
          endDate: this.range[1]
        }
        let that = this
        this.profit.backRofit(myObj).then(res => {
          if (res.code === 0) {
            this.tableData = res.result.data
            this.total = res.result.page.totals
          } else {
            that.$message({
              message: res.data.msg?res.data.msg:'请求出错',
              type: 'error'
            })
          }
        }).catch(e => {
          if (e.data && e.data.msg) {
            that.$message({
              message: e.data.msg?e.data.msg:'请求出错',
              duration: 1500,
              type: 'error'
            })
          }
        })
      }
    }
  }
</script>

<style lang="less">
  @import "../../../assets/css/theme.less";
  .el-table{
    .sfjs{
      .cell{
        padding-right:20px;
      }
    }
    .el-table__body-wrapper{
      .sfjs{
        .cell{
          padding-right:36px;
        }
      }
    }
  }
  .profit-title{
    border-bottom: 1px solid #EAF1F6;
    clear: both;
    .profit-list{
      padding: 10px 12px 30px 30px !important;
      img{
        width:36px;
        height:36px;
        float: left;
        margin-top: 6px;
      }
      .profit-info{
        float: left;
        padding-left:10px;
        .header-msg-title{
          font-size: 14px;
          color: #ADB5C7;
          line-height: 14px;
        }
        .header-msg-content{
          margin-top: 8px;
          font-size: 30px;
          color: #34495E;
          line-height: 30px;
        }
      }
    }
  }
  .flex {
    .flex-box(@justifyContent: flex-start, @alignItem: center);
  }
  .flex-center {
    .flex-box(@justifyContent: center, @alignItem: center);
  }
  .table-header {
    height: 50px;
    line-height: 50px;
    background: #666666;
    padding-left: 10px;
    color: #fff;
  }
  .page {
    .flex-box(@justifyContent: flex-end, @alignItem: center);
    height: 50px;
  }
  .el-form-item {
    margin-bottom: 0 !important;
  }

  .header-msg-title {
    // margin-top: 20px;
    // font-size: 20px;
  }
  // .header-msg-content {
  //   font-size: 18px;
  //   margin-top: 10px;
  // }
  .form {
    margin: 20px 0;
    .font-color{
      span{
        color:#24324C !important;
        font-weight: normal;
      }
      span.el-radio__label{
        font-size:12px;
      }
    }
    .end{
      span{
        font-size:12px;
        font-weight: normal;
      }
    }
  }
  .w178 {
    width: 178px;
  }
  .w230 {
    width: 60% !important;
    min-width:160px;
  }
  .end {
    flex-grow: 1;
    .flex-box(@justifyContent: flex-end, @alignItem: center);
  }
  .w90 {
    width: 90px;
  }

</style>
