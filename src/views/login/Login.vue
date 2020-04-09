<template>
  <div class="login">
    <!-- 中间登录框 -->
    <div class="login-box">
      <!-- logo图标区域 -->
      <div class="logo-box">
        <img src="../../assets/logo.png">
      </div>

      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <!-- 输入框区域 -->
        <el-form-item label="账户:" label-width="100px" prop="username">
          <el-input v-model="loginForm.username">
            <i slot="prefix" class="iconfont icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="密码:" label-width="100px" prop="password">
          <el-input v-model="loginForm.password" type="password">
            <i class="iconfont icon-3702mima" slot="prefix"></i>
          </el-input>
        </el-form-item>

        <!-- 按钮区域 -->
        <el-form-item class="btn-box">
          <el-button type="primary" @click="loginBtnClick">登录</el-button>
          <el-button type="info" @click="resetFormStatus">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getLoginData } from 'network/login/login.js'
export default {
  name: 'Login',
  data() {
    return {
      // 表单登录数据的双向绑定
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则
      loginFormRules: {
        username: [
          { required: true, message: '请输入账户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置表单数据
    resetFormStatus() {
      // 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      // 注： 这里要有验证规则 loginFormRules
      this.$refs.loginFormRef.resetFields()
    },
    // 点击登录按钮，请求数据
    loginBtnClick() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.info('请填写信息！')
        }
        const res = await getLoginData(this.loginForm)
        // 登录错误处理
        if (res.meta.status !== 200) {
          return this.$message.warning(res.meta.msg)
        }
        // 登录成功处理
        this.$message.success(res.meta.msg)
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style scoped>
.login {
  background-color: rgb(49, 47, 49);
  height: 100%;
  width: 100%;
}
.login-box {
  position: absolute;
  left: 50%;
  top: 50%;

  height: 310px;
  width: 460px;
  border-radius: 5px;
  transform: translate(-50%, -50%);
  background-color: rgb(247, 247, 247);
}
.logo-box {
  background-color: white;
  height: 150px;
  width: 150px;
  position: absolute;
  left: 50%;
  border-radius: 50%;
  padding: 10px;
  border: 2px solid rgb(230, 230, 230);
  box-shadow: 0 0 6px #888888;
  transform: translate(-50%, -50%);
  background-color: rgb(238, 238, 238);
}
.logo-box img {
  height: 100%;
  width: 100%;
  border-radius: 50%;
  background-color: rgb(243, 242, 242);
}
.el-form {
  position: absolute;
  bottom: 15px;
  width: 100%;
  margin-left: -30px;
  padding: 0 0px 0 0px;
  box-sizing: border-box;
}
.btn-box {
  display: flex;
  justify-content: flex-end;
}
</style>