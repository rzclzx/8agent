<template>
  <div class="main-content-style">
    <div class="flex form" >
      <span style="padding-left:16px;color:#24324C;font-size:14px;">交易时间：</span>
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
      <div class="end">
        <el-button type="primary" @click="refresh(1)" size="small">搜索</el-button>
        <el-button @click="clear" size="small">清空</el-button>
      </div>
    </div>
    <div>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="dealTime"
          class-name="first-column"
          align="left"
          width="280"
          label="交易时间">
        </el-table-column>
        <el-table-column
          prop="customerAccount"
          width="180"
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
          width="250"
          label="总手续费">
          <template slot-scope="scope">
            <span>{{ scope.row.brokerageCount }} <span style="color:#758896">{{ scope.row.currency}}</span></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="returnRatio"
          align="right"
          label="返佣比率">
          <template slot-scope="scope">
            <span>{{ scope.row.returnRatio }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="rakeBack"
          class-name="rakeback"
          align="right"
          width="250"
          label="获得返佣">
          <template slot-scope="scope">
            <span>{{ scope.row.rakeBack }} <span style="color:#758896">{{ scope.row.currency}}</span></span>
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
        page: 1,
        pageSize: 20,
        total: 0,
        tableData: [],
        range: [],
        customerId: null
      }
    },
    created () {
      this.customerId = this.$route.query.customerId
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
      refresh (type) {
        if (type) {
          this.page = 1
        }
        let myObj = {
          page: this.page,
          pageSize: this.pageSize,
          customerAccount: this.customerId,
          beginDate: this.range[0],
          endDate: this.range[1]
        }
        if (this.customerId) {
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
        } else {
          this.$message({
            message: "缺少参数!",
            type: 'error'
          })
        }
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
  .header-msg-content {
    font-size: 18px;
    margin-top: 10px;
  }
  .form {
    margin: 0 0 20px;
  }
  .w178 {
    width: 178px;
  }
  .w230 {
    width: 230px !important;
  }
  .end {
    flex-grow: 1;
    .flex-box(@justifyContent: flex-end, @alignItem: center);
  }
  .w90 {
    width: 90px;
  }
</style>
