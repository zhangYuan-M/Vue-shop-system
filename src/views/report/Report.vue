<template>
  <div class="report">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/welcome' }">数据统计
      </el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div ref="main" style="width: 870px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import { getReportData } from 'network/report/report.js'
export default {
  name: 'Report',
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  mounted() {
    this.inin()
  },
  methods: {
    async inin() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(this.$refs.main)

      // 获取数据
      const res = await getReportData()
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }

      const result = Object.assign(this.options, res.data)
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(result)
    }
  }
}
</script>

<style>
</style>