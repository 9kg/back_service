var pool = require('../util/pool').pool;

var sql_insert = 'insert into bg_user set ?';
var sql_remove = 'update bg_user set status=0 where id =?';
var sql_modify = 'update bg_user set ? where id =?';
var sql_query = 'select id,name,username,phone,DATE_FORMAT(createdAt,"%Y-%m-%d %H:%i:%s") as createdAt,DATE_FORMAT(updatedAt,"%Y-%m-%d %H:%i:%s") as updatedAt from bg_user where status != 0 or status is null and role = 6';
var sql_queryOne = 'select id,name,username,phone,DATE_FORMAT(createdAt,"%Y-%m-%d %H:%i:%s") as createdAt,DATE_FORMAT(updatedAt,"%Y-%m-%d %H:%i:%s") as updatedAt from bg_user where role = 6 and id = ?';
var sql_queryByUsername = 'select * from bg_user where username = ?';

// 增
function insert(fn,obj){
    pool.query(sql_queryByUsername, obj.username, function(err, rows, fields) {
        if(err){
            fn({status: 3,msg: "数据库操作失败。",data: err});
        }else if(rows.length !== 0){
             fn({status: 6,msg: "用户名已存在。"});
        }else{
            pool.query(sql_insert, obj,function(err, result) {
                if(err){
                    fn({status: 3,msg: "数据库添加失败。",data: err});
                }else{
                    fn({status: 1,msg: "添加成功。",data: (result && result.insertId)});
                }
            });
        }
    });
    
}
// 删
function remove(fn, id){
    pool.query(sql_remove, id,function(err, result) {
        if(err){
            fn({status: 3,msg: "数据库删除失败。",data: err});
        }else{
            fn({status: 1,msg: "删除成功。",data: result});
        }
    });
}
// 改
function modify(fn,obj){
    var id = obj.id;
    delete obj.id;

    pool.query(sql_modify, [obj,id],function(err, result) {
        if(err){
            fn({status: 3,msg: "数据库修改失败。",data: err});
        }else{
            fn({status: 1,msg: "修改成功。",data: result});
        }
    });
}
// 查全部
function query(fn){
    pool.query(sql_query, function(err, rows, fields) {
        if(err){
            console.log(err);
        };
      fn && fn(err || {status: 1, data: rows});
    });
}
// 查单个
function queryOne(fn,id){
    pool.query(sql_queryOne, id, function(err, rows, fields) {
        if(err){
            console.log(err);
        };
      fn && fn(err || {status: 1, data: rows});
    });
}
module.exports = {
    insert: insert,
    remove: remove,
    modify: modify,
    query: query,
    queryOne: queryOne
};