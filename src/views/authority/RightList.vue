<template>
  <div class="right-list">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-table :data="rightList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称">
        </el-table-column>
        <el-table-column prop="path" label="路径">
        </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="slot">
            <el-tag v-if="slot.row.level == 0">一级权限</el-tag>
            <el-tag type="success" v-else-if="slot.row.level == 1">二级权限</el-tag>
            <el-tag type="warning" v-else>三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightsData } from 'network/authority/rightList.js'
export default {
  name: 'RightList',
  data() {
    return {
      rightList: [] // 权限列表数据
    }
  },
  created() {
    this.getListData() // 初始化权限列表数据
  },
  methods: {
    //  初始化权限列表数据
    async getListData() {
      const res = await getRightsData('list')
      // 登录错误处理
      if (res.meta.status !== 200) {
        return this.$message.warning(res.meta.msg)
      }
      this.rightList = res.data
    }
  }
}
</script>

<style scoped>
</style>