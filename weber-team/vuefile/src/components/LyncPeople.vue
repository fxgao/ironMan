<template>
  <el-container>
    <el-row style="height:100%">
      <el-col style="height:auto;margin-bottom:12px;text-align:right">
        <el-input
        v-model="searchInput"
        clearable
        placeholder="搜索..."
        style="width:20%"
        size="small">
        </el-input>
        <el-button-group>
          <el-button type="primary" icon="el-icon-edit" @click="onAddClick" size="small">添加</el-button>
          <el-button type="primary" icon="el-icon-refresh" :loading="refreshStatus" @click="onRefresh" size="small">刷新</el-button>
          <el-button type="primary" icon="el-icon-delete" size="small" @click="onDelete" v-if="false">删除</el-button>
        </el-button-group>
      </el-col>
      <el-col style="height: 90%;overflow-y: scroll">
        <el-table :data="dealSearchInput" stripe  @selection-change="handleSelectionChange" fit>
          <el-table-column type="selection" width="35" align="center">
            <a href=""></a>
          </el-table-column>
          <el-table-column prop="Module" label="模块" align="center" width="100px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="People" label="负责人" align="center"  width="400px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="Leader" label="老大" align="center" width="120px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="Remarks" label="详情" align="center" width="300px">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="bottom">
                <p>详情：{{scope.row.Remarks}}</p>
                <div slot="reference" class="name-wrapper">
                  {{scope.row.Remarks}}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="UpdateTime" label="更新日期" align="center" width="100px">
          </el-table-column>
          <el-table-column label="修改" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog title="添加联系人" :visible.sync="AddDialog"
    :close="addCancel">
      <el-form :model="addForm" ref="addForm" :label-position="addFormLabelPosition"
      :rules="addRules">
        <el-form-item label="模块" :label-width="addFormLabelWidth" prop="Module">
          <el-input style="width:90%" v-model="addForm.Module" autoComplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="负责人" :label-width="addFormLabelWidth" prop="People">
          <el-input style="width:90%" v-model="addForm.People" autoComplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="老大" :label-width="addFormLabelWidth" prop="Leader">
          <el-input style="width:90%" v-model="addForm.Leader" autoComplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="详情" :label-width="addFormLabelWidth" prop="Remarks">
          <el-input style="width:90%" v-model="addForm.Remarks" autoComplete="off" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSubmit('addForm')">确定</el-button>
        <el-button @click="addCancel('addForm')">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改联系人" :visible.sync="editDialog" :close="editCancel">
      <el-form :model="editForm" ref="editForm" :label-position="addFormLabelPosition"
      :rules="editRules">
        <el-form-item label="模块" :label-width="addFormLabelWidth" prop="Module">
          <el-input style="width:90%" v-model="editForm.Module" autoComplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="负责人" :label-width="addFormLabelWidth" prop="People">
          <el-input style="width:90%" v-model="editForm.People" autoComplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="老大" :label-width="addFormLabelWidth" prop="Leader">
          <el-input style="width:90%" v-model="editForm.Leader" autoComplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="详情" :label-width="addFormLabelWidth" prop="Remarks">
          <el-input style="width:90%" v-model="editForm.Remarks" autoComplete="off" clearable></el-input>
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
  data () {
    return {
      LyncPeople:[],
      oLyncPeople:[],
      AddDialog:false,
      editDialog:false,
      addFormLabelWidth:"80px",
      addFormLabelPosition:"right",
      addForm:{
        Module:"",
        People:"",
        Leader:"",
        Remarks:""
      },
      editForm:{
        Module:"",
        People:"",
        Leader:"",
        Remarks:"",
        ModID:""
      },
      addRules:{
          Module:[
            {required:true,message:"请输入模块名称",trigger:'blur'}
          ],
          People:[
            {required:true,message:"请输入负责人名称",trigger:'blur'}
          ]
      },
      editRules:{
          Module:[
            {required:true,message:"请输入模块名称",trigger:'blur'}
          ],
          People:[
            {required:true,message:"请输入负责人名称",trigger:'blur'}
          ]
      },
      refreshStatus:false,
      allSelection:[],
      searchInput:""
    }
  },
  mounted(){
      this.initData()
  },
  methods:{
    initData(){
      let _this = this
      _this.refreshStatus = true;
      this.$axios.get('http://wkf6879b:80/people',{params:{time:new Date().getTime()}}).then(function(res){
        _this.LyncPeople = ((res.data.length)==undefined)?[]:res.data
        _this.oLyncPeople = _this.LyncPeople 
        _this.refreshStatus = false;
      })
      .catch(function(res){
        console.log(res)
      })
    },
    onAddClick(){
      this.AddDialog = true
    },
    addCancel(formname){
      this.addForm ={
        Module:"",
        People:"",
        Leader:"",
        Remarks:""
      },
      this.AddDialog = false
      this.resetForm(formname)
    },
    addSubmit(formname){
      let _this = this
      this.$refs[formname].validate((valid)=>{
        if(valid){
          _this.$axios.post('http://wkf6879b:80/people/addPeople',_this.addForm)
          .then(function(res){
            _this.AddDialog = false
            _this.resetForm(formname)
            _this.onRefresh()
            console.log(res)
          })
          .catch(function(error){
            console.log(error)
          })
        }else{
          return false
        }
      })
    },
    editSubmit(formname){
      let _this = this
      this.$refs[formname].validate((valid)=>{
        if(valid){
          _this.$axios.post('http://wkf6879b:80/people/editPeople',_this.editForm,{
            emulateJSON:true
          })
          .then(function(res){
            _this.editDialog = false
            _this.resetForm(formname)
            _this.onRefresh()
            console.log(res)
          })
          .catch(function(error){
            console.log(error)
          })
        }else{
          return false
        }
      })
    },
    editCancel(formname){
      this.editForm ={
        Module:"",
        People:"",
        Leader:"",
        Remarks:"",
        ModID:""
      },
      this.editDialog = false
      this.resetForm(formname)
    },
    resetForm(formname){
      this.$refs[formname].resetFields()
    },
    onRefresh(){
      this.initData();
    },
    onDelete(){
      let _this = this
      let aData = this.allSelection
      let oData = {}
      for(let i=0;i<aData.length;i++){
        oData[i]= aData[i].ModID;
      }
      _this.$axios.post('http://wkf6879b:80/people/delPeople',oData,{
        emulateJSON:true
      })
      .then(function(res){
        console.log(res)
        _this.onRefresh()
      })
      .catch(function(error){
        console.log(error)
      })
    },
    handleSelectionChange(val){
      this.allSelection = val
    },
    handleEdit(index,row){
      this.editDialog = true
      this.editForm = {
        Module: row.Module,
        People: row.People,
        Leader: row.Leader,
        Remarks: row.Remarks,
        ModID: row.ModID
      }
    }
  },
  computed:{
    dealSearchInput:function(){
      let _this = this
      return _this.oLyncPeople.filter(function(items){
          if(_this.searchInput == ""){
            return items
          }else{
            let bModule = items.Module.toLowerCase().indexOf(_this.searchInput.toLowerCase())>=0;
            let bLeader = items.Leader.toLowerCase().indexOf(_this.searchInput.toLowerCase())>=0;
            let bRemarks = items.Remarks.toLowerCase().indexOf(_this.searchInput.toLowerCase())>=0;
            let bPeople = false;
            for(let i =0 ;i<items.People.length;i++){
              if(items.People[i].toLowerCase().indexOf(_this.searchInput.toLowerCase())>=0){
                bPeople = true
                break
              }
              continue
            }
            if(bModule || bPeople || bLeader || bRemarks){
              return items
            }
          }
      })
    }
  }
  // watch:{
  //   searchInput:function(val,oldVal){
  //     this.LyncPeople = this.oLyncPeople.filter(function(items){
  //         let bModule = items.Module.toLowerCase().indexOf(val.toLowerCase())>=0;
  //         let bLeader = items.Leader.toLowerCase().indexOf(val.toLowerCase())>=0;
  //         let bRemarks = items.Remarks.toLowerCase().indexOf(val.toLowerCase())>=0;
  //         let bPeople = false;
  //         for(let i =0 ;i<items.People.length;i++){
  //           if(items.People[i].toLowerCase().indexOf(val.toLowerCase())>=0){
  //             bPeople = true
  //             break
  //           }
  //           continue
  //         }
  //         if(bModule || bPeople || bLeader || bRemarks){
  //           return items
  //         }
  //     })
  //     // this.LyncPeople = this.oLyncPeople.filter(item => (~item.Module.toLowerCase().indexOf(val.toLowerCase())))
  //   }
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  ::-webkit-scrollbar{
    width:8px;
    background-color: #f5f5f5
  }
  ::-webkit-scrollbar-track{
    -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.5);
    border-radius:8px;
    background-color: #f5f5f5

  }
  ::-webkit-scrollbar-thumb{
    border-radius:8px;
    -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.8);
    background-color: #555
  }
</style>
