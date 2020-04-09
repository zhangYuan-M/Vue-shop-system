<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 1.搜索域和添加用户按钮 -->
      <el-row>
        <el-col :span="10">
          <div style="margin-top: 5px;">
            <el-input placeholder="请输入用户名称" class="input-with-select" v-model="queryInfo.query"
              clearable @clear="getListData">
              <el-button slot="append" icon="el-icon-search" @click="getListData"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" style="margin: 5px auto auto 15px;"
            @click="isShowAddDialog = true">添加用户</el-button>

        </el-col>
      </el-row>

      <!-- 2.表格内容主体 -->
      <el-table :data="userListData" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="用户姓名">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column prop="role_name" label="角色">
        </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="slot">
            <el-switch v-model="slot.row.mg_state" active-color="#13ce66"
              @change="stateChanged(slot.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="slot">
            <el-button type="primary" icon="el-icon-edit" size="small" circle
              @click="editMessageClick(slot.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="small" circle
              @click="deleteClick(slot.row)">
            </el-button>
            <el-tooltip class="item" effect="dark" content="分配权限" placement="top"
              :enterable="false">
              <el-button type="warning" icon="el-icon-s-tools" size="small" circle></el-button>
            </el-tooltip>
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

    <!-- 编辑用户对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="isShowEditDialog" width="50%"
      @close="resetForm('editFormRef')">
      <!-- 1.内容主体表单区域 -->
      <el-form label-width="80px" :model="editInfo" ref="editFormRef" :rules="editFormRules">
        <el-form-item label="用户名称">
          <el-input v-model="currentRowValue.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 2.底部按钮区域 -->
      <span slot="footer">
        <el-button @click="isShowEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="defineEditClick('editFormRef')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户信息" :visible.sync="isShowAddDialog" width="50%"
      @close="resetForm('AddDialogRef')">
      <!-- 1.内容主体表单区域 -->
      <el-form label-width="80px" :model="addInfo" ref="AddDialogRef" :rules="AddDialogRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addInfo.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 2.底部按钮区域 -->
      <span slot="footer">
        <el-button @click="isShowAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="defineAddClick('AddDialogRef')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUsersData,
  updateUserData,
  userStateChanged,
  deleteUserById,
  addUserData
} from 'network/user/user.js'
import { resetFormData, handlePage, defineClick } from 'common/mixins.js'
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, callback) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    return {
      searchInfo: '',
      // 用户列表展示数据，参数
      // queryInfo: {
      //   query: '', // 查询参数,可以为空
      //   pagenum: 1,
      //   pagesize: 3
      // },
      // 编辑用户信息, 参数
      editInfo: {
        email: '',
        mobile: ''
      },
      // 编辑表单验证规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      },
      // 添加用户信息，参数
      addInfo: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 编辑表单验证规则
      AddDialogRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '用户名的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          // 自定义表单验证规则
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // total: 0, // --用户列表的总数据记录
      userListData: [], // --用户列表数据
      isShowEditDialog: false, // 默认不展示修改对话框
      isShowAddDialog: false, // 默认不展示添加对话框
      currentRowValue: {} // 当前操作的用户数据
    }
  },
  created() {
    this.getListData() // 初始化用户列表数据
  },
  mixins: [handlePage, resetFormData, defineClick],
  methods: {
    // 1.初始化用户列表数据
    async getListData() {
      const res = await getUsersData(this.queryInfo)
      // 登录错误处理
      if (res.meta.status !== 200) {
        return this.$message.warning(res.meta.msg)
      }
      // 登录成功处理, 保存数据
      this.userListData = res.data.users
      this.total = res.data.total
    },
    // 2.开关组件状态改变，提交数据库
    async stateChanged(value) {
      const res = await userStateChanged(value.id, value.mg_state)
      console.log(res)
      // 登录错误处理
      if (res.meta.status !== 200) {
        return this.$message.warning(res.meta.msg)
      }
      // 登录成功处理, 提示用户
      this.$message.success(res.meta.msg)
    },
    // // 3.分页size变化
    // handleSizeChange(newSize) {
    //   this.queryInfo.pagesize = newSize
    //   this.getListData() // 初始化用户列表数据
    // },
    // // 4.分页数量变化
    // handleCurrentChange(newNum) {
    //   this.queryInfo.pagenum = newNum
    //   this.getListData() // 初始化用户列表数据
    // },
    // 5.修改用户信息
    editMessageClick(value) {
      // 点击了编辑按钮，更新数据
      this.currentRowValue = value
      this.editInfo.email = value.email
      this.editInfo.mobile = value.mobile

      this.isShowEditDialog = true
    },
    // 7.编辑表单的提交
    async defineEditClick(ref) {
      const result = this.defineClick(ref)
      result
        .then(async res1 => {
          // 表单验证通过发起网络请求修改数据
          const res = await updateUserData(
            this.currentRowValue.id,
            this.editInfo
          )
          // 登录错误处理
          if (res.meta.status !== 200) {
            return this.$message.warning(res.meta.msg)
          }
          // 登录成功处理
          this.$message.success(res.meta.msg)
          this.isShowEditDialog = false
          this.getListData()
        })
        .catch(err => {})
    },
    // 6.表单提交
    // defineClick(ref) {
    //   return new Promise((resolve, reject) => {
    //     this.$refs[ref].validate(valid => {
    //       if (!valid) {
    //         this.$message.warning(res.meta.msg)
    //         reject(false)
    //       }
    //       // 表单验证通过
    //       resolve(true)
    //     })
    //   })
    // },
    // 8.点击删除
    async deleteClick(currentRowValue) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async _ => {
          const res = await deleteUserById(currentRowValue.id + 0)
          // 错误处理
          if (res.meta.status !== 200) {
            return this.$message.warning(res.meta.msg)
          }
          // 成功处理, 提示用户
          this.$message.success(res.meta.msg)
          this.getListData()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 表单关闭重置表单数据
    // resetForm(ref) {
    //   this.$refs[ref].resetFields()
    // },
    // 10.添加用户表单提价
    defineAddClick(ref) {
      const result = this.defineClick(ref)
      result
        .then(async res1 => {
          // 表单验证通过发起网络请求修改数据
          const res = await addUserData(this.addInfo)
          // 登录错误处理
          if (res.meta.status !== 201) {
            return this.$message.warning(res.meta.msg)
          }
          // 登录成功处理
          this.$message.success(res.meta.msg)
          this.isShowAddDialog = false
          this.getListData()
        })
        .catch(err => {})
    },
    // 11.点击搜索
    searchUser() {
      console.log(this.searchInfo)
    }
  }
}
</script>

<style>
.el-table {
  margin-top: 14px;
}
</style>