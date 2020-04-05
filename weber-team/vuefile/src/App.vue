<template>
  <div id="app">
    <el-container>
      <el-header>
        <span class="wave"></span>
        <span class="wave"></span>
        <span class="wave"></span>
        <img src="/static/img/IronMan.png" alt="" style="width:40px;position:relative;top:8px" id="Logo">
        <label for="Logo">IronMan</label>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-row style="margin-bottom: 60px">
            <el-col :span="24">
              <el-menu
                default-active="/"
                class="el-menu-vertical-demo"
                active-text-color="#ffd04b"
                router
                >
                <el-menu-item index="/">
                  <template slot="title">
                    <i class="el-icon-tickets"></i>
                    <span>设备列表</span>
                  </template>
                </el-menu-item>
                <el-menu-item index="LyncPeople">
                  <i class="el-icon-service"></i>
                  <span slot="title">联系人</span>
                </el-menu-item>
                <el-menu-item index="ProblemList">
                  <i class="el-icon-document"></i>
                  <span slot="title">问题单</span>
                </el-menu-item>
                <el-menu-item index="favorite">
                  <i class="el-icon-star-on"></i>
                  <span slot="title">收藏夹</span>
                </el-menu-item>
                <el-menu-item index="versionPath">
                  <i class="el-icon-mobile-phone"></i>
                  <span slot="title">分支路径</span>
                </el-menu-item>
                <el-menu-item index="details">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>说明</span>
                  </template>
                </el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-main>
          <div :style="mainScreenHeight">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
      <el-footer style="height:40px">H3C WeberTeam© 版权所有</el-footer>
    </el-container>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        mainScreenHeight: {
          height:"500px"
        },
        Month:"",
        Day:"",
        D016SP:{},
        D029SP:{},
        Trunk:{},
        D016SPLastDay:"",
        D029SPLastDay:"",
        TrunkLastDay:"",
        routerIndex:""
      }
    },
    methods: {
      initData(){
        let _this = this
        let Month = new Date().getMonth()+1
        let nowDay = new Date().getDate()
        this.Day = nowDay
        this.$axios.get('http://wkf6879b:80/blockversiontime/getVersionTime',{
          params:{time:new Date().getTime()}
        }).then(function(res){
            _this.D016SP = res.data.VersionInfo[Month].D016SP
            _this.D029SP = res.data.VersionInfo[Month].D029SP
            _this.Trunk = res.data.VersionInfo[Month].Trunk
            _this.dealData()
        })
        .catch(function(err){
            console.log(err)
        })
      },
      dealData(){
        let _this = this
        for(let key in _this.D016SP){
          if(parseInt(key) >= _this.Day){
            _this.D016SPLastDay = parseInt(key) - _this.Day
            if(_this.D016SPLastDay > 3){
              _this.$notify({
                title:'D016封板通知',
                dangerouslyUseHTMLString:true,
                position:'bottom-left',
                duration:10000,
                message:'<div style="margin-left: 16px;color:#33c4c4"><span  style="display: block;">距离:</span><div style="line-height: 24px;">'+_this.D016SP[_this.Day+_this.D016SPLastDay][0]+'<br>'+_this.D016SP[_this.Day+_this.D016SPLastDay][1]+'</div><span style="display: block;">封板还有<b>'+_this.D016SPLastDay+'</b>天</span></div>'
              })
            }
            else if(_this.D016SPLastDay <= 3 && _this.D016SPLastDay >0){
              _this.$notify({
                title:'D016封板通知',
                dangerouslyUseHTMLString:true,
                position:'bottom-left',
                duration:10000,
                message:'<div style="margin-left: 16px;color:cornflowerblue"><span  style="display: block;">距离:</span><div style="line-height: 24px;">'+_this.D016SP[_this.Day+_this.D016SPLastDay][0]+'<br>'+_this.D016SP[_this.Day+_this.D016SPLastDay][1]+'</div><span style="display: block;">封板还有<b>'+_this.D016SPLastDay+'</b>天</span></div>'
              })
            }
            else if(_this.D016SPLastDay == 0){
              _this.$notify({
                title:'D016封板通知',
                dangerouslyUseHTMLString:true,
                position:'bottom-left',
                duration:10000,
                message:'<div style="margin-left: 16px;color:red"><div style="line-height: 24px;">'+_this.D016SP[_this.Day+_this.D016SPLastDay][0]+'<br>'+_this.D016SP[_this.Day+_this.D016SPLastDay][1]+'</div><span style="display: block;"><b>今天封板啦 o(>~<)o</b></span><span style="display: block;">记得归档啊~~</span></div>'
              })
            }
            break
          }else{
            continue
          }
        }
        for(let key in _this.D029SP){
          if(parseInt(key) >= _this.Day){
            _this.D029SPLastDay = parseInt(key) - _this.Day
            if(_this.D029SPLastDay > 3){
              _this.$notify({
                title:'D029封板通知',
                dangerouslyUseHTMLString:true,
                position:'bottom-left',
                duration:7000,
                message:'<div style="margin-left: 16px;color:#33c4c4"><span  style="display: block;">距离:</span><div style="line-height: 24px;">'+_this.D029SP[_this.Day+_this.D029SPLastDay][0]+'<br>'+_this.D029SP[_this.Day+_this.D029SPLastDay][1]+'</div><span style="display: block;">封板还有<b>'+_this.D029SPLastDay+'</b>天</span></div>'
              })
            }
            else if(_this.D029SPLastDay <= 3 && _this.D029SPLastDay >0){
              _this.$notify({
                title:'D029封板通知',
                dangerouslyUseHTMLString:true,
                position:'bottom-left',
                duration:7000,
                message:'<div style="margin-left: 16px;color:cornflowerblue"><span  style="display: block;">距离:</span><div style="line-height: 24px;">'+_this.D029SP[_this.Day+_this.D029SPLastDay][0]+'<br>'+_this.D029SP[_this.Day+_this.D029SPLastDay][1]+'</div><span style="display: block;">封板还有<b>'+_this.D029SPLastDay+'</b>天</span></div>'
              })
            }
            else if(_this.D029SPLastDay == 0){
              _this.$notify({
                title:'D029封板通知',
                dangerouslyUseHTMLString:true,
                position:'bottom-left',
                duration:7000,
                message:'<div style="margin-left: 16px;color:red"><div style="line-height: 24px;">'+_this.D029SP[_this.Day+_this.D029SPLastDay][0]+'<br>'+_this.D029SP[_this.Day+_this.D029SPLastDay][1]+'</div><span style="display: block;"><b>今天封板啦 o(>~<)o</b></span><span style="display: block;">记得归档啊~~</span></div>'
              })
            }
            break
          }else{
            continue
          }
        }
        for(let key in _this.Trunk){
          if(parseInt(key) >= _this.Day){
            _this.TrunkLastDay = parseInt(key) - _this.Day
            if(_this.TrunkLastDay > 3){
              _this.$notify({
                title:'Trunk封板通知',
                dangerouslyUseHTMLString:true,
                position:'bottom-left',
                duration:4000,
                message:'<div style="margin-left: 16px;color:#33c4c4"><span  style="display: block;">距离:</span><div style="line-height: 24px;">'+_this.Trunk[_this.Day+_this.TrunkLastDay][0]+_this.Trunk[_this.Day+_this.TrunkLastDay][1]+'</div><span style="display: block;">封板还有<b>'+_this.TrunkLastDay+'</b>天</span></div>'
              })
            }
            else if(_this.TrunkLastDay <= 3 && _this.TrunkLastDay >0){
              _this.$notify({
                title:'Trunk封板通知',
                dangerouslyUseHTMLString:true,
                position:'bottom-left',
                duration:4000,
                message:'<div style="margin-left: 16px;color:cornflowerblue"><span  style="display: block;">距离:</span><div style="line-height: 24px;">'+_this.Trunk[_this.Day+_this.TrunkLastDay][0]+_this.Trunk[_this.Day+_this.TrunkLastDay][1]+'</div><span style="display: block;">封板还有<b>'+_this.TrunkLastDay+'</b>天</span></div>'
              })
            }
            else if(_this.TrunkLastDay == 0){
              _this.$notify({
                title:'Trunk封板通知',
                dangerouslyUseHTMLString:true,
                position:'bottom-left',
                duration:4000,
                message:'<div style="margin-left: 16px;color:red"><div style="line-height: 24px;">'+_this.Trunk[_this.Day+_this.TrunkLastDay][0]+'<br>'+_this.Trunk[_this.Day+_this.TrunkLastDay][1]+'</div><span style="display: block;"><b>今天封板啦 o(>~<)o</b></span><span style="display: block;">记得归档啊~~</span></div>'
              })
            }
            break
          }else{
            continue
          }
        }
      }
    },
    watch: {
      screenHeight: function (val, oldVal) {
        if (!this.timer) {
          this.mainScreenHeight.height = val + 'px'
          this.timer = true
          let that = this
          setTimeout(function () {
              console.log(that.mainScreenHeight.height)
              that.timer = false
          }, 400)
        }
      }
    },
    mounted () {
      let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      this.mainScreenHeight.height = h-140+ "px"
      this.$root.screenHeight = h
      window.onresize = () => {
          return (() => {
              let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
              window.screenHeight = h-140 + 'px'
              this.mainScreenHeight.height = window.screenHeight
              console.log(this.mainScreenHeight.height)
          })()
      }
      this.initData()
    }
  }
