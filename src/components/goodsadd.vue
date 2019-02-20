<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <cus-bread level1='商品管理' level2='商品列表'></cus-bread>
    <el-alert class="alert" title="添加商品信息" type="info" center show-icon>
    </el-alert>
    <el-steps :active="active*1" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>

    <!-- 标签页 -->
    <el-form class="form" label-position="top" label-width="80px" :model="form">
      <el-tabs v-model="active" tab-position="left" @tab-click="changeTab()">
        <el-tab-pane label="基本信息" name="1">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            {{selectedOptions}}
            <el-cascader clearable expand-trigger="hover" :options="options" v-model="selectedOptions" @change="handleChange" :props="defaultProp">
            </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="2">
          <el-form-item :label="item1.attr_name" v-for="(item1) in arrDy" :key="item1">
            <!-- {{checkList}} -->
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox border :label="item2" v-for="(item2,i) in item1.attr_vals" :key="i"></el-checkbox>

            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="3">
          <el-form-item :label="item.attr_name" v-for="(item) in arrStatic" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="4">
          <el-form-item :label="添加图片">
            <!-- headers 设置请求头 -->

            <el-upload action="http://localhost:8888/api/private/v1/uploda" :on-remove="handleRemove" :on-success="handleSuccess" list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="5">
          <el-form-item>
            <el-button @click="addGoods()">添加商品</el-button>
            <!-- 富文本 -->
            <quill-editor class="quill" v-model="form.goods_introduce"></quill-editor>

          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>

  </el-card>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      active: "1",
      form: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_cat: "",
        goods_introduce: "",
        pics: [],
        attrs: []
      },
      //   级联数据
      options: [],
      selectedOptions: [1, 3, 6],
      defaultProp: {
        label: "cat_name",
        value: "cat_id"
        // children: "children"
      },
      //   checkList: [],
      //   动态参数的数组
      arrDy: [],
      //   静态参数的数组
      arrStatic: [],
      headers: {
        Authorization: localStorage.getItem("token")
      }
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    // 添加商品
    async addGoods() {
      this.form.goods_cat = this.selectedOptions.join(",");
      this.pics;

      // 处理动态
      const arr1 = this.arrDy.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      const arr2 = this.arrStatic.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      // const obj1 = { attr_id: "", attr_vals: "" };
      // const arr1 = [];
      // this.arrDy.forEach(item => {
      //   obj1.attr_id = item.attr_id;
      //   obj1.attr_vals = item.attr_vals;
      //   arr1.push(obj1);
      // });
      // //处理静态
      // const obj2 = { attr_id: "", attr_vals: "" };
      // const arr2 = [];
      // this.arrStatic.forEach(item => {
      //   obj2.attr_id = item.attr_id;
      //   obj2.attr_vals = item.attr_vals;
      //   arr2.push(obj2);
      // });
      this.form.attrs = [...arr1, ...arr2];
      const res = await this.$http.post(`goods`, this.form);
      const { meta: { msg, status } } = res.data;
      if (status === 201) {
        // 回到列表
        this.$router.push({
          name: "goods"
        });
      } else {
        this.$message.error(msg);
      }
    },
    handleRemove(file, fileList) {
      console.log("remove----");

      const Index = this.form.pics.findIndex(item => {
        return item.pic === file.response.data.tmp_path;
      });
      this.form.pics.splice(Index, 1);
    },
    handleSuccess(res, file, fileList) {
      console.log("success----");
      this.form.pics.push({
        pic: res.data.tmp_path
      });
    },
    //   点击任何tab触发
    async changeTab() {
      // 如果点击第二个
      // 如果分类是三级
      if (this.active === "2" || this.active === "3") {
        if (this.selectedOptions.length !== 3) {
          // 提示
          this.$message.error("请先选择三级分类！");
          //请空
          if (this.active === "2") {
            this.arrDy = [];
          } else {
            this.arrStatic = [];
          }
          return;
        }
        if (this.active === "2") {
          // 获取动态数据
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=many`
          );
          const { meta: { msg, status }, data } = res.data;
          if (status === 200) {
            this.arrDy = data;
            this.arrDy.forEach(item => {
              item.attr_vals =
                item.attr_vals.trim().length === 0
                  ? []
                  : item.attr_vals.trim().split(",");
            });
          }
        }
        if (this.active === "3") {
          // 获取静态数据
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=only`
          );
          const { meta: { msg, status }, data } = res.data;
          if (status === 200) {
            this.arrStatic = data;
          }
        }
      }
    },

    //   获取三级分类的数据
    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3`);
      const { meta: { msg, status }, data } = res.data;
      if (status === 200) {
        this.options = data;
        console.log(this.options);
      }
    },

    handleChange() {}
  }
};
</script>

<style>
.box {
  height: 100%;
}
.alert {
  margin-bottom: 20px;
  margin-top: 20px;
}
.form {
  height: 400px;
  overflow: auto;
}
.ql-editor,
.ql-blank {
  min-height: 200px;
}
</style>
