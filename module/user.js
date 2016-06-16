var mysql = require('mysql');
var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'hasaqiss',
  user            : 'hasaqiss',
  password        : 'hasaqiss',
  database        : 'hasaqiss'
});
module.exports = pool;

var sql_query = 'select * from uid where ?? like ? order by ?? limit ?,?';
var sql_queryOne = '';

// 查全部
function query(fn){
    var xx = pool.query(sql_query,['id','%'+11+'%','id',1,10], function(err, rows, fields) {
        if(err){
            console.log(err);
        };
    console.log(xx.sql);
      fn && fn(err || {status: 1, data: rows});
    });
}
// 查单个
function queryOne(){

}
module.exports = {
    query: query,
    queryOne: queryOne
};