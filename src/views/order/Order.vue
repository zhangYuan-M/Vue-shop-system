<template>
  <div class="order">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 1.搜索框区域 -->
      <el-row style="margin-bottom: 15px">
        <el-col :span="12">
          <el-input placeholder="请输入内容" v-model="inputValue">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 2.表格区域 -->
      <el-table :data="orderList" stripe style="width: 100%" border>
        <el-table-column type="index" label="#" width="50">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="490">
        </el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template slot-scope="slot">
            <el-tag type="success" v-if="slot.row.order_pay == 1">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格">
        </el-table-column>
        <el-table-column prop='is_send' label="是否发货"></el-table-column>
        <el-table-column prop='create_time' label="下单时间" width="170px">
          <template slot-scope="slot">
            {{slot.row.create_time | formatDataFilter }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="slot">
            <el-button type="primary" class="el-icon-edit tton" size="small"
              @click="isShowAddress = true">

            </el-button>
            <el-button type="success" class="el-icon-setting" size="small" @click="expressBtnClick">

            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 3.分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 20]"
        :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 模板一：点击修改地址 -->
    <el-dialog title="编辑地址" :visible.sync="isShowAddress" width="50%"
      @close="resetForm('editFormRef')">
      <!-- 内容主体区域 -->
      <el-form :model="editFormInfo" :rules="editFormRules" ref="editFormRef">
        <el-form-item label="省市区" label-width="80px" prop="address1">
          <el-cascader v-model="editFormInfo.selectArray" :options="cityDate" style="width: 100%">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" label-width="80px" prop="address2">
          <el-input placeholder="请填写地址信息" v-model="editFormInfo.address2"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer">
        <el-button @click="isShowAddress = false">取 消</el-button>
        <el-button type="primary" @click="deineClick('editFormRef')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 模板二：查看物流信息 -->
    <el-dialog title="查看物流" :visible.sync="isShowExpressDialog" width="50%">
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in expressInfo" :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { handlePage, resetFormData, defineClick } from 'common/mixins.js'
import { getOrdersData, getExpressData } from 'network/order/order.js'
import { formatDate } from 'common/utils.js'
import cityDate from 'assets/citydata.js'
export default {
  data() {
    return {
      isShowExpressDialog: false,
      editFormRules: {
        address1: [{ required: true, message: '请输入', trigger: 'blur' }],
        address2: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      isShowAddress: false,
      editFormInfo: {
        address2: '',
        selectArray: []
      },
      cityDate,
      inputValue: '',
      orderList: [],
      total: 0,
      expressInfo: []
    }
  },
  mixins: [handlePage, resetFormData],
  created() {
    this.getListData()
  },
  methods: {
    // 初始化表格数据
    async getListData() {
      const res = await getOrdersData(this.queryInfo)
      console.log(res)
      // 错误处理
      if (res.meta.status !== 200) {
        return this.$message.warning(res.meta.msg)
      }
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    // 点击编辑地址信息
    deineClick(ref) {
      this.deineClick(ref).then(
        res => {},
        err => {}
      )
    },
    // 查看物流信息
    async expressBtnClick() {
      // 获取数据
      const res = await getExpressData()
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.expressInfo = res.data
      this.isShowExpressDialog = true
    }
  },
  filters: {
    formatDataFilter(value) {
      // 获取时间戳
      const timer = new Date(value)
      return formatDate(timer, 'yyyy-MM-dd hh:mm:ss')
    }
  }
}
</script>

<style scoped>
</style>