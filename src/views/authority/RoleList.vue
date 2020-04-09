<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 1.添加角色按钮 -->
      <el-button type="primary" @click="isShowAddDialog = true">添加角色</el-button>

      <!-- 2.表格内容主体 -->
      <el-table :data="getRolesListData" border>
        <el-table-column type="expand">
          <template slot-scope="slot">
            <!-- 权限列表展开 -->
            <el-row v-for="(item1, index) in slot.row.children" :key="index" :class="[index
             === 0 ? 'b-top' : 'b-base']" class="center">
              <!-- 一级权限列表 -->
              <el-col :span="5">
                <el-tag closable style="margin:4px" @close="closeTagClick(item1, slot.row)">
                  {{item1.authName}}
                </el-tag>
              </el-col>
              <!-- 二级和三级权限列表 -->
              <el-col :span="19">
                <el-row v-for="(item2, indey) in item1.children" :key="indey" :class="[indey
             === 0 ? '' : 'b-bottom']" class="center">
                  <!-- 二级权限列表 -->
                  <el-col :span="6">
                    <el-tag closable style="margin:5px" type="success"
                      @close="closeTagClick(item2, slot.row)">
                      {{item2.authName}}
                    </el-tag>
                  </el-col>
                  <!-- 三级权限列表 -->
                  <el-col :span="18">
                    <el-tag closable v-for="(item3, indez) in item2.children" :key="indez"
                      style="margin:5px" type="warning" @close="closeTagClick(item3, slot.row)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="slot">
            <el-button type="primary" class="el-icon-edit" size="small"
              @click="editClick(slot.row)">编辑</el-button>
            <el-button type="danger" class="el-icon-edit" size="small"
              @click="deleteClick(slot.row)">删除</el-button>
            <el-button type="warning" class="el-icon-edit" size="small"
              @click="treeClick(slot.row)">分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog title="修改角色信息" :visible.sync="isShowEditDialog" width="50%"
      @close="resetForm('editFormRef')">
      <!-- 1.内容主体表单区域 -->
      <el-form label-width="80px" :model="editInfo" ref="editFormRef" :rules="editFormRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 2.底部按钮区域 -->
      <span slot="footer">
        <el-button @click="isShowEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="defineEditClick('editFormRef')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog :visible.sync="isShowDistDialog" width="50%" title="分配角色权限" @close='distDialogClose'>
      <el-tree :data="treeDataList" node-key="id" :props="defaultProps" show-checkbox ref="treeRef"
        @check="handleCheckChange" :highlight-current="true" :render-after-expand="false"
        default-expand-all :default-checked-keys="defaultKeyArray">
      </el-tree>
      <!-- 2.底部按钮区域 -->
      <span slot="footer">
        <el-button @click="isShowDistDialog = false">取 消</el-button>
        <el-button type="primary" @click="defindDistClick()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="isShowAddDialog" width="50%"
      @close="resetForm('addFormRef')">
      <!-- 1.内容主体区域 -->
      <el-form ref="addFormRef" :model="addFormInfo" :rules="addFormRules">
        <el-form-item label="角色名称" label-width="90px" prop="roleName">
          <el-input v-model="addFormInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="90px" prop="roleDesc">
          <el-input v-model="addFormInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <!-- 2.底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="defineAddRoleClick('addFormRef')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRolesListData,
  updatedEditDate,
  deleteRoleById,
  deleteRoleByDoubleId,
  getRightsData,
  updatedRoleLevels,
  addRole
} from 'network/authority/roleList.js'
import { resetFormData, defineClick } from 'common/mixins.js'
export default {
  data() {
    return {
      // 修改角色数据, 参数
      editInfo: {
        roleName: '',
        roleDesc: ''
      },
      // 表单验证规则
      editFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '角色名称的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '角色描述的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 添加角色对话框，参数
      addFormInfo: {
        roleName: '',
        roleDesc: ''
      },
      // 添加用户验证规则
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '角色名称的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '角色描述的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ]
      },
      getRolesListData: [], // 角色列表数据
      currentRowValue: {}, // 当前点击行的数据
      isShowEditDialog: false, // 默认不展示修改角色对话框
      isShowDistDialog: false, // 是否展示分配权限对话框
      defaultKeyArray: [], // 默认选中的三级节点key
      currentRowValue_: {}, // 点击分配权限的行的数据
      treeDataList: [], // 树形控件数据
      isShowAddDialog: false
    }
  },
  created() {
    this._getRoleListData()
  },
  mixins: [resetFormData, defineClick],
  methods: {
    // 获取角色列表数据
    async _getRoleListData() {
      const res = await getRolesListData()
      // 登录错误处理
      if (res.meta.status !== 200) {
        return this.$message.warning(res.meta.msg)
      }
      console.log(res)
      this.getRolesListData = res.data
    },
    // 点击了编辑按钮
    editClick(value) {
      // 初始化提交表单的数据
      this.editInfo.roleName = value.roleName
      this.editInfo.roleDesc = value.roleDesc
      // 显示对话框
      this.isShowEditDialog = true
      // 保存当前行的数据
      this.currentRowValue = value
    },
    // 提交编辑角色信息数据
    defineEditClick(ref) {
      const result = this.defineClick(ref)
      result.then(
        async res => {
          const res1 = await updatedEditDate(
            this.currentRowValue.id,
            this.editInfo
          )
          // 登录错误处理
          if (res1.meta.status !== 200) {
            return this.$message.warning(res1.meta.msg)
          }
          // 提示用户更新角色信息成功
          this.$message.success('更新角色信息成功!')
          this.isShowEditDialog = false
        },
        err => {}
      )
    },
    // 点击删除
    async deleteClick(currentRowValue) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async _ => {
          const res = await deleteRoleById(currentRowValue.id + 0)
          // 错误处理
          if (res.meta.status !== 200) {
            return this.$message.warning(res.meta.msg)
          }
          // 成功处理, 提示用户
          this.$message.success(res.meta.msg)
          this._getRoleListData()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 点击关闭标签, 删除三级权限列表
    async closeTagClick(item3, item) {
      const result = await this.$confirm(
        '此操作将永久删除该三级权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(error => {
        return this.$message.info('取消删除')
      })
      if (result === 'confirm') {
        const res = await deleteRoleByDoubleId(item.id, item3.id)
        // 错误处理
        if (res.meta.status !== 200) {
          return this.$message.warning(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        item.children = res.data
      }
    },
    // 点击分配权限展开树形控件对话框
    async treeClick(rowValue) {
      // 保存当前行的角色数据
      this.currentRowValue_ = rowValue
      const res = await getRightsData('tree')
      // 错误处理
      if (res.meta.status !== 200) {
        return this.$message.warning(res.meta.msg)
      }
      this.treeDataList = res.data
      // 设置默认点击的三级权限
      this.getThreeLevel(rowValue, this.defaultKeyArray)
      console.log(this.defaultKeyArray)
      this.isShowDistDialog = true
    },
    // 树形控件选择改变
    handleCheckChange(data, checkData) {
      console.log(data)
      console.log(checkData)
    },
    // 递归获取三级权限keys
    getThreeLevel(nodes, arr) {
      if (!nodes.children) {
        // 设置递归出口
        arr.push(nodes.id)
      }
      nodes.children
        ? nodes.children.forEach(item => {
            this.getThreeLevel(item, arr)
          })
        : ''
    },
    // 点击确定提交分配权限
    async defindDistClick() {
      const roleId = this.currentRowValue_.id
      const keysArray = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // 获取请求参数
      const strKeys = keysArray.join(',')
      // 获取请求结果
      const res = await updatedRoleLevels(roleId, strKeys)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.isShowDistDialog = false
    },
    // 分配权限对话框关闭
    distDialogClose() {
      this.defaultKeyArray = []
    },
    // 点击添加角色提交表单数据
    defineAddRoleClick(ref) {
      const result = this.defineClick(ref)
      result.then(
        async res => {
          // 表单验证通过
          const data = await addRole(this.addFormInfo)
          console.log(data)
          // 错误处理
          if (data.meta.status !== 201) {
            return this.$message.warning(data.meta.msg)
          }
          this.$message.success(data.meta.msg)
          this.isShowAddDialog = false
          this._getRoleListData()
        },
        err => {}
      )
    }
  }
}
</script>

<style scoped>
.el-button {
  margin-bottom: 10px;
}
.b-top {
  border-top: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
}
.b-base {
  border-bottom: 1px solid #eeeeee;
}
.b-bottom {
  border-top: 1px solid #eeeeee;
}
.center {
  display: flex;
  align-items: center;
}
</style>