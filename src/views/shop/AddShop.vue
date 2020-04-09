<template>
  <div class="add-shop">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 1.头部警告alter -->
      <el-alert title="添加商品信息" type="info" :closable="false" center show-icon>
      </el-alert>

      <!-- 2.步骤条-->
      <el-steps :space="200" :active="0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 3.tab选项卡 -->
      <!-- 基本信息表单 -->
      <el-form ref="baseFormRef" :rules="baseFormRules" :model="baseFormInfo">
        <el-tabs tab-position="left" style="height: 600px;" :before-leave="handleChangeTab">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" label-width="80px" prop="goods_name">
              <el-input v-model="baseFormInfo.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" label-width="80px" prop="goods_price">
              <el-input v-model="baseFormInfo.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" label-width="80px" prop="goods_weight">
              <el-input v-model="baseFormInfo.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" label-width="80px" prop="goods_number">
              <el-input v-model="baseFormInfo.goods_number"></el-input>
            </el-form-item>
            <el-alert title="注意：只能选择三级分类！" type="warning" closable show-icon>
            </el-alert>
            <el-form-item label="商品分类" label-width="80px" prop="goods_cat">
              <!-- 级联选择器绑定的是分类的id 三个 -->
              <!-- 级联选择绑定的是一个数组，只允许绑定到数组 -->
              <el-cascader v-model="baseFormInfo.goods_cat" :options="cascaderData"
                :props="selectProps" clearable @change="handleSelectChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item1.attr_name" v-for="(item1, indey) in manyCategoryList"
              :key="indey">
              <br />
              <el-checkbox-group v-model="item1.attr_vals">
                <el-checkbox v-for="(item, index) in item1.attr_vals" :label="item" :key="index"
                  border>
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="(item, index) in onlyCategoryList"
              :key="index">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload action='http://www.timemeetyou.com:8889/api/private/v1/upload'
              :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture"
              :auto-upload="false" :on-success="uploadSuccess" :headers="headers" ref="uploadRef">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor ref="myQuillEditor" v-model="baseFormInfo.goods_introduce" />
            <el-button type="primary" @click="addShopClick('baseFormRef')" class="addbtn">添加商品
            </el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>

    </el-card>
    <!-- 图片对话框预览 -->
    <el-dialog title="图片预览" :visible.sync="isShowPreviewPic" width="50%"
      @close="isShowPreviewPic = false">
      <img :src="previewPath" style="width: 100%">
    </el-dialog>
  </div>
</template>

<script>
import {
  getCategoryData,
  getParamsList,
  addShopItem
} from 'network/shop/addShop.js'
import { defineClick } from 'common/mixins.js'
export default {
  data() {
    return {
      isShowPreviewPic: false,
      previewPath: '',
      // 添加提交，参数
      baseFormInfo: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: [],
        goods_cat: []
      },
      cascaderData: [], // 级联选择器的数据
      // 级联选择器配置
      selectProps: {
        label: 'cat_name',
        value: 'cat_id',
        expandTrigger: 'hover'
      },
      // 表单验证规则
      baseFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [{ required: true, message: '请选择', trigger: 'blur' }]
      },
      manyCategoryList: [], // 动态参数列表
      onlyCategoryList: [] //静态参数列表
    }
  },
  mixins: [defineClick],
  created() {
    this.getCascaderData()
  },
  methods: {
    // 获取商品分类数据
    async getCascaderData() {
      const res = await getCategoryData()
      // 错误处理
      if (res.meta.status !== 200) {
        return this.$message.warning(res.meta.msg)
      }
      // 保存数据
      this.cascaderData = res.data
    },
    // 级联选择器选择改变
    handleSelectChange() {
      // 只允许选中三级分类
      if (this.baseFormInfo.goods_cat.length !== 3) {
        this.baseFormInfo.goods_cat = []
      }
    },
    // tab切换之前的钩子函数
    handleChangeTab(activeName, oldName) {
      if (activeName !== '0' && this.baseFormInfo.goods_cat.length !== 3) {
        this.$message.warning('请选择三级分类')
        return false
      }
      // 商品参数
      if (activeName === '1') {
        // 获取商品动态参数数据
        getParamsList(this.getThreeCategoryId, {
          sel: 'many'
        }).then(res => {
          // 将商品动态参数变成数组
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
          })
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.manyCategoryList = res.data
        })
      }
      // 获取商品静态参数数据
      if (activeName === '2') {
        getParamsList(this.getThreeCategoryId, {
          sel: 'only'
        }).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.onlyCategoryList = res.data
        })
      }
    },
    // 点击添加商品
    addShopClick(ref) {
      this.defineClick(ref).then(
        async res => {
          // 处理goods_cat，深拷贝
          const newForm = JSON.parse(JSON.stringify(this.baseFormInfo))
          newForm.goods_cat = newForm.goods_cat.join(',')
          // 处理attrs  数组push 对象
          this.manyCategoryList.forEach(item => {
            newForm.attrs.push({
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' ')
            })
          })
          this.onlyCategoryList.forEach(item => {
            newForm.attrs.push({
              attr_id: item.attr_id,
              attr_value: item.attr_value
            })
          })
          // 上传图片
          this.$refs.uploadRef.submit()
          const result = await addShopItem(newForm)
          if (result.meta.status !== 201) {
            return this.$message.error(result.meta.msg)
          }
          this.$message.success(result.meta.msg)
          //商品添加成功后，跳转路由
          this.$router.push('/goods')
        },
        err => {}
      )
    },
    // pthoto temporary upload to serve
    uploadSuccess(info) {
      if (info.meta.status !== 200) {
        return
      }
      // 追加到数组中
      const pic = {
        pic: info.data.tmp_path
      }
      this.baseFormInfo.pics.push(pic)
      console.log(this.baseFormInfo)
    },
    // remove pthoto event console
    handleRemove(file) {
      const tem_path = file.response.data.tmp_path
      // 从数组中找到指定的索引tihs
      const index = this.baseFormInfo.pics.findIndex(
        item => item.tem_path === tem_path
      )
      // 根据找到的索引删除指定的对象previewPath
      this.baseFormInfo.pics.splice(index, 1)
    },
    //  click show pthoto
    handlePreview(a) {
      this.isShowPreviewPic = true
      this.previewPath = a.response.data.url
    }
  },
  computed: {
    // 三级权限 id
    getThreeCategoryId() {
      if (this.baseFormInfo.goods_cat.length === 3) {
        return this.baseFormInfo.goods_cat[2]
      }
      // 如果没有选中
      return null
    },
    // 设置图片请求头, upload组件只能写在计算属性中
    headers() {
      return {
        Authorization: window.sessionStorage.getItem('token')
      }
    }
  }
}
</script>

<style>
/* 这里设置的是全局的概念 */
.el-steps {
  margin: 14px 0;
  display: flex;
}
.el-step__title {
  font-size: 14px !important;
  line-height: 28px;
}

.el-alert {
  margin-bottom: 14px;
}
.ql-editor {
  height: 400px;
}
.addbtn {
  position: relative;
  left: 900px;
  bottom: -20px;
}
.el-tabs__content {
  height: 600px !important;
}
</style>