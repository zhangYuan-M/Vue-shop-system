// 1.混入分页的方法
export const handlePage = {
  data() {
    return {
      queryInfo: {
        query: '', // 查询参数,可以为空
        pagenum: 1,
        pagesize: 8
      },
      total: 0, // --用户列表的总数据记录
    }
  },
  methods: {
    // 3.分页size变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getListData() // 初始化用户列表数据
    },
    // 4.分页数量变化
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getListData() // 初始化用户列表数据
    },
  }
}

// 2.重置表单
export const resetFormData = {
  methods: {
    // 对话框关闭重置表单数据
    resetForm(ref) {
      this.$refs[ref].resetFields()
    },
  }
}

// 3, 确定前的表单预校验
export const defineClick = {
  methods: {
    // 6.表单提交
    defineClick(ref) {
      return new Promise((resolve, reject) => {
        this.$refs[ref].validate(valid => {
          if (!valid) {
            this.$message.warning('请填写完整信息！')
            reject(false)
          }
          // 表单验证通过
          resolve(true)
        })
      })
    },
  }
}