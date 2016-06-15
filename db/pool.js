var mysql = require('mysql');
var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'bramble.wang',
  user            : 'bramble',
  password        : 'xuguoyi11',
  database        : 'laizhuan_task'
});

module.exports = pool;