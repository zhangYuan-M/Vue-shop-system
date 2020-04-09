<template>
  <div class="shop-list">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 1.搜索域和添加用户按钮 -->
      <el-row>
        <el-col :span="10">
          <div style="margin-top: 5px;">
            <el-input placeholder="请输入" v-model="queryInfo.query" clearable @clear="getListData">
              <el-button slot="append" icon="el-icon-search" @click="getListData"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" style="margin: 5px auto auto 15px;" @click="addShopClick">添加商品
          </el-button>
        </el-col>
      </el-row>

      <!-- 2.表格域 -->
      <el-table :data="goodsList" stripe border style="margin-top: 17px">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="510">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="120">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="180">
          <template slot-scope="slot">
            {{slot.row.add_time | handleTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="slot">
            <el-button type="primary" icon="el-icon-edit" size="small">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="small"
              @click="deleteClick(slot.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 3.分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 30]"
        :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

    </el-card>
  </div>
</template>

<script>
import { getGoodsInfo, deleteShopById } from 'network/shop/shopList.js'
import { handlePage } from 'common/mixins.js'
import { formatDate } from '../../common/utils.js'
export default {
  data() {
    return {
      total: 0, // 总页码数
      goodsList: [] //商品列表数据
    }
  },
  mixins: [handlePage],
  created() {
    this.getListData()
  },
  methods: {
    // 1.获取商品列表数据
    async getListData() {
      const res = await getGoodsInfo(this.queryInfo)
      console.log(res)
      // 错误处理
      if (res.meta.status !== 200) {
        return this.$message.warning(res.meta.msg)
      }
      // 保存数据
      this.total = res.data.total
      this.goodsList = res.data.goods
      console.log(this.goodsList)
    },
    // 2.根据id删除一行的数据
    async deleteClick(rowValue) {
      console.log(11)
      const res = await deleteShopById(rowValue.goods_id)
      // confirm确认删除提示框
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message({
            type: 'success',
            message: res.meta.msg
          })
          this.getListData()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 3.点击添加跳转路由
    addShopClick() {
      this.$router.push('/addshop')
    }
  },

  filters: {
    handleTime(value) {
      let time = new Date(value)
      return formatDate(time, 'yyyy-MM-dd hh:mm:ss')
    }
  }
}
</script>

<style scoped>
</style>