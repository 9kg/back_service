var pool = require('../util/pool');

var sql_insert = 'insert into bg_user set ?';
var sql_remove = '';
var sql_update = '';
var sql_query = 'select * from bg_user where role = 6';
var sql_queryOne = '';

// 增
function insert(fn,obj){
    var obj = {
        id: null,
        phone: obj.phone,
        role: 6,
        username: obj.username,
        name: obj.name,
        password: obj.password,
        createdAt: new Date,
        updatedAt: new Date
    };
    pool.query(sql_insert, obj,function(err, result) {
        if (err) {
            console.log(err);
        };
        fn && fn(err || result);
    });
}
// 删
function remove(){

}
// 改
function update(){

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
function queryOne(){

}
module.exports = {
    insert: insert,
    remove: remove,
    update: update,
    query: query,
    queryOne: queryOne
};