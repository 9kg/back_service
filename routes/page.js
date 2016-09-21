var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("推广模块");
var url = require('url');
var util = require('util');

var transReq = require('../util/transReq');
var user = require('../module/user');
var guest_user = require('../module/guest_user');
var promoter = require('../module/promoter');

var config = require('../config/app_config.json');
var roles = config.roles;
var transUrl = config.transUrl;
// 菜单页面
var menus = config.menus;
menus.forEach(function(item) {
    if(item.url){
        var getUrl = item.dir === "common" ? '/' + item.url : '/' + item.url + '_' + item.dir;
        router.get(getUrl, (req, res, next) => {
            var role_arr = item.role;
            var role = res.locals.user.role;
            if(role_arr && !~role_arr.indexOf(role)){
                res.redirect('deny');
            }else{
                res.render(item.dir + '/' + item.url, {
                    menus: menus,
                    curPage: item.id,
                    role: role,
                    id: res.locals.user.id
                });
            }
        });
    }else if(item.items){
        item.items.forEach(function(iitem) {
            var getUrl = iitem.dir === "common" ? '/' + iitem.url : '/' + iitem.url + '_' + iitem.dir;
            router.get(getUrl, (req, res, next) => {
                var role_arr = iitem.role;
                var role = res.locals.user.role;
                if(role_arr && !~role_arr.indexOf(role)){
                    res.redirect('deny');
                }else{
                    res.render(iitem.dir + '/' + iitem.url, {
                        menus: menus,
                        curPage: item.id,
                        role: role,
                        id: res.locals.user.id
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
        var obj = {menus: menus,user:res.locals.user};
        if(item.url === "welcome"){
            obj = Object.assign(obj,{role: res.locals.user.role})
        }
        res.render(item.dir + '/'+item.url, obj);
    });
});

// 添加页面
var addPages = [{ url: 'adver'},
                { url: 'adver_cashed'},
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
        var role_arr = item.role;
        var role = res.locals.user.role;
        if(role_arr && !~role_arr.indexOf(role)){
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
        var role_arr = item.role;
        var role = res.locals.user.role;
        var renderData = {renderData:false};
        if(role_arr && !~role_arr.indexOf(role)){
            res.redirect('deny');
        }else{
            if(item.url === 'task' || item.url === 'user'){
                // 分页的数据
                req.query.filter_key = 'id'
                req.query.filter_val = id;
                if(item.url === 'task'){
                    transReq(req,res,transUrl[item.url].query,item.url+"详情",function(data){
                        var lists = data.data;
                        if(lists && util.isArray(lists)){
                            renderData = {
                                renderData : lists[0]
                            };
                        }
                        if(!renderData.renderData){
                            res.render('common/404');
                        }else{
                            res.render('detail/'+item.url,renderData);
                        }
                    });
                }else{
                    user.queryOne(function(data){
                        if(data.status === 1){
                            renderData = {
                                renderData : data.data[0],
                                role: role
                            };
                            res.render('detail/'+item.url,renderData);   
                        }else if(data.status === 2){
                            res.render('common/404');
                        }else{
                            res.render('common/error');
                        }
                    },id);
                }
            }else{
                // 不分页的数据
                if(item.url === 'guest_user'){
                    guest_user.queryOne(function(data){
                        if(data.status === 1){
                            user.queryOne(function(user_data){
                                if(user_data.status === 1){
                                    renderData = {
                                        renderData : Object.assign(user_data.data[0],data.data[0]),
                                        role: role
                                    };
                                    res.render('detail/'+item.url,renderData);   
                                }else if(user_data.status === 2){
                                    res.render('common/404');
                                }else{
                                    res.render('common/error');
                                }
                            },data.data[0].uid);
                        }else if(data.status === 2){
                            res.render('common/404');
                        }else{
                            res.render('common/error');
                        }
                    },id);
                }else if(item.url === 'promoter'){
                    promoter.queryOne(function(data){
                        if(data.status === 1){
                            renderData = {
                                renderData : data.data[0],
                                role: role
                            };
                            res.render('detail/'+item.url,renderData); 
                        }else if(data.status === 2){
                            res.render('common/404');
                        }else{
                            res.render('common/error');
                        }
                    },id);
                }else{
                    transReq(req,res,transUrl[item.url].query,item.url+"详情",function(data){
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
        }
    });
});

module.exports = router;
