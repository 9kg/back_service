var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("推广模块");
var util = require('util');

var transReq = require('../util/transReq');

// 菜单页面
var menus = require('../config/menu.json');
menus.forEach(function(item) {
    if(item.url){
        var getUrl = item.dir === "common" ? '/' + item.url : '/' + item.url + '_' + item.dir;
        router.get(getUrl, (req, res, next) => {
            var roles = item.role;
            var role = res.locals.role;
            if(roles && !~roles.indexOf(role)){
                res.redirect('deny');
            }else{
                res.render(item.dir + '/' + item.url, {
                    menus: menus,
                    curPage: item.id,
                    role: role
                });
            }
        });
    }else if(item.items){
        item.items.forEach(function(iitem) {
            var getUrl = iitem.dir === "common" ? '/' + iitem.url : '/' + iitem.url + '_' + iitem.dir;
            router.get(getUrl, (req, res, next) => {
                var roles = iitem.role;
                var role = res.locals.role;
                if(roles && !~roles.indexOf(role)){
                    res.redirect('deny');
                }else{
                    res.render(iitem.dir + '/' + iitem.url, {
                        menus: menus,
                        curPage: item.id,
                        role: role
                    });
                }
            });
        })
    }
});

// 其他页面
var otherPages = [{ url: 'login', dir:'common'},
                { url: 'welcome', dir:'common'},
                { url: '404', dir:'common'},
                { url: 'deny', dir:'common'},
                { url: 'error', dir:'common'}
            ];

otherPages.forEach(function(item) {
    var getUrl = '/' + item.url;
    router.get(getUrl, (req, res, next) => {
        res.render(item.dir + '/'+item.url, {
                        menus: menus
                    });
    });
});

// 添加页面
var addPages = [{ url: 'adver'},
                { url: 'business'},
                { url: 'source'},
                { url: 'personal'},
                { url: 'task'},
                { url: 'guest_user'},
                { url: 'promoter'},
                { url: 'docking'}
            ];

addPages.forEach(function(item) {
    var getUrl = '/' + item.url + '_add';
    router.get(getUrl, (req, res, next) => {
        var roles = item.role;
        var role = res.locals.role;
        if(roles && !~roles.indexOf(role)){
            res.redirect('deny');
        }else{
            res.render('add/' + item.url,{
                role: role
            });
        }
    });
});

// 详情页面
var detailPages = [{ url: 'adver', m: 'userListAd'},
                    { url: 'business', m: 'userListBd'},
                    { url: 'task', m: 'taskList'},
                    { url: 'source', m: 'sourceList'},
                    { url: 'guest_user'},
                    { url: 'promoter'},
                    { url: 'user'}
                ];

detailPages.forEach(function(item) {
    var getUrl = '/' + item.url + '_detail/:id';
    router.get(getUrl, (req, res, next) => {
        var id = req.params.id;
        var queryObj = {
            m: 'bd_m/'+item.m
        };
        var renderData = {renderData:false};
        
        var roles = item.role;
        var role = res.locals.role;
        if(roles && !~roles.indexOf(role)){
            res.redirect('deny');
        }else{
            if(item.url === 'task' || item.url === 'user'){
                // 分页的数据
                queryObj.filter_key = 'id'
                queryObj.filter_val = id;
                transReq.get(queryObj,function(data){
                    var lists = data.data;
                    if(lists && util.isArray(lists)){
                        renderData = {
                            renderData : lists[0]
                        };
                    }
                    res.render('detail/'+item.url,renderData);
                });
            }else{
                // 不分页的数据
                transReq.get(queryObj,function(data){
                    var lists = data.data;
                    if(lists && util.isArray(lists)){
                        lists.forEach(function(item){
                            if(item.id === id){
                                renderData = {
                                    renderData : item
                                };
                                return;
                            }
                        });
                    }else{
                        renderData = {renderData:data};
                    }
                    res.render('detail/'+item.url,renderData);
                });
            }
        }
    });
});

module.exports = router;