</script>

<style>
body {
  margin: 0;
  padding: 0
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  overflow: hidden;
}

.el-container{
  height: 100%;
}
.el-header, .el-footer {
    background-color: #241649;
    color: #fff;
    text-align: center;
    line-height: 45px;
  }
  .el-header{
    position: relative;
    z-index: 3;
    border-top: 3px solid #009a61;
    box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.1),0 1px rgba(0,0,0,0.1);
    width: 100%;
  }
  .wave{
    position: absolute;
    top: -8172px;
    left: -3300px;
    width: 8000px;
    height: 8000px;
    background: #39276b;
    border-radius: 43%;
    filter: opacity(0.4);
    animation: waves linear infinite;
  }
  .wave:nth-of-type(1){
    animation-duration: 10s
  }
  .wave:nth-of-type(2){
    animation-duration: 14s
  }
  .wave:nth-of-type(3){
    animation-duration: 18s
  }
  @keyframes waves {
    from{
      transform: rotate(360deg)
    }
  }
  .sea
  .el-footer{
    position: fixed;
    z-index: 3;
    bottom: 0px;
    box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.1),0 1px rgba(0,0,0,0.1);
    width: 100%;
    height: 45px
  }

  .el-aside {
    color: #333;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    box-sizing: border-box;
    height: 100%;
    overflow: scroll-left;
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
  ::-webkit-scrollbar{
    width:6px;
    background-color: #f5f5f5
  }
  ::-webkit-scrollbar-track{
    -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.5);
    border-radius:6px;
    background-color: #f5f5f5

  }
  ::-webkit-scrollbar-thumb{
    border-radius:6px;
    -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.8);
    background-color: #555
  }
</style>
