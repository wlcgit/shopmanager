<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <cus-bread level1="权限管理" level2="角色列表"></cus-bread>
    <el-button class="btn" type="primary" @click="showDiaAddUser()">添加角色 </el-button>
    <!-- 对话框 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">

      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="角色名称">
          <el-input v-model="formdata.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="formdata.roleDesc"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 表格 -->
    <el-table :data="list" style="width: 100%">
      <el-table-column type="index" label="#" width="160">
      </el-table-column>
      <el-table-column prop="roleName" label="角色姓名" width="200">
      </el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="200">
      </el-table-column>
      <el-table-column prop="name" label="操作" width="300">
        <template slot-scope="scope">
          <el-button @click="showDiaEditUser(scope.row)" type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
          <el-button @click="showMsgBox(scope.row)" type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
          <el-button @click="showDiaSetRole(scope.row)" type="success" icon="el-icon-check" circle size="mini" plain></el-button>
        </template>

      </el-table-column>

    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      dialogFormVisibleAdd: false,
      formdata: {
        roleName: "",
        roleDesc: ""
      },
      list: []
    };
  },
  created() {
    this.getRolesData();
  },
  methods: {
    async getRolesData() {
      const res = await this.$http.get(`roles`);
      console.log(res);
      const { meta: { msg, status }, data } = res.data;
      if (status === 200) {
        this.list = data;
      }
    },
    //   添加用户 发送请求
    async addUser() {
      const res = await this.$http.post(`roles`, this.formdata);

      // 关闭对话框
      this.dialogFormVisibleAdd = false;
      //    更新表格
      this.getRolesData();
    },
    //   添加用户，展示对话框
    showDiaAddUser() {
      //   清空;
      this.formdata = {};
      this.dialogFormVisibleAdd = true;
    },
    // 删除
    showMsgBox(user) {
      this.$confirm("是否删除用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 发送请求
          const res = await this.$http.delete(`roles/${user.id}`);

          const { meta: { msg, status } } = res.data;
          if (status === 200) {
            // 提示框
            this.$message.success(msg);
            this.getRolesData();
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    }
  }
};
</script>

<style>
.box {
  margin-top: 20px;
}
</style>
