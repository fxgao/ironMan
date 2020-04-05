<template>
  <el-container>
    <el-row style="width: 100%;height: 100%" v-loading="loading" element-loading-text="拼命加载中" element-loading-background="rgba(238,238,238,0.8)">
      <el-col :span="7"  style="height: 100%">
        <el-button type="primary" size="mini" @click="getCurrentData" style="">实时版</el-button>
        <p>问题单总数：<b style="color:chocolate">{{TotalProblemNum}}</b></p>
        <el-table
          :data="sortPersonalStatistics"
          style="width:100%"
          stripe
          fit
          size="small">
          <el-table-column
            align = "center"
            label = "问题单概览"
          >
            <template slot-scope="props">
              <a @click=turnToPerson(props.row) style="cursor: pointer">{{props.row.name}}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop= "problemNum"
            align = "center"
            label = "数量"
          ></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="16" :offset="1" style="height: 100%;overflow-y: scroll" id="ProblemLists">
        <template v-for="item in PersonalDetails">
          <div :id='item.name' style="margin: 10px 0px;;font-size: 18px;font-weight: 700;padding-left: 12px;">{{item.name}}</div>
          <el-table
            :data = "item.problemList"
            style="width:100%;margin-bottom: 20px"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position = "left" inline class="expand">
                  <el-form-item label="滞留时间:">
                    <span>
                      {{props.row.heldupDay}}
                    </span>
                  </el-form-item>
                  <el-form-item label="严重程度:">
                    <span>
                      {{props.row.odcseverity}}
                    </span>
                  </el-form-item>
                  <el-form-item label="提单日期:">
                    <span>
                      {{props.row.submitDay}}
                    </span>
                  </el-form-item>
                  <el-form-item label="提单人:">
                    <span>
                      {{props.row.submitBy}}
                    </span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
            align = "center"
            label = "问题单号"
            width="150px">
              <template slot-scope="scope">
                <a :href='scope.row.url' target="_Blank">{{scope.row.listNumber}}</a>
              </template>
            </el-table-column>
            <el-table-column
            prop= "describe"
            align = "center"
            label = "问题描述"
            ></el-table-column>
            <el-table-column
            prop= "listStatus"
            align = "center"
            label = "问题单状态"
            width="150px"
            ></el-table-column>
          </el-table>
        </template>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      allData:{},
      PersonalStatistics:[],
      PersonalDetails:[],
      refreshStatus:false,
      expands:[],
      loading:false
    }
  },
  mounted(){
    this.initData()
  },
  computed:{
    sortPersonalStatistics:function(){
      return this.PersonalStatistics.sort(function(a,b){
        return b.problemNum-a.problemNum
      })
    },
    // sortPersonalDetailsProblemList:function(){
    //   return this.PersonalDetails.problemList.sort(function(a,b){
    //     return b.heldupDay-a.heldupDay
    //   })
    // },
    TotalProblemNum:function(){
      let totalNum = 0
      let _this = this
      for(let i=0; i< _this.PersonalStatistics.length; i++){
        totalNum += Number(_this.PersonalStatistics[i].problemNum)
      }
      return totalNum
    }
  },
  methods:{
    initData(){
      let _this = this;
      this.$axios.get('http://wkf6879b:80/idms/getAll',{params:{}}).then(function(res){
        _this.allData = res.data
        for(let key in _this.allData){
          let oPersonalStatistics = {}
          let oPersonalDetails = {}
          oPersonalStatistics.name = key
          oPersonalStatistics.problemNum = _this.allData[key].problemNum
          oPersonalStatistics.nodealProblemNum = _this.allData[key].noDealProblemNum
          oPersonalDetails.name = key
          oPersonalDetails.problemList = []
          for(let i = 0 ;i<_this.allData[key].problemList.length;i++){
            let oData = {}
            oData.listNumber = _this.allData[key].problemList[i].listNumber
            oData.url = _this.allData[key].problemList[i].url
            oData.describe = _this.allData[key].problemList[i].describe
            oData.listStatus = _this.allData[key].problemList[i].listStatus
            oData.odcseverity = _this.allData[key].problemList[i].odcseverity
            oData.heldupDay = _this.allData[key].problemList[i].heldupDay
            oData.submitBy = _this.allData[key].problemList[i].submitBy
            oData.submitDay = _this.allData[key].problemList[i].submitDay
            oPersonalDetails.problemList.push(oData)
          }
          //将滞留时间长的问题单放在前面
          oPersonalDetails.problemList = oPersonalDetails.problemList.sort(function(a,b){
            return b.heldupDay-a.heldupDay
          })
          _this.PersonalStatistics.push(oPersonalStatistics)
          _this.PersonalDetails.push(oPersonalDetails)
        }
      })
    },
    getCurrentData(){
      let _this = this;
      _this.refreshStatus = true;
      _this.loading = true;
      _this.allData = {};
      _this.$axios.get('http://wkf6879b:80/idms/getCurrentAll',{params:{}}).then(function(res){
        _this.PersonalStatistics = [];
        _this.PersonalDetails = [];
        _this.allData = res.data
        for(let key in _this.allData){
          let oPersonalStatistics = {}
          let oPersonalDetails = {}
          oPersonalStatistics.name = key
          oPersonalStatistics.problemNum = _this.allData[key].problemNum
          oPersonalStatistics.nodealProblemNum = _this.allData[key].noDealProblemNum
          oPersonalDetails.name = key
          oPersonalDetails.problemList = []
          for(let i = 0 ;i<_this.allData[key].problemList.length;i++){
            let oData = {}
            oData.listNumber = _this.allData[key].problemList[i].listNumber
            oData.url = _this.allData[key].problemList[i].url
            oData.describe = _this.allData[key].problemList[i].describe
            oData.listStatus = _this.allData[key].problemList[i].listStatus
            oData.odcseverity = _this.allData[key].problemList[i].odcseverity
            oData.heldupDay = _this.allData[key].problemList[i].heldupDay
            oData.submitBy = _this.allData[key].problemList[i].submitBy
            oData.submitDay = _this.allData[key].problemList[i].submitDay
            oPersonalDetails.problemList.push(oData)
          }
          _this.PersonalStatistics.push(oPersonalStatistics)
          _this.PersonalDetails.push(oPersonalDetails)
          _this.refreshStatus = false;
          _this.loading = false;
        }
      })
    },
    turnToPerson(oRow){
      console.log(oRow)
      let oDoM = document.getElementById(oRow.name)
      let oFather = document.getElementById("ProblemLists")
      let nOffsetTop = oDoM.offsetTop;
      oFather.scrollTop = nOffsetTop
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .expand{
    font-size: 0;
  }
  .expand label{
    width: 90px;
    color: #99a9bf
  }
  .expand .el-form-item{
    margin-right: 0;
    margin-bottom: 0;
    width: 50%
  }
  .el-table__row{
    color:red
  }
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
