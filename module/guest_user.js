var pool = require('../util/pool').pool;

var sql_insert = 'insert into bg_vip set ?';
var sql_remove = '';
var sql_update = '';
var sql_query = 'select * from bg_vip';
var sql_queryOne = 'select * from bg_vip where id = ?';

// 增
function insert(fn,obj){
//     var obj = {
//         id: null,
//         phone: obj.phone,
//         role: 6,
//         username: obj.username,
//         name: obj.name,
//         password: obj.password
//     };
//     pool.query(sql_insert, obj,function(err, result) {
//         if (err) {
//             console.log(err);
//         };
//         fn && fn(err || result);
//     });
}
// 删
function remove(){

}
// 改
function update(){

}

var typeObj = {
    anchor:'主播',
    weibo:'微博',
    team:'推广团队',
    wechat:'微信',
    person:'个人',
    other:'其他'
};
var dateObj = {
    day: '日',
    week: '周',
    month: '月',
};
// 查全部
function query(fn){
    pool.query(sql_query, function(err, rows, fields) {
        if(err){
            console.log(err);
        };
        
        fn && fn(err || {status: 1, data: renderRows(rows)});
    });
}
// 查单个
function queryOne(fn,id){
    var send_data = {
        status: 1
    };
    pool.query(sql_queryOne, id, function(err, rows, fields) {
        if(err){
            send_data.status = 3;
            send_data.msg = "获取数据失败";
            send_data.err = err;
        }else if(rows.length !== 1){
            send_data.status = 2;
        }else{
            send_data.data = renderRows(rows);
        }
        fn && fn(send_data);
    });
}

function renderRows(rows){
    var data = [];
    if(rows && rows.length){
        data = rows.map(n => {
            // 转类别描述
            n.type = typeObj[n.type];

            //拼接费用描述
            var pay_html = n.pay_per ? '每个'+n.pay_per+'元' : '';
            if(n.pay_time){
                var pay_time = n.pay_time.split('_');
                var pay_time_html = '每'+dateObj[pay_time[0]]+pay_time[1]+'元';
                pay_html && (pay_time_html = '<br>' + pay_time_html);
                pay_html += pay_time_html;
            }
            if(n.pay_other){
                pay_html && (n.pay_other = '<br>' + n.pay_other);
                pay_html += n.pay_other;
            }
            n.pay = pay_html;

            // 拼接已付描述
            n.payed = n.payed + '元';

            return n;
        });
    }
    return data;
}
module.exports = {
    insert: insert,
    remove: remove,
    update: update,
    query: query,
    queryOne: queryOne
};