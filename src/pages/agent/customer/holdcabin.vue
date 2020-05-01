<template>
  <div class="main-content-style">
    <div class="flex form">
      <div>
        <span style="padding-left: 16px;color:#24324C;font-size:14px;">交易类型：</span>
        <el-select v-model="transType" placeholder="不限" size="small">
          <el-option
            v-for="item in transTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
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
          prop="transType"
          class-name="first-column"
          align="left"
          label="交易类型">
          <template slot-scope="scope">
            <span>{{ scope.row.transType | toBool({ '0': '合约交易','2':'现货'}) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="productName"
          align="right"
          label="交易对">
        </el-table-column>
        <el-table-column
          prop="side"
          align="center"
          label="多空">
          <template slot-scope="scope">
            <span :style="{ color: scope.row.side === 1 ? '#5ba299' : '#fc0d1b' }">{{ scope.row.side | toSide }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="positionTotal"
          align="right"
          label="总仓">
        </el-table-column>
        <el-table-column
          prop="positionAvailable"
          align="right"
          label="可用">
        </el-table-column>
        <el-table-column
          prop="positionAvgPrice"
          align="right"
          label="持仓均价">
        </el-table-column>
        <el-table-column
          prop="leverAge"
          align="right"
          label="实际杠杆">
        </el-table-column>
        <el-table-column
          prop="occupyMargin"
          align="right"
          label="占用保证金">
        </el-table-column>
        <el-table-column
          prop="unReachCash"
          class-name="unreachcash"
          align="right"
          label="未实现盈亏">
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
        transType: '',
        customerId: null,
        transTypeOptions: [
          {
            value: 0,
            label: '合约交易'
          }
        ]
      }
    },
    created () {
      this.customerId = this.$route.query.customerId
      this.refresh()
    },
    methods: {
      clear () {
        this.transType = ''
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
          transType: this.transType,
          customerId: this.customerId
        }
        this.customer.positionsQuery(myObj).then(res => {
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
  .w250 {
    width: 230px !important;
  }
  .w178 {
    width: 178px;
  }
  .end {
    flex-grow: 1;
    .flex-box(@justifyContent: flex-end, @alignItem: center);
  }
  .w100 {
    width: 100px;
  }
</style>
