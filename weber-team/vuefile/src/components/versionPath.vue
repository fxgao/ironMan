<template>
    <!-- <div id="wrapper">
        <div>
            <el-input placeholder="请输入路径" v-model="path1" :disabled="true">
                <template slot="prepend">WLAN_Cur</template>
            </el-input>
        </div>
    </div> -->

    <el-container>
        <el-row style="width: 100%">
            <!-- <el-row style="overflow: hidden">
                <div style="float: left">更新時間： {{UpdateTime}}</div>
                <el-button type="primary" size="mini" @click="showDevVerInfoDialog" style="float: right">显示版本对应关系</el-button>
            </el-row> -->
            <el-row :gutter="20" >
                <el-col :span="24">
                    <div style="font-weight: 700;margin:10px auto">版本分支路径</div>
                    <el-table :data="svnPath"  style="height:100%" 
                    :row-class-name = "tableRowClassName" >
                        <el-table-column prop="pathName" label="版本名称" width="180px">
                            <template slot-scope="scope">
                                <el-tag :type="getPathType(scope)">{{scope.row.pathName}}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="pathUrl" label="路径" >
                            <template slot-scope="scope">
                                <el-button 
                                :name="scope.row.pathName"
                                v-clipboard:copy="scope.row.pathUrl"
                                v-clipboard:success="onCopyOK"
                                v-clipboard:error="onCopyError"
                                :type="getPathType(scope)"
                                style="font-size:12px"
                                >
                                {{scope.row.pathUrl}}
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="editPathUrl" label="操作" align="center" width="180px" show-overflow-tooltip>
                             <template slot-scope="scope">
                                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </el-row>


        <el-dialog :title="editForm.pathName" :visible.sync="editDialog" :close="editCancel">
        <el-form :model="editForm" ref="editForm" :label-position="addFormLabelPosition"
        :rules="editRules">
            <el-form-item label="路径"  prop="pathUrl">
            <el-input style="width:85%" v-model="editForm.pathUrl" autoComplete="off" clearable autosize type="textarea"></el-input>
            <el-button type="info" icon="el-icon-delete" circle @click="editClear('editForm')"></el-button>
            </el-form-item>
            
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="editSubmit('editForm')">确定</el-button>
            <el-button @click="editCancel('editForm')">取消</el-button>
        </div>
        </el-dialog>
    </el-container>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      svnPath: [
        {
          pathName: "啥也木有",
          pathUrl:
            "暂未获取数据"
        }
      ],
      editForm: {
        pathUrl: "",
        pathName: ""
      },
      editDialog: false
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      let _this = this;
      _this.refreshStatus = true;
      this.$axios
        .get("http://wkf6879b:80/webIO/getSvnPath", {
          params: { time: new Date().getTime() }
        })
        .then(function(res) {
          _this.svnPath =
            res.data.svnPath == undefined ? _this.svnPath : res.data.svnPath;
        })
        .catch(function(res) {
          console.log(res);
        });
    },
    onCopyOK: function(e) {
      //   alert('复制内容：' + e.text)
      this.$notify({
        title: "剪贴板OK",
        message: `复制${e.trigger.name}路径成功！`,
        type: "success"
      });
    },
    handleEdit(index, row) {
      this.editDialog = true;
      this.editForm = {
        pathUrl: row.pathUrl,
        pathName: row.pathName
      };
    },
    editCancel(formname) {
      this.editForm = {
        pathUrl: ""
      };
      this.editDialog = false;
      this.resetForm(formname);
    },
    resetForm(formname) {
      this.$refs[formname].resetFields();
    },
    editClear(formname) {
      this.editForm = {
        pathUrl: "",
        pathName: this.editForm.pathName
      };
    },
    getPathType: function(scope) {
      var row = scope.row;
      if (row.pathName.includes("D029")) {
        return "success";
      }
      if (row.pathName.includes("D016")) {
        return "info";
      }
      if (row.pathName.includes("cur")) {
        return "primary";
      }
    },
    tableRowClassName: function(row) {
      var row = row.row;
      if (row.pathName.includes("D029")) {
        return "success";
      }
      if (row.pathName.includes("D016")) {
        return "info";
      }
      if (row.pathName.includes("cur")) {
        return "normal";
      }
    },
    editSubmit(formname) {
      let _this = this;
      this.$refs[formname].validate(valid => {
        if (valid) {
          // 构造postsvnPath进行post操作。
          var [...PostSvnPath] = _this.svnPath;
          for (let i = 0; i < PostSvnPath.length; i++) {
            const oPath = PostSvnPath[i];
            if (oPath.pathName == _this.editForm.pathName) {
              Object.assign(oPath, _this.editForm);
              break;
            }
          }
          PostSvnPath = { svnPath: PostSvnPath };
          _this.$axios
            .post("http://wkf6879b:80/webIO/editSvnPath", PostSvnPath, {
              emulateJSON: true
            })
            .then(function(res) {
              _this.editDialog = false;
              _this.resetForm(formname);
              _this.initData();
            })
            .catch(function(error) {
              console.log(error);
            });
        } else {
          return false;
        }
      });
    }
  },

  computed: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.el-table .normal {
  background-color: #ebf5fe;
}
.el-table .info {
  background-color: #f2f3f4;
}
.el-table .success {
  background-color: #eff8ea;
}
</style>
