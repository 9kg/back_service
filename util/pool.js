var mysql = require('mysql');

var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'bramble.wang',
  user            : 'bramble',
  password        : 'xuguoyi11',
  database        : 'laizhuan_task'
});
var pool_lz  = mysql.createPool({
  connectionLimit : 10,
  host            : '180.76.161.253',
  user            : 'laizhuan',
  password        : 'laizhuan',
  database        : 'laizhuan'
});

module.exports = {
    pool: pool,
    pool_lz: pool_lz
};