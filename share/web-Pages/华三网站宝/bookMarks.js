var bookMarks = [
    {
        name: "H3C官网",
        Url: "http://www.h3c.com",
        image: "http://www.h3c.com/cn/tres/NewWebUI/images/index/logo.png",
        type: "公司网站",
        weight: 2
    },
    {
        name: "isoft",
        Url: "http://isoft.h3c.com",
        type: "业务网站",
        image: "http://isoft.h3c.com/Scripts/EasyUI/themes/iSoft/images/nav/logo.png",
        weight: 7
    },
    {
        name: "idms",
        Url: "http://idms.h3c.com",
        type: "业务网站",
        image: "statics/idms.png",
        weight: 8
    },
    {
        name: "Press",
        Url: "http://press/",
        type: "业务网站",
        image: "http://press/img/ciba.jpg",
        weight: 6
    },
    {
        name: "tech.h3c.com",
        Url: "http://tech.h3c.com/",
        type: "知识与论坛",
        image: "statics/tech.png",
        weight: 5
    }, 
    {
        name: "idata版本传递系统",
        Url: "http://idata/",
        type: "业务网站",
        // image: "http://idata/images/header_right.jpg",
        image: "http://idata/Images/backgroud.jpg",
        weight: 2
    },
    {
        name: "WebApi",
        Url: "http://sft/info/webapi/",
        type: "工具类",
        weight: 2
    },
    {
        name: "ADMP账号与权限管理",
        Url: "http://admp.h3c.com/",
        type: "账号与流程",
        image: "http://admp.h3c.com/Content/Images/AdmpLogo.jpg",
        weight: 1
    },
    {
        name: "NETCONF文档大全",
        Url:"http://10.153.120.98/Leopard-SOFT-COMMON-Document/DOCUMENT/NETCONF%E6%96%87%E6%A1%A3/trunk/",
        type: "工具类",
        weight: 0
    },
    {
        name: "无线局域网论坛",
        Url:"http://rdbbs/forum.php?mod=forumdisplay&action=list&fid=185",
        type: "知识与论坛",
        image: "http://rdbbs/static/image/common/logo.png",
        weight: 1
    },
    {
        name: "H3C大讲堂",
        Url: "http://lms.h3c.com/lds/sys_login.do",
        type: "知识与论坛",
        image: "statics/course.png",
        weight: 1
    },
    // {
    //     name: "software(不可用)",
    //     Url: "http://software.h3c.com/",
    //     type: "其他网站",
    //     weight: 0
    // },
    {
        name: "特性接口人列表",
        Url: "http://sft/info/",
        type: "工具类",
        weight: 1
    },
    {
        name: "jenkinsV7board",
        Url: "http://10.153.3.69:8080/jenkins/viewboard/",
        type: "其他网站",
        weight: 0
    },
    {
        name: "pal.h3c.com",
        Url: "http://pal.h3c.com/",
        type: "知识与论坛",
        image: "statics/pal.png",
        weight: 1
    },
    {
        name: "版本发布验证",
        Url: "http://10.154.243.143:3000/wlan",
        type: "业务网站",
        // image: "statics/pal.png",
        weight: 1
    },
    {
        name: "TMS团队管理(chrome)",
        Url: "http://tms.h3c.com",
        type: "管理平台",
        image: "http://tms.h3c.com/img/login.png",
        weight: 1
    },
    {
        name: "bpm流程管理(<span style='font-weight:bold;'>ie访问</span>)",
        Url: "http://bpm.h3c.com",
        type: "账号与流程",
        image: "statics/bpm.png",
        weight: 1
    },
    {
        name: "私有云",
        Url: "http://cloud.h3c.com",
        type: "管理平台",
        image: "https://cloud.h3c.com/Content/img/h3cCloud.png",
        weight: 2
    },
    {
        name: "会议室预定",
        Url: "http://rdsp.h3c.com/wireless/meeting/default.aspx",
        type: "账号与流程",
        // image: "https://cloud.h3c.com/Content/img/h3cCloud.png",
        weight: 1
    },
    {
        name: "联调版本对外发送系统",
        Url: "http://10.154.243.101/",
        type: "业务网站",
        image: "http://10.154.243.101/Images/backgroud.jpg",
        weight: 2
    },
    {
        name: "域群组查询",
        Url: "http://ad-group.h3c.com/",
        type: "账号与流程",
        // image: "http://10.154.243.101/Images/backgroud.jpg",
        weight: 0
    },
    {
        name: "员工自助平台",
        Url: "https://hrss.h3c.com/",
        type: "账号与流程",
        // image: "http://10.154.243.101/Images/backgroud.jpg",
        weight: 0
    },
    {
        name: "IPD计划管理平台",
        Url: "http://iplan.h3c.com/",
        type: "管理平台",
        image: "http://iplan.h3c.com/Static/Images/iplan.jpg",
        weight: 0
    },
    {
        name: "iLab集成实验室管理",
        Url: "http://ilab.h3c.com/",
        type: "管理平台",
        image: "http://ilab.h3c.com/Resources/Images/Login/Login_bg3.jpg",
        weight: 0
    },
    {
        name: "信息安全系统帮助中心",
        Url: "http://ishelp.h3c.com/",
        type: "其他网站",
        image: "http://ishelp.h3c.com/index.files/image015.jpg",
        weight: 0
    },
    {
        name: "IT热线自助平台",
        Url: "http://ithelp.h3c.com/",
        type: "其他网站",
        image: "http://ithelp.h3c.com/common/logo/h3c.png",
        weight: 0
    },
    {
        name: "产品数据管理系统",
        Url: "http://pdm.h3c.com/",
        type: "其他网站",
        image: "http://pdm.h3c.com/awc/thinclient/images/ssobackground.jpg",
        weight: 0
    },
    {
        name: "ipan文件传输平台",
        Url: "http://ipan.h3c.com/",
        type: "管理平台",
        image: "http://ipan.h3c.com/resource/images/head_new.gif",
        weight: 2
    },
    {
        name: "华三用户认证中心portal",
        Url: "https://sso.h3c.com/adloginpage.aspx",
        type: "账号与流程",
        image: "statics/sso.png",
        weight: 1
    },
    {
        name: "华三协同平台",
        Url: "https://rap.h3c.com/",
        type: "其他网站",
        image: "https://rap.h3c.com/j2-admin/images/login.png",
        weight: 0
    },
    {
        name: "任职资格",
        Url: "http://rzzg.h3c.com/rzzg",
        type: "其他网站",
        image: "http://rzzg.h3c.com/rzzg/resource/images/header_agile.gif",
        weight: 0
    },
    {
        name: "财务报销",
        Url: "https://sse.h3c.com/sseweb/index.jsp",
        type: "其他网站",
        image: "statics/sse.png",
        weight: 0
    },
    {
        name: "SVN权限管理系统",
        Url: "http://svnm.h3c.com/",
        type: "管理平台",
        image: "http://svnm.h3c.com/images/bk.jpg",
        weight: 0
    },
    {
        name: "测试数据管理系统",
        Url: "http://tdms/",
        type: "其他网站",
        image: "http://tdms/tdms/images/201111/login/login-bg-1.jpg",
        weight: 0
    },
    {
        name: "通用考试系统",
        Url: "http://10.154.243.105/WebExam/",
        type: "其他网站",
        // image: "https://rap.h3c.com/j2-admin/images/login.png",
        weight: 1
    }
]
