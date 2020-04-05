<template>
    <el-container>
        <el-row style="width: 100%">
            <el-row style="overflow: hidden">
                <div style="float: left">更新時間： {{UpdateTime}}</div>
                <el-button type="primary" size="mini" @click="showDevVerInfoDialog" style="float: right">显示版本对应关系</el-button>
            </el-row>
            <el-row :gutter="20" >
                <el-col :span="12">
                    <div style="font-weight: 700;margin:10px auto">大WEB设备列表</div>
                    <el-table :data="sortDevInfoListOfBig" stripe style="height:100%" fit>
                        <el-table-column prop="hostIP" label="IP地址" align="center">
                            <template slot-scope="scope">
                                <a :href="'http://'+scope.row.hostIP" target="_blank" style="color: rgba(35, 115, 115,0.8)">{{scope.row.hostIP}}</a>
                                <a :href="'http://localhost:6879/debug/'+scope.row.devType+'/'+scope.row.hostIP" target="_blank" style="color: green">调试</a>
                            </template>
                        </el-table-column>
                        <el-table-column prop="devName" label="设备型号" align="center" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="SoftwareRev" label="版本" align="center">
                        </el-table-column>
                        <el-table-column prop="SoftwareExt" label="版本编号" align="center" width="80px" show-overflow-tooltip>
                        </el-table-column>
                    </el-table>
                </el-col>
                <el-col :span="12">
                    <div style="font-weight: 700;margin:10px auto">小贝设备列表</div>
                    <el-table :data="sortDevInfoListOfSmall" stripe style="height:100%" fit>
                        <el-table-column prop="hostIP" label="IP地址" align="center">
                            <template slot-scope="scope">
                                <a :href="'http://'+scope.row.hostIP" target="_blank" style="color: black">{{scope.row.hostIP}}</a>
                                <a :href="'http://localhost:6879/debug/'+scope.row.devType+'/'+scope.row.hostIP" target="_blank" style="color: green">调试</a>
                            </template>
                        </el-table-column>
                        <el-table-column prop="devName" label="设备型号" align="center">
                        </el-table-column>
                        <el-table-column prop="SoftwareRev" label="版本" align="center">
                        </el-table-column>
                        <el-table-column prop="SoftwareExt" label="版本编号" align="center" width="80px">
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <el-row style="margin-top: 20px">
                <el-table :data="restIp" stripe fit>
                    <el-table-column prop="hostIP" label="未占用IP地址" align="center">
                    </el-table-column>
                </el-table>
            </el-row>
        </el-row>
        <el-dialog title="版本对应关系" :visible.sync="devVerInfoDialog" top="8vh">
            <el-input
            v-model="searchInput"
            clearable
            placeholder="搜索版本名称..."
            style="width:30%;position: absolute;top: 40px;right: 68px"
            size="small">
            </el-input>
            <el-table :data="dealSearchInput" fit height="540">
                <el-table-column prop="VerNum" label="版本号"></el-table-column>
                <el-table-column prop="VerName" label="版本名称"></el-table-column>
            </el-table>
        </el-dialog>
    </el-container>
</template>

<script>
    export default{
        data (){
            return{
                DevList:[],
                restIp:[],
                DevInfoListOfSmall:[],
                DevInfoListOfBig:[],
                DevSamllSp:[],
                DevSamllTrunk:[],
                DevBigSP:[],
                DevBigTrunk:[],
                UpdateTime:"",
                devVerInfoDialog:false,
                oDevVerInfoAll:{},
                aDevVerInfoAll:[],
                searchInput:""
            }
        },
        mounted(){
            this.initData()
        },
        computed:{
            dealSearchInput:function(){
                let _this = this
                return this.aDevVerInfoAll.filter(function(items){
                    if(_this.searchInput == ""){
                        return items
                    }else{
                        if(items.VerName.toLowerCase().indexOf(_this.searchInput.toLowerCase())>=0){
                            return items
                        }
                    }
                })
            },
            sortDevInfoListOfBig:function(){
                return this.DevInfoListOfBig.sort(function(a,b){
                    let lastIpA = a.hostIP.split(".")[3]
                    let lastIpB = b.hostIP.split(".")[3]
                    return lastIpA-lastIpB
                })
            },
            sortDevInfoListOfSmall:function(){
                return this.DevInfoListOfSmall.sort(function(a,b){
                    let lastIpA = a.hostIP.split(".")[3]
                    let lastIpB = b.hostIP.split(".")[3]
                    return lastIpA-lastIpB
                })
            }
        },
        // watch:{
        //     searchInput:function(val,oldVal){
        //         this.aDevVerInfoResult = this.aDevVerInfoAll.filter(function(items){
        //             if(items.VerName.toLowerCase().indexOf(val.toLowerCase())>=0){
        //                 return items
        //             }
        //         })
        //     }
        // },
        methods:{
            initData(){
                let _this = this
                _this.$axios.get('http://wkf6879b:80/DevInfo/getAllDevInfo',{params:{time:new Date().getTime()}}).then(function(res){
                    _this.DevList = res.data.devList
                    _this.UpdateTime = res.data.updatetime
                    _this.filterDev(_this.DevList)
                })
                .catch(function(err){
                    console.log(err)
                })
                _this.$axios.get('http://wkf6879b:80/DevInfo/getRestIp').then(function(res){
                    _this.restIp = res.data
                })
                .catch(function(err){
                    console.log(err)
                })
            },
            filterDev(DevList){
                let _this = this;
                DevList.forEach(function(val,index){
                    if(/MSG/.test(val.devName) || /^WAC350$/.test(val.devName)){
                        if(val.SoftwareRev != undefined){
                            val.devType = val.SoftwareRev.match('B64D029SP') ? "xiaobeiSP": "xiaobei"
                        }else{
                            val.devType = "undefined"
                        }
                        _this.DevInfoListOfSmall.push(val)
                    }else{
                        if(val.SoftwareRev != undefined){
                            val.devType = val.SoftwareRev.match('B64D029SP') ? "dawebSP": "daweb"
                        }else{
                            val.devType = "undefined"
                        }
                        _this.DevInfoListOfBig.push(val)
                    } 
                })
            },
            dealDevVer(oDevVerInfoAll){
                let _this = this
                for(let key in oDevVerInfoAll){
                    let oResult = {}
                    oResult.VerName = key
                    oResult.VerNum = oDevVerInfoAll[key]
                    _this.aDevVerInfoAll.push(oResult)
                }
                _this.searchInput = ""
                _this.devVerInfoDialog = true
            },
            showDevVerInfoDialog(){
                let _this = this
                if(this.DevVerInfoAll == undefined){
                    this.$axios.get('http://wkf6879b:80/DevInfo/getDevVersionInfo',{params:{}}).then(function(res){
                        _this.oDevVerInfoAll = res.data
                        console.log(res.data)
                        _this.dealDevVer(_this.oDevVerInfoAll)
                    })
                    .catch(function(err){
                        console.log(err)
                    })
                }else{
                    _this.searchInput = ""
                    _this.devVerInfoDialog = true;
                }
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    a{
      text-decoration: none  
    }
</style>
