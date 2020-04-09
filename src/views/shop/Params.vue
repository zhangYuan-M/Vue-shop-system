<template>
  <div class="params">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 1.警告框 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon>
      </el-alert>

      <!-- 2.选择商品，级联选择器 -->
      <el-row class="center-layout">
        <el-col :span="4" style="margin-top: 15px; ">
          <div>选择三级分类：</div>
        </el-col>
        <el-col :span="6" style="margin-top: 15px; ">
          <el-cascader v-model="selectArray" :options="cascaderDataList" :props="cascaderProps"
            @change="handleSelectChange">
          </el-cascader>
        </el-col>
      </el-row>

      <!-- 3.分页标签 -->
      <el-tabs v-model="tabValue" @tab-click="tabClick">
        <el-tab-pane label="动态参数" name="first">
          <!-- 动态参数编辑域 -->
          <el-button type="primary" size="small" style="margin-bottom: 13px" :disabled="isShowBtn"
            @click="isShowAddDialog = true">
            添加参数</el-button>
          <!-- 动态表格域 -->
          <el-table :data="manyParamsList" border style="width: 100%" empty-text="请选择分类" stripe>
            <!-- 1.展开行 -->
            <el-table-column type="expand" label="查看详情" width="80">
              <template slot-scope="slot">
                <div class="expand-row">
                  <!-- 标签组 -->
                  <el-tag v-for="(item, index) in slot.row.attr_vals" :key="index" class="el-tag_"
                    @close="tagCloseClick(slot.row, index)" closable
                    style="margin: 5px 10px 1px 1px">
                    {{item}}
                  </el-tag>
                  <!-- 文本输入框区域 -->
                  <el-input class="input-new-tag" v-if="slot.row.isShowInput"
                    v-model="slot.row.inputValue" ref="saveTagInput" size="small"
                    @keyup.enter.native="handleInputConfirm(slot.row)"
                    @blur="handleInputConfirm(slot.row)">
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small"
                    @click="showInput(slot.row)">+ New Tag
                  </el-button>
                </div>
              </template>
            </el-table-column>

            <!-- 2.索引行 -->
            <el-table-column type="index" label="#" width="100">
            </el-table-column>

            <!-- 3，数据行 -->
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>

            <!-- 4. 操作行 -->
            <el-table-column label="操作">
              <template slot-scope="slot">
                <el-button size="mini" type="primary" icon="el-icon-edit"
                  @click="paramsEditClick(slot.row)">
                  编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete"
                  @click="deleteByRowValue(slot.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="second">
          <!-- 静态参数编辑域 -->
          <el-button type="primary" size="small" style="margin-bottom: 13px" :disabled="isShowBtn"
            @click="isShowAddDialog = true">
            添加属性
          </el-button>
          <!-- 静态表格域 -->
          <el-table :data="onlyParamsList" border style="width: 100%" empty-text="请选择分类" stripe>
            <!-- 1.展开行 -->
            <el-table-column type="expand" label="查看详情" width="80">
              <template slot-scope="slot">
                <div class="expand-row">
                  <!-- 标签组 -->
                  <el-tag v-for="(item, index) in slot.row.attr_vals" :key="index" class="el-tag_"
                    @close="tagCloseClick(slot.row, index)" closable
                    style="margin: 5px 10px 1px 1px">
                    {{item}}
                  </el-tag>
                  <!-- 文本输入框区域 -->
                  <el-input class="input-new-tag" v-if="slot.row.isShowInput"
                    v-model="slot.row.inputValue" ref="saveTagInput" size="small"
                    @keyup.enter.native="handleInputConfirm(slot.row)"
                    @blur="handleInputConfirm(slot.row)">
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small"
                    @click="showInput(slot.row)">+ New Tag
                  </el-button>
                </div>
              </template>
            </el-table-column>

            <!-- 2.索引行 -->
            <el-table-column type="index" label="#" width="100">
            </el-table-column>

            <!-- 3，数据行 -->
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>

            <!-- 4. 操作行 -->
            <el-table-column label="操作">
              <template slot-scope="slot">
                <el-button size="mini" type="primary" icon="el-icon-edit"
                  @click="paramsEditClick(slot.row)">
                  编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete"
                  @click="deleteByRowValue(slot.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

      </el-tabs>
    </el-card>

    <!-- 参数编辑对话框 共用 -->
    <el-dialog title="参数编辑" :visible.sync="isShowEditParams" width="50%"
      @close="resetForm('editFormRef')">
      <!-- 1.内容主体 -->
      <el-form :model="editInfo" :rules="addRuleFormRules" ref="editFormRef">
        <el-form-item label="参数名称" prop="attr_name" label-width="80px">
          <el-input v-model="editInfo.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <!-- 2,按钮区域 -->
      <span slot="footer">
        <el-button @click="isShowEditParams = false">取 消</el-button>
        <el-button type="primary" @click="definedClick('editFormRef')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加属性名称  共用-->
    <el-dialog title="添加属性" :visible.sync="isShowAddDialog" width="50%"
      @close="resetForm('addFormRef')">
      <!-- 1.内容主体 -->
      <el-form :model="addFormInfo" :rules="addRuleFormRules" ref="addFormRef">
        <el-form-item label="参数名称" prop="attr_name" label-width="80px">
          <el-input v-model="addFormInfo.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <!-- 2,按钮区域 -->
      <span slot="footer">
        <el-button @click="isShowAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="definedAddClick('addFormRef')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCategoryData,
  getParamsList,
  addParams,
  updateParams,
  deleteFormParams
} from 'network/shop/params.js'
import { resetFormData, defineClick } from 'common/mixins.js'
export default {
  name: 'Params',
  data() {
    return {
      currentType: 'many', // 默认是动态参数
      isShowAddDialog: false, // 是否展示添加属性对话框
      isShowBtn: true, // 是否禁用添加参数按钮
      addFormInfo: {
        attr_name: ''
      },
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      selectArray: [], // 级联选择选中数组
      cascaderDataList: [], // 级联选择器数据
      tabValue: 'first', // 分页的值
      manyParamsList: [], // 动态参数列表
      isShowEditParams: false, // 不展示编辑动态参数名称
      onlyParamsList: [], // 静态参数列表
      currentRowValue: {}, // 当前点击编辑的行数据
      // 参数名称编辑表单，参数
      editInfo: {
        attr_name: ''
      },
      // 参数名称编辑表单，验证规则
      addRuleFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  mixins: [resetFormData, defineClick],
  created() {
    this._getCategoryData()
  },
  methods: {
    // 初始化级联选择器数据
    async _getCategoryData() {
      const res = await getCategoryData()
      // 错误处理
      if (res.meta.status !== 200) {
        return this.$message.warning(res.meta.msg)
      }
      // 保存数据
      this.cascaderDataList = res.data
    },
    // 加载动态或者静态参数manylist onlyList
    async _getParamsList(type = 'many') {
      const res = await getParamsList(this.selectArray[2] + 0, {
        sel: type
      })
      // 错误处理
      if (res.meta.status !== 200) {
        return this.$message.warning(res.meta.msg)
      }
      // 手动把 字符串变成数组 split
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的输入与显示
        // 每一行的数据都有自己的控制变量
        item.isShowInput = false
        item.inputValue = ''
      })
      // 保存数据
      if (type === 'many') {
        this.manyParamsList = res.data
      } else {
        this.onlyParamsList = res.data
      }
    },
    // 级联选择器选择改变
    async handleSelectChange() {
      // 只允许选中三级分类
      if (this.selectArray.length !== 3) {
        return (this.selectArray = [])
      }
      // 选择了三级分类加载数据
      if (this.selectArray.length === 3) {
        // 按钮是否可以使用
        this.isShowBtn = false
        this._getParamsList()
      }
    },
    // 点击newTab按钮
    showInput(rowValue) {
      rowValue.isShowInput = true
      // this.$nextTick 当页面上的元素重新渲染才会执行回调函数
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // attr_vals 更新保存
    async updatedAttrValues(rowValue) {
      const paload = {
        attr_name: rowValue.attr_name,
        attr_sel: rowValue.attr_sel,
        attr_vals: rowValue.attr_vals.join(' ')
      }
      const res = await updateParams(rowValue.cat_id, rowValue.attr_id, paload)
      // 错误处理
      if (res.meta.status !== 200) {
        return this.$message.warning(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    // 输入框，编辑动态参数, 按下确定键
    async handleInputConfirm(rowValue) {
      if (rowValue.inputValue.trim().length === 0) {
        return (rowValue.isShowInput = false)
      }
      // 这里是数组
      rowValue.attr_vals.push(rowValue.inputValue)
      // 发送网络请求
      this.updatedAttrValues(rowValue)
      // 重置空
      rowValue.inputValue = ''
      rowValue.isShowInput = false
    },
    // 点击删除，更新数据
    tagCloseClick(rowValue, index) {
      // 1.从数组中删除, splice 方法会修改原来的数组
      rowValue.attr_vals.splice(index, 1)
      // 2. 更新数据
      this.updatedAttrValues(rowValue)
    },
    // tab选项卡改变
    async tabClick(tabInstance) {
      if (tabInstance.index === '1' && this.selectArray.length === 3) {
        // 设置当前的type
        this.currentType = 'only'
        // 1.获取静态参数数据
        const res = await getParamsList(this.selectArray[2] + 0, {
          sel: 'only'
        })
        // 错误处理
        if (res.meta.status !== 200) {
          return this.$message.warning(res.meta.msg)
        }
        // 手动把 字符串变成数组 split
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          // 控制文本框的输入与显示
          // 每一行的数据都有自己的控制变量
          item.isShowInput = false
          item.inputValue = ''
        })
        // 保存数据
        this.onlyParamsList = res.data
      }
    },
    // 点击编辑动态参数名称，编辑静态参数名称
    paramsEditClick(rowValue) {
      this.isShowEditParams = true
      // 初始化表单的值
      this.editInfo.attr_name = rowValue.attr_name
      this.currentRowValue = rowValue
    },
    // 点击提交了动态参数名称
    definedClick(ref) {
      // 如果名称不变，不请求
      if (this.editInfo.attr_name === this.currentRowValue.attr_name) {
        this.$message.warning('请修改参数名称！')
      } else {
        // 表单预校验
        this.defineClick(ref).then(
          res => {
            this.currentRowValue.attr_name = this.editInfo.attr_name
            this.updatedAttrValues(this.currentRowValue)
            // 隐藏对话框
            this.isShowEditParams = false
          },
          err => {}
        )
      }
    },
    // 动态或者静态表单删除
    async deleteByRowValue(value) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        // 点击确定发送请求， 似乎有问题？
        .then(async _ => {
          const res = await deleteFormParams(value.cat_id, value.attr_id)
          // 错误处理
          if (res.meta.status !== 200) {
            return this.$message({
              type: 'warning',
              message: res.meta.msg
            })
          }
          this.$message.success(res.meta.msg)
          //
          this.$nextTick(_ => {
            this._getParamsList(value.attr_sel)
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
    },
    // 确定提交添加一个商品参数名称
    definedAddClick(ref) {
      this.defineClick(ref).then(
        async _ => {
          // 配置参数
          const cat_id = this.selectArray[2]
          const attr_name = this.addFormInfo.attr_name
          const attr_sel = this.currentType
          const res = await addParams(cat_id, {
            attr_name,
            attr_sel
          })
          // 错误处理
          if (res.meta.status !== 201) {
            return this.$message.warning(res.meta.msg)
          }
          // 更新列表, 默认是 many
          this._getParamsList(this.currentType)
          this.isShowAddDialog = false
          this.$message.success(res.meta.msg)
        },
        err => {}
      )
    }
  }
}
</script>

<style >
.center-layout {
  display: flex;
  align-items: center;
}
.expand-row {
  position: relative;
  left: -40px;
}
.input-new-tag {
  width: 90px;
}
</style>