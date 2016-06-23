var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("推广模块");

var transReq = require('../util/transReq');

// 菜单页面
var menus = [{ url: "user", dir: "common", icon: "72b", title: "用户", id: "user" },
    { url: "promoter", dir: "common", icon: "680", title: "推广人员", id: "promoter" },
    { url: "guest_user", dir: "common", icon: "6a2", title: "特邀用户", id: "guest_user" },
    { url: "business", dir: "common", icon: "66e", title: "商务人员", id: "business" },
    { url: "adver", dir: "common", icon: "675", title: "广告主", id: "adver" },
    { url: "task", dir: "common", icon: "6cd", title: "任务", id: "task" }, {
        items: [{ url: "guest_user", dir: "report", title: "特邀用户报表" },
            { url: "guest_user", dir: "report", title: "特邀用户报表" }
        ],
        icon: "889",
        title: "报表",
        id: "chart"
    },
    { url: "docking", dir: "common", icon: "83c", title: "对接", id: "docking" }, {
        items: [{ url: "welcome", dir: "common", title: "我的信息" },
            { url: "welcome", dir: "common", title: "修改密码" },
            { url: "welcome", dir: "common", title: "退出登录" }
        ],
        icon: "6b5",
        title: "个人中心",
        id: "personal"
    }
];
menus.forEach(function(item) {
    if (item.url) {
        var getUrl = item.dir === "common" ? '/' + item.url : '/' + item.url + '_' + item.dir;
        router.get(getUrl, (req, res, next) => {
            res.render(item.dir + '/' + item.url, {
                menus: menus,
                curPage: item.id
            });
        });
    } else {
        item.items.forEach(function(iitem) {
            var getUrl = iitem.dir === "common" ? '/' + iitem.url : '/' + iitem.url + '_' + iitem.dir;
            router.get(getUrl, (req, res, next) => {
                res.render(iitem.dir + '/' + iitem.url, {
                    menus: menus,
                    curPage: item.id
                });
            });
        })
    }
});

// 添加页面
var addPages = [{ url: 'adver', dir: 'add' },
                { url: 'business', dir: 'add' },
                { url: 'guest_user', dir: 'add' },
                { url: 'promoter', dir: 'add' },
                { url: 'task', dir: 'add' },
                { url: 'docking', dir: 'add' }
            ];

addPages.forEach(function(item) {
    var getUrl = item.dir === "common" ? '/' + item.url : '/' + item.url + '_' + item.dir;
    router.get(getUrl, (req, res, next) => {
        res.render(item.dir + '/' + item.url);
    });
});

// 详情页面
var detailPages = [{ url: 'adver', dir: 'detail' },
                    { url: 'business', dir: 'detail' },
                    { url: 'guest_user', dir: 'detail' },
                    { url: 'promoter', dir: 'detail' },
                    { url: 'task', dir: 'detail' },
                    { url: 'user', dir: 'detail' }
                ];

detailPages.forEach(function(item) {
    var getUrl = item.dir === "common" ? '/' + item.url : '/' + item.url + '_' + item.dir;
    router.get(getUrl, (req, res, next) => {
        if(item.url === 'business'){
            log.debug("商务详情");
            var queryObj = {
                m: 'bd_m/userListBd'
            };
            transReq.get(queryObj,function(data){
                console.log('===========================>');
                console.log(data);
                res.render('detail/business',{data:data});
            });
        }else{
            res.render(item.dir + '/' + item.url);
        }
    });
});

module.exports = router;
