<template>
    <div>
        <el-menu 
        class="favTitle"
        mode="horizontal"
        @select="onSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
            <el-menu-item index="h3cUsual">H3C常用</el-menu-item>
            <el-menu-item index="yunxuji">云虚机</el-menu-item>
            <el-menu-item index="others">文件共享</el-menu-item>
            <el-menu-item index="relax">Relax</el-menu-item>
        </el-menu>
        <ul class="noListStyle">
            <li v-for="item in afavoriteList">
                <template v-if="acitiveIndex=='h3cUsual'">
                    <!-- <a :href="item.url" target="_Blank">{{item.instruction}}</a>
                    <span>{{item.instruction}}</span> -->
                    <iframe :src="item.url" frameborder="0" width="100%" :height="$root.screenHeight-220+'px'"></iframe>
                </template>
                <template v-if="acitiveIndex=='yunxuji'">
                    <span>{{item.IP}}</span><br>
                    <label>owner:{{item.owner}}</label>
                    <label>PassWord:{{item.PassWord}}</label>
                    <span><i class="useStatus"></i><b>{{item.userStatus}}</b></span>
                </template>
                <template v-if="acitiveIndex=='others'">
                    <iframe :src="item.url" frameborder="0" width="100%" :height="$root.screenHeight-220+'px'"></iframe>
                </template>
                <template v-if="acitiveIndex=='relax'">
                    <!-- <span>{{item.title}}</span>
                    <a :href="item.url"  target="_Blank">出发o(≧v≦)o~~好棒</a> -->
                    <iframe :src="item.url" frameborder="0" width="100%" :height="$root.screenHeight-120+'px'"></iframe>
                </template>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
  data() {
    return {
      acitiveIndex: "h3cUsual",
      favoriteList: {
        h3cUsual: [
          {
            url: "http://wkf6879b/share/web-Pages/华三网站宝/华三网站宝.html",
            instruction: "WebCollection"
          }
        ],
        yunxuji: [
          {
            IP: "172.27.7.147",
            PassWord: "beijing",
            owner: "Gaofeixiang KF7375",
            userStatus: ""
          },
          {
            IP: "172.27.8.235",
            PassWord: "weber",
            owner: "wulei kf6879",
            userStatus: ""
          }
        ],
        others: [{
            url:"http://wkf6879b/share/"
        }],
        relax: [
          {
            title: "一个能把自己伪装成认真努力工作样子的程序:",
            url: "http://wkf6879b/share/games/wordFighter/"
          }
        ]
      },
      afavoriteList: []
    };
  },
  mounted() {
    this.afavoriteList = this.favoriteList[this.acitiveIndex];
    console.log(this.$root.screenHeight)
  },
  methods: {
    onSelect(key, keyPath) {
      this.acitiveIndex = key;
      this.afavoriteList = this.favoriteList[this.acitiveIndex];
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.noListStyle {
  list-style: none;
  padding: 0;
}
.noListStyle li {
  margin: 8px 0;
}
</style>