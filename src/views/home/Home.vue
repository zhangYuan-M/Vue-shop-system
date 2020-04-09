<template>
  <el-container class="outer-box">
    <!-- 头部区域 -->
    <el-header class="right-box">
      <div class="avator-box">
        <div class="left-top-box">
          <img src="../../assets/heima.png">
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logoutClick">退出</el-button>
      </div>
    </el-header>
    <el-container style="height: 90%">
      <!-- 侧边栏区域 base-->
      <el-aside :class="[isShowDetail ? 'more': 'base']" style="height: 100%">
        <div class="show-detail-box" @click="showDetailClick"> |||
        </div>
        <el-menu background-color="#4D4D4D" text-color="#fff" active-text-color="#409EFF"
          :unique-opened="true" :collapse="isShowDetail" :collapse-transition="false" :router="true"
          :default-openeds="activeOpends" :default-active="defaultActive">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="(item, index) in AsideList" :key="index">
            <template slot="title">
              <div @click="submenuClick(item)">
                <i :class="iconObj[item.id]"></i>
                <span style="margin-left:10px">{{item.authName}}</span>
              </div>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item v-for="(item2, indey) in item.children" :key="indey" :index="item2.id+''"
              :route="routeObject" @click="itemClick(item2)">
              <i class="el-icon-menu"></i>
              {{item2.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 内容主体区域 -->
      <el-container class="content-box">
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { getMenuList } from 'network/home/home.js'
export default {
  data() {
    return {
      iconObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      AsideList: [], // 菜单数据
      currentPath: {}, // 当前点击的路由
      defaultActive: '', // 默认激活的index二级菜单
      activeOpends: [], // 默认激活的一级菜单
      isShowDetail: false
    }
  },
  created() {
    this._getAsideData()
  },
  methods: {
    // 1.请求侧变栏的数据
    async _getAsideData() {
      const res = await getMenuList()
      // 登录错误处理
      if (res.meta.status !== 200) {
        return this.$message.warning(res.meta.msg)
      }
      // 登录成功处理
      this.AsideList = res.data

      // 设置默认的激活一级菜单
      const val = window.sessionStorage.getItem('activePath')
      this.activeOpends = val ? val.split(',') : []
      // 设置激活的二级菜单
      this.defaultActive = window.sessionStorage.getItem('activeIndex')
    },
    // 2. 一级菜单点击事件
    submenuClick(item) {
      window.sessionStorage.setItem('activePath', item.id + '')
    },
    // 3.二级菜单点击事件
    itemClick(itemValue) {
      this.defaultActive = itemValue.id + ''
      window.sessionStorage.setItem('activeIndex', itemValue.id + '')
      // 点击了相同的路由会报错
      if ('/' + itemValue.path == this.$route.path) {
        return false
      }
      this.$router.push(itemValue.path)
    },
    // 4.点击退出按钮
    logoutClick() {
      window.sessionStorage.clear() // 清空记录
      this.$router.replace('/login') // 重定向
    },
    // 5.点击收缩或者展开
    showDetailClick() {
      this.isShowDetail = !this.isShowDetail
    }
  },
  computed: {
    routeObject() {
      return this
    }
  }
}
</script>

<style scoped>
.outer-box {
  background: rgb(49, 47, 49);
  height: 100%;
}
.right-box {
  background: rgb(49, 47, 49);
}
.content-box {
  background: rgb(250, 250, 250);
}
.avator-box {
  color: white;
  font-size: 21px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.left-top-box {
  display: flex;
  align-items: center;
}
.avator-box span {
  margin-left: 15px;
}
.el-header {
  padding: 0 !important;
}
.avator-box img {
  margin-left: 10px;
  margin-top: 5px;
}
.el-button {
  margin-right: 9px;
}
.el-menu-item:hover {
  background-color: #0c2711 !important;
}
.show-detail-box {
  height: 40px;
  width: 100%;
  background-color: rgb(99, 97, 97);
  color: whitesmoke;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.base {
  width: 200px !important;
}
.more {
  width: 65px !important ;
}
.el-menu {
  border-right: 0;
}
</style>