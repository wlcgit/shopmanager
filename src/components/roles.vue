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
    <el-table @expand-change="fn" :data="list" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 行列 -->
          <el-row class="level1" v-for="(item1) in scope.row.children" :key="item1.id">
            <el-col :span="4">
              <el-tag @close="deleRights(scope.row,item1)" closable type="danger">{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row class="level2" v-for="(item2) in item1.children" :key="item2.id">
                <el-col :span="4">
                  <el-tag @close="deleRights(scope.row,item2)" closable type="info">
                    {{item2.authName}}
                  </el-tag>
                  <i class="el-icon-arrow-right"></i>

                </el-col>
                <el-col :span="20">
                  <el-tag @close="deleRights(scope.row,item3)" closable v-for="(item3) in item2.children" :key="item3.id" type="warning">
                    {{item3.authName}}
                  </el-tag>

                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length===0">
            <el-col>
              <span>未分配权限</span>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="160">
      </el-table-column>
      <el-table-column prop="roleName" label="角色姓名" width="200">
      </el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="200">
      </el-table-column>
      <el-table-column prop="name" label="操作" width="300">
        <template slot-scope="scope">
          <el-button @click="showDiaEditRoles(scope.row)" type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
          <el-button @click="showDelete(scope.row)" type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
          <el-button @click="showDiaSetRights(scope.row)" type="success" icon="el-icon-check" circle size="mini" plain></el-button>
        </template>

      </el-table-column>

    </el-table>
    <!-- 对话框 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="dialogFormVisible">
      <el-tree ref="treeDom" :data="treedata" show-checkbox node-key="id" default-expand-all :default-checked-keys="arrCheck" :props="defaultProps">
      </el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRights()">确 定</el-button>
      </div>
    </el-dialog>

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
      list: [],
      dialogFormVisible: false,
      // 树形
      treedata: [],
      arrCheck: [],
      defaultProps: {
        label: "authName",
        children: "children"
      },
      currRoleId: -1
    };
  },
  created() {
    this.getRolesData();
  },
  methods: {
    fn(row, expandedRows) {
      if (expandedRows.length > 1) {
        expandedRows.shift();
      }
    },
    // 分配权限
    async setRights() {
      // 取出每一个节点

      // 获取树形结构中全选id
      const arr1 = this.$refs.treeDom.getCheckedKeys();

      // // 获取树形结构中半选id
      const arr2 = this.$refs.treeDom.getHalfCheckedKeys();

      const arr = [...arr1, ...arr2];
      //  发送请求
      const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
        rids: arr.join(",")
      });
      if (res.data.meta.status === 200) {
        this.dialogFormVisible = false;
        this.getRolesData();
      }
    },
    // 取消权限
    async deleRights(role, rights) {
      const res = await this.$http.delete(
        `roles/${role.id}/rights/${rights.id}`
      );
      const { meta: { msg, status }, data } = res.data;
      if (status === 200) {
        // 提示
        this.$message.success(msg);
        // 更新、
        role.children = data;
      }
    },
    async showDiaSetRights(role) {
      this.currRoleId = role.id;
      const res = await this.$http.get(`rights/tree`);
      console.log(res);
      const { meta: { msg, status }, data } = res.data;
      if (status === 200) {
        this.treedata = data;
        // const temp = [];
        // this.treedata.forEach(item1 => {
        //   temp.push(item1.id);
        //   item1.children.forEach(item2 => {
        //     temp.push(item2.id);
        //     item2.children.forEach(item3 => {
        //       temp.push(item3.id);
        //     });
        //   });
        // });
        // console.log(temp);
        // this.arrExpand = temp;
      }
      const temp = [];
      role.children.forEach(item1 => {
        // temp.push(item1.id);
        item1.children.forEach(item2 => {
          // temp.push(item2.id);
          item2.children.forEach(item3 => {
            temp.push(item3.id);
          });
        });
      });
      // console.log(temp);
      this.arrCheck = temp;

      this.dialogFormVisible = true;
    },
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
    showDelete(user) {
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
  height: 100%;
}
.btn {
  margin-top: 20px;
}
.level1,
.level2 {
  margin-bottom: 5px;
}
</style>
