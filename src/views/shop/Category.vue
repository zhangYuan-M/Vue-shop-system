<template>
  <div class="categoty">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 1.添加分类按钮 -->
      <el-button type="primary" style="margin-bottom:14px" @click="isShowAddShop = true">添加分类
      </el-button>

      <!-- 2.表格域 -->
      <zk-table :data="categoryList" :columns="columns" show-index index-text="#"
        :selection-type=false :expand-type="false" border empty-text="暂无" :show-row-hover="false">
        <!-- 1.自定义模板列 -->
        <template slot-scope="slot" slot="isValid">
          <i class="el-icon-success" v-if="slot.row.cat_deleted" style="color: green"></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>

        <!-- 2.自定义模板列 -->
        <template slot-scope="slot" slot="order">
          <el-tag v-if="slot.row.cat_level === 0">一级列表</el-tag>
          <el-tag type="success" v-else-if="slot.row.cat_level === 1">二级列表</el-tag>
          <el-tag type="warning" v-else>三级列表</el-tag>
        </template>

        <!-- 3.自定义模板列 -->
        <template slot="operation" slot-scope="slot">
          <el-button type="primary" size="mini" class="el-icon-edit"
            @click="isShowEditForm = true; currentRowValue = slot.row">
            编辑</el-button>
          <el-button type="danger" size="mini" class="el-icon-delete" @click="deleteById(slot.row)">
            删除</el-button>
        </template>

      </zk-table>

      <!-- 3. 分页区域 -->
      <el-pagination @size-change=" handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 30]"
        :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 模板一：添加商品分类对话框 -->
    <el-dialog title="添加商品" :visible.sync="isShowAddShop" width="50%"
      @close="resetForm('addFormRef')">
      <!-- 1.内容主体区域 -->
      <el-form :model="addShopInfo" :rules="addShopFormRules" ref="addFormRef">
        <el-form-item prop="cat_name" label="分类名称" label-width="80px">
          <el-input v-model="addShopInfo.cat_name"></el-input>
        </el-form-item>
        <!-- 级联选择器 -->
        <el-form-item prop="category" label-width="80px" label="请选择">
          <el-cascader v-model="selectArray" :options="AllCategoryList" :props="cascaderProps"
            clearable @change="handleChange"></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 2.底部按钮区域 -->
      <span slot="footer">
        <el-button @click="isShowAddShop = false">取 消</el-button>
        <el-button type="primary" @click="addFormDefined('addFormRef')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 模板二：编辑商品分类名称 -->
    <el-dialog title="修改分类" :visible.sync="isShowEditForm" width="50%"
      @close="resetForm('editShopRef')">
      <!-- 1.内容主体区域 -->
      <el-form :model="editInfo" :rules="addShopFormRules" ref="editShopRef">
        <el-form-item prop="cat_name" label="修改名称" label-width="80px">
          <el-input v-model="editInfo.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 2.底部按钮区域 -->
      <span slot="footer">
        <el-button @click="isShowEditForm = false">取 消</el-button>
        <el-button type="primary" @click="defineClickEdit('editShopRef')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCategoryData,
  addCategoryData,
  updatedShopName,
  deleteRowById
} from 'network/shop/category.js'
import { resetFormData, defineClick } from 'common/mixins.js'
export default {
  data() {
    return {
      currentRowValue: {},
      isShowEditForm: false,
      isShowAddShop: false,
      addShopFormRules: {
        cat_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      categoryList: [],
      queryInfo: {
        pagenum: 1,
        pagesize: 5
        // type: 3, 如果不传递，默认获取所有级别的数据
      },
      editInfo: {
        cat_name: ''
      },
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      AllCategoryList: [],
      selectArray: [], //级联选择器
      addShopInfo: {
        cat_name: '',
        cat_pid: '',
        cat_level: ''
      },
      total: 0,
      // 第三方table配置数据
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效', //自定义模板列
          prop: 'cat_deleted',
          type: 'template',
          template: 'isValid'
        },
        {
          label: '排序', //自定义模板列
          prop: 'cat_level',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作', //自定义模板列
          type: 'template',
          template: 'operation'
        }
      ]
    }
  },
  created() {
    this._getCategoryList()
    this._getAllCategoryList()
  },
  mixins: [resetFormData, defineClick],
  methods: {
    // 1. 初始化商品分类列表数据
    async _getCategoryList() {
      const res = await getCategoryData(this.queryInfo)
      console.log(res)
      // 错误处理
      if (res.meta.status !== 200) {
        return this.$message.warning(res.meta.msg)
      }
      // 保存数据
      this.categoryList = res.data.result
      this.total = res.data.total
    },
    // 2.分页size变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this._getCategoryList() // 初始化用户列表数据
    },
    // 3.分页数量变化
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this._getCategoryList() // 初始化用户列表数据
    },
    // 4.点击确定添加一个商品分类
    addFormDefined(ref) {
      this.defineClick(ref).then(
        async res => {
          const result = await addCategoryData(this.addShopInfo)
          // 错误处理
          console.log(result)
          if (result.meta.status !== 201) {
            return this.$message.warning(result.meta.msg)
          }
          this.$message.success(result.meta.msg)
          this.isShowAddShop = false
        },
        err => {}
      )
    },
    // 5.级联选择器改变
    handleChange() {
      const length = this.selectArray.length - 1
      this.addShopInfo.cat_pid = this.selectArray[length]
      this.addShopInfo.cat_level = length
    },
    // 6. 获取所有的列表
    async _getAllCategoryList() {
      // 如果不传递参数，默认获取所有的分类
      const res = await getCategoryData()
      // 错误处理
      if (res.meta.status !== 200) {
        return this.$message.warning(res.meta.msg)
      }
      // 保存数据
      this.AllCategoryList = res.data
    },
    // 7. 点击确定编辑商品分类名称
    defineClickEdit(ref) {
      this.defineClick(ref).then(
        async res => {
          const result = await updatedShopName(this.currentRowValue.cat_id, {
            cat_name: this.editInfo.cat_name
          })
          // 错误处理
          console.log(result)
          if (result.meta.status !== 200) {
            return this.$message.warning(result.meta.msg)
          }
          this.$message.success(result.meta.msg)
          this.isShowEditForm = false
        },
        err => {}
      )
    },
    // 8.删除一行数据
    deleteById(rowValue) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        // 点击确定发送请求， 似乎有问题？
        .then(async _ => {
          const res = await deleteRowById(rowValue.cat_id)
          // 错误处理
          if (res.meta.status !== 200) {
            return this.$message({
              type: 'warning',
              message: res.meta.msg
            })
          }
          this.$message.success(res.meta.msg)
          this.$nextTick(_ => {
            this._getCategoryList()
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        // 点击取消，抓取异常
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>