<template>
  <div class="login-wrap">
    <el-form :rules="rules" ref="ruleForm" class="login-form" label-position="top" label-width="80px" :model="formdata">
      <h2>用户登录</h2>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button @click.prevent="handlelogin('ruleForm')" class="login-btn" type="primary">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formdata: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在3到5个字符", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "change" }]
      }
    };
  },
  methods: {
    async handlelogin(ruleForm) {
      this.$refs[ruleForm].validate(async valid => {
        if (valid) {
          const res = await this.$http.post(`login`, this.formdata);
          console.log(res);
          const { data: { data, meta: { msg, status } } } = res;

          if (status === 200) {
            localStorage.setItem("token", data.token);
            this.$router.push({
              name: "home"
            });
          } else {
            this.$message.error(msg);
          }
        } else {
          this.$message.warning("验证失败");
          return false;
        }
      });
    }
  }
};
</script>

<style>
.login-wrap {
  height: 100%;
  background-color: #324152;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-form {
  background-color: #ffffff;
  width: 400px;
  border-radius: 5px;
  padding: 30px;
}
.login-btn {
  width: 100%;
}
</style>
