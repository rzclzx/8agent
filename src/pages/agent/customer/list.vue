<template>
  <div class="customer-list">
    <div class="flex search">
      <el-row style="width:100%;min-height:30px;line-height:30px;color:#24324C;clear:both;">
        <el-col :span="6" class="font-color">
          <span style="padding-left: 16px;color:#24324C;">注册时间：</span>
          <el-date-picker
            class="w230"
            size="small"
            v-model="range"
            type="daterange"
            :clearable="false"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-col>
        <el-col :span="5" class="font-color">
          <div>
            <span style="color:#24324C;">是否初级认证：</span>
            <el-radio v-model="authStatus" label="1">是</el-radio>
            <el-radio v-model="authStatus" label="0">否</el-radio>
            <el-radio v-model="authStatus" label="">不限</el-radio>
          </div>
        </el-col>
        <el-col :span="5" class="font-color">
          <div>
            <span style="color:#24324C;">是否交易过：</span>
            <el-radio v-model="tradeStatus" label="1">是</el-radio>
            <el-radio v-model="tradeStatus" label="0">否</el-radio>
            <el-radio v-model="tradeStatus" label="">不限</el-radio>
          </div>
        </el-col>
        <!-- <el-col :span="5" class="font-color">
          <div>
            <span style="color:#24324C;">是否有效：</span>
            <el-radio v-model="available" label="1">是</el-radio>
            <el-radio v-model="available" label="0">否</el-radio>
            <el-radio v-model="available" label="">不限</el-radio>
          </div>
        </el-col> -->
        <el-col :span="3" style="float:right;">
          <div class="end">
            <el-button type="primary" @click="refresh(1)" size="small">搜索</el-button>
            <el-button @click="clear" style="color:#667AA0;" size="small">清空</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          class-name="first-column"
          align="left"
          min-width="150"
          label="客户账号">
          <template slot-scope="scope">
            <span>{{ scope.row.customerName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="registerTime"
          min-width="140"
          label="注册时间">
        </el-table-column>
        <el-table-column
          prop="brokerage"
          align="right"
          min-width="180"
          label="获得返佣">
          <template slot-scope="scope">
            <a class="link" style="text-decoration:underline;" v-if="$store.state.user.userType == 1" @click="rowClick(scope.row)">{{ scope.row.brokerage}}  <span>USDT</span></a>
            <span v-else>{{ scope.row.brokerage}} <span style="color:#758896">USDT</span></span>
          </template>
        </el-table-column>
         <el-table-column
          prop="authStatus"
          align="right"
          min-width="130"
          label="平台返佣比率(%)">
          <template slot-scope="scope">
            <span>{{ muls(scope.row.inviteePlatform,100) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="authStatus"
          align="right"
          min-width="130"
          label="平台返佣周期(月)">
          <template slot-scope="scope">
            <span>{{ scope.row.platformInterval }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="authStatus"
          align="right"
          min-width="130"
          label="补贴返佣比率(%)">
          <template slot-scope="scope">
            <span>{{ scope.row.inviteeSubsidy ? muls(scope.row.inviteeSubsidy,100)  : '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="authStatus"
          align="center"
          min-width="100"
          label="是否初级认证">
          <template slot-scope="scope">
            <span>{{ scope.row.authStatus | toBool({ '0': '否', '1': '是'}) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="tradeStatus"
          align="center"
          label="是否交易过">
          <template slot-scope="scope">
            <span>{{ scope.row.tradeStatus | toBool({ '0': '否', '1': '是'}) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="available"
          align="center"
          label="是否有资产">
          <template slot-scope="scope">
            <span>{{ scope.row.haveAssets | toBool({ '0': '否', '1': '是'}) }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="available"
          align="center"
          label="是否有效">
          <template slot-scope="scope">
            <span>{{ scope.row.available | toBool({ '0': '否', '1': '是'}) }}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          align="center"
          class-name="operates"
          width="250"
          label="操作">
          <template slot-scope="scope">
            <span class="link"  v-if="$store.state.user.userType == 1" @click="queryClick(scope.row)">查看持仓 </span>
            <span class="link" style="margin:0 10px;" @click="setSubsidy(scope.row)">设置补贴 </span>
            <span class="link" :class="scope.row.inviteeSubsidy===0?'disabled':''" @click="showDetail(scope.row)">查看补贴详情</span>
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
    <DetailAalert
    v-if="detailShow"
    :detailinfo="detailinfo"
    :closeCallback="closeCallback"
    ></DetailAalert>
    <SetSubsidy
      v-if="setsubsidy"
      :closeCallback="closeCallback"
      :detailinfo="rowInfo"
      :refreshList="refresh"
    ></SetSubsidy>
  </div>
</template>

<script>
import DetailAalert from '../../../components/customer/detail-alert'
import SetSubsidy from '../../../components/customer/setSubsidy'
import {Decimal} from 'decimal.js'
export default {
  components: {
    DetailAalert,
    SetSubsidy
  },
  data () {
    return {
      authStatus: '',
      options: [
        {
          value: 1,
          label: '是'
        },
        {
          value: 0,
          label: '否'
        }
      ],
      tradeStatus: '',
      available: '',
      page: 1,
      pageSize: 20,
      total: 0,
      tableData: [],
      range: [],
      detailinfo: {},
      detailShow: false,
      setsubsidy: false,
      rowInfo: {}
    }
  },
  created () {
    this.refresh()
  },
  computed: {

  },
  methods: {
    muls (val,format) {
      return Number(new Decimal(val).mul(format))
    },
    closeCallback () {
      this.detailShow = false
      this.setsubsidy = false
    },
    showDetail (row) {
      if (row.inviteeSubsidy<=0) {
        return
      }
      this.detailShow = true
      this.detailinfo = row
    },
    setSubsidy (row) {
      this.setsubsidy = true
      this.rowInfo = row
    },
    rowClick (row) {
      let sessionTitle = this.$store.state.title_nav_main1
      let status = false
      sessionTitle.map((item) => {
        if (item.path === '/agent/rebatedetail') {
          status = true
        }
      })
      if (!status) {
        this.$store.commit('setTitleSession',{
          path: "/agent/rebatedetail",
          name: "返佣详情",
          query: {
            customerId: row.customerName
          }
        })
      } else {
        this.$store.commit('replaceQuery',{
          path: "/agent/rebatedetail",
          name: "返佣详情",
          query: {
            customerId: row.customerName
          }
        })
      }
      this.$router.push({
        path: "/agent/rebatedetail",
        name: "返佣详情",
        query: {
          customerId: row.customerName
        }
      })
    },
    queryClick (row) {
      let sessionTitle = this.$store.state.title_nav_main1
      let status = false
      sessionTitle.map((item) => {
        if (item.path === '/agent/holdcabin') {
          status= true
        }
      })
      if (!status) {
        this.$store.commit('setTitleSession',{
          path: "/agent/holdcabin",
          name: "持仓",
          query: {
            customerId: row.customerId
          }
        })
      } else {
        this.$store.commit('replaceQuery',{
          path: "/agent/holdcabin",
          name: "持仓",
          query: {
            customerId: row.customerId
          }
        })
      }
      this.$router.push({
        path: "/agent/holdcabin",
        name: "持仓",
        query: {
          customerId: row.customerId
        }
      })
    },
    clear () {
      this.range = []
      this.authStatus = ''
      this.tradeStatus = ''
      this.available = ''
    },
    pageChange (val) {
      this.page = val
      this.refresh()
    },
    refresh (type) {
      if (type) {
        this.page = 1
      }
      let myObj = {
        page: this.page,
        pageSize: this.pageSize,
        beginTime: this.range[0],
        endTime: this.range[1],
        authStatus: this.authStatus,
        tradeStatus: this.tradeStatus,
        available: this.available
      }
      this.customer.usersQuery(myObj).then(res => {
        this.tableData = res.result.data
        this.total = res.result.page.totals
      }).catch(e => {
        if (e.data && e.data.msg) {
          this.$message({
            message: e.data.msg,
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
.customer-list{
  .el-table{
    /*.operates{*/
      /*.cell{*/
        /*padding-right:20px;*/
      /*}*/
    /*}*/
    /*.el-table__header-wrapper{*/
      /*.operates{*/
        /*.cell{*/
          /*padding-right:32px;*/
        /*}*/
      /*}*/
    /*}*/
  }
  .el-range__close-icon{
      display: none;
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
    margin-bottom: 0;
  }
  .header-msg {
    background: #666666;
    color: #ffd04b;
    height: 100px;
  }
  .header-msg-content {
    font-size: 18px;
    margin-top: 10px;
  }
  .w178 {
    width: 178px;
  }
  .w230 {
    width: 60% !important;
    min-width: 160px;
  }
  .end {
    flex-grow: 1;
    .flex-box(@justifyContent: flex-end, @alignItem: center);
  }
  .w90 {
    width: 90px;
  }
  .search {
    margin-bottom: 20px;
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
    .el-range__close-icon{
      display: none;
    }
  }
  .w75 {
    width: 75px;
  }
  .link {
    cursor: pointer;
    color: #1890FF;
  }

  .link:hover {
    text-decoration: underline;
  }
  .disabled{
    color: #758896;
  }
  .disabled:hover {
    text-decoration: none;
    cursor: not-allowed;
  }
}
</style>
