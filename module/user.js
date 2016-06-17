var pool_lz = require('../util/pool').pool_lz;


var sql_query = 'select a.objectId,(a.price+a.pnow+a.pend) as allGet,b.phone,c.nickname,count(d.uid) as loginNum,DATE_FORMAT(FROM_UNIXTIME(max(UNIX_TIMESTAMP(d.createdAt))),"%Y-%m-%d %H:%i:%s") as loginLatist,d.ip, e.idfa,'
                +'(select sum(taskprice) from task_log where task_end>=1466121600 and uid=a.objectId) as todayGet '
                +'from uid a '
                +'left join mid b on a.mid=b.objectId '
                +'left join wid c on a.wid=c.objectId '
                +'left join uid_login_log d on a.objectId=d.uid '
                +'left join did e on b.objectId=e.mid '
                +'where ?? like ? '
                +'group by a.objectId '
                +'order by ?? '
                +'limit ?,?';
var sql_query_len = 'select count(*) from uid a '
                +'left join mid b on a.mid=b.objectId '
                +'left join wid c on a.wid=c.objectId '
                +'left join uid_login_log d on a.objectId=d.uid '
                +'left join did e on b.objectId=e.mid '
                +'where ? like ? ';
var sql_queryOne = '';

var fields = {
    'objectId': 'a.objectId',
    'allGet': '(a.price+a.pnow+a.pend)',
    'nickname': 'c.nickname',
    'loginNum': 'count(d.uid)',
    'loginLatist': 'DATE_FORMAT(FROM_UNIXTIME(max(UNIX_TIMESTAMP(d.createdAt))),"%Y-%m-%d %H:%i:%s")',
    'ip': 'd.ip',
    'idfa': 'e.idfa',
    'todayGet': '(select sum(taskprice) from task_log where task_end>=1466121600 and uid=a.objectId)'
};
// 用户列表查询
function query(fn,data){
    var _len = data.page_size;
    var _start = (data.cur_page-1)*_len;
    var _sort = fields[data.sort];
    var _sort_dir = data.sort_dir;
    var _filter_key = fields[data.filter_key];
    var _filter_val = data.filter_val;
    var xx = pool_lz.query(sql_query,[_filter_key,'%'+_filter_val+'%',_sort,_start,_len], function(err, rows, fields) {
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