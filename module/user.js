var pool_lz = require('../util/pool').pool_lz;


var sql_query = 'select a.objectId,(a.price+a.pnow+a.pend) as allGet,b.phone,c.nickname,count(d.uid) as loginNum,DATE_FORMAT(FROM_UNIXTIME(max(UNIX_TIMESTAMP(d.createdAt))),"%Y-%m-%d %H:%i:%s") as loginLatist,d.ip, e.idfa,'
                +'(select sum(taskprice) from task_log where task_end>=1466121600 and uid=a.objectId) as todayGet '
                +'from uid a '
                +'left join mid b on a.mid=b.objectId '
                +'left join wid c on a.wid=c.objectId '
                +'left join uid_login_log d on a.objectId=d.uid '
                +'left join did e on b.objectId=e.mid '
                +'where ? like ? '
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
    'phone': 'b.phone',
    'allGet': '(a.price+a.pnow+a.pend)',
    'nickname': 'c.nickname',
    'idfa': 'e.idfa'
};
// 用户列表查询
function query(fn,data){
    var _len = data.page_size;              //每页记录数
    var _start = (data.cur_page-1)*_len;    //每页起始记录位置
    var _sort = fields[data.sort];          //排序字段
    var _sort_dir = data.sort_dir || '';    //排序方向
    var f_k = data.filter_key;
    var _filter_key = fields[f_k];          //搜索字段
    var _filter_val = data.filter_val;      //搜索值
    var send_data = {
        status: 1
    };

    var sql_query = 'select a.objectId,(a.price+a.pnow+a.pend) as allGet,b.phone,c.nickname, e.idfa'
                +' from uid a'
                +' left join mid b on a.mid=b.objectId'
                +' left join wid c on a.wid=c.objectId'
                +' left join did e on b.objectId=e.mid'
                +(_filter_val ? ' where '+_filter_key+' like ?' : '')
                +' group by a.objectId'
                +' order by '+_sort+' '+_sort_dir
                +' limit ?,?';
    var sql_query_len = 'select count(*) from uid a'
                        + (f_k === 'phone' ? ' left join mid b on a.mid=b.objectId' : '')
                        + (f_k === 'nickname' ? ' left join wid c on a.wid=c.objectId' : '')
                        + (f_k === 'idfa' ? ' left join mid b on a.mid=b.objectId left join did e on b.objectId=e.mid' : '')
                        +(_filter_val ? ' where '+_filter_key+' like ?' : '')
                        +' group by a.objectId';
    var query_arr = ['%'+_filter_val+'%',_start,_len];
    var query_len_arr = ['%'+_filter_val+'%'];
    if(!_filter_val){
        query_arr.shift();
        query_len_arr.shift();
    }
    var flag = true;
    var xx = pool_lz.query(sql_query, query_arr, function(err, rows, fields) {
        flag = !flag;
        if(err){
            send_data.status = 2;
            send_data.msg = "获取数据失败";
            send_data.err = err;
        }else{
            send_data.data = rows;
        }
        flag && fn && fn(send_data);
    });
    var cc = pool_lz.query(sql_query_len, query_len_arr, function(err, rows, fields) {
        flag = !flag;
        if(err){
            send_data.status = 2;
            send_data.msg = send_data.msg || "获取数据长度失败";
            send_data.err = err;
        }else{
            send_data.total = rows.length; 
        }
        flag && fn && fn(send_data);
    });
}
// 查单个
function queryOne(){

}
module.exports = {
    query: query,
    queryOne: queryOne
};