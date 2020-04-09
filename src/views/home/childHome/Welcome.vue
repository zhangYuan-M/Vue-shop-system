<template>
  <div class="hoem-weclocme">
    <div class="poster-box">
      <h2>欢迎来到电商管理系统</h2>
      <p>Weclome to ShopManage Sysytem</p>
    </div>
    <div class="calender">
      <el-calendar v-model="value">
      </el-calendar>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeWelcom',
  data() {
    return {
      value: new Date()
    }
  }
}
</script>

<style scoped>
.hoem-weclocme {
  display: flex;
  justify-content: space-between;
}
.el-calendar {
  /* height: 400px; */
  width: 500px;
  background-color: whitesmoke;
}
</style>
