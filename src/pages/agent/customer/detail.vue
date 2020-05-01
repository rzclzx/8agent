<template>
  <div>
    <div class="flex form" v-if="$store.state.user.userType === 2">
      <span style="padding-left: 10px;">交易时间：</span>
      <el-date-picker
        class="w250"
        size="small"
        v-model="range"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="timestamp"
        :default-time="['00:00:00', '23:59:59']">
      </el-date-picker>
      <div class="end">
        <el-button type="primary" @click="refresh" size="small">搜索</el-button>
        <el-button @click="clear" size="small">清空</el-button>
      </div>
    </div>
    <div>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="dealTime"
          width="200"
          label="交易时间">
        </el-table-column>
        <el-table-column v-if="$store.state.user.userType === 2"
          prop="customerAccount"
          label="客户账号">
        </el-table-column>
        <el-table-column v-if="$store.state.user.userType === 2"
          prop="dealType"
          align="center"
          label="交易类型">
          <template slot-scope="scope">
            <span>{{ scope.row.dealType | toBool({ '0': '合约交易'}) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="$store.state.user.userType === 2"
          prop="brokerageCount"
          align="right"
          width="250"
          label="总手续费">
        </el-table-column>
        <el-table-column v-if="$store.state.user.userType === 2"
          prop="returnRatio"
          align="right"
          label="返佣比率">
          <template slot-scope="scope">
            <span>{{ scope.row.returnRatio | toRate(0) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="rakeBack"
          align="right"
          width="250"
          label="获得返佣">
        </el-table-column>
      </el-table>
    </div>
    <div class="page">
      <el-pagination
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
    props: {
      customerId: null
    },
    data () {
      return {
        page: 1,
        pageSize: 20,
        total: 0,
        tableData: [],
        range: []
      }
    },
    created () {
      this.refresh()
    },
    methods: {
      clear () {
        this.range = []
      },
      pageChange (val) {
        this.page = val
        this.refresh()
      },
      refresh () {
        let myObj = {
          page: this.page,
          pageSize: this.pageSize,
          customerAccount: this.id,
          beginDate: this.range[0],
          endDate: this.range[1],
          customerId: this.customerId
        }
        this.profit.backRofit(myObj).then(res => {
          this.tableData = res.result.data
          this.total = res.result.page.totals
        }).catch(e => {
          if (e.data && e.data.message) {
            this.$message({
              message: e.data.message,
              type: 'error'
            })
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../assets/css/theme.less";
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
  .header-msg-title {
    margin-top: 20px;
    font-size: 20px;
  }
  .header-msg-content {
    font-size: 18px;
    margin-top: 10px;
  }
  .form {
    margin: 30px 0;
  }
  .w178 {
    width: 178px;
  }
  .w250 {
    width: 250px;
  }
  .end {
    flex-grow: 1;
    .flex-box(@justifyContent: flex-end, @alignItem: center);
  }
  .w90 {
    width: 90px;
  }
</style>
