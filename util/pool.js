var mysql = require('mysql');

var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'xxx',
  user            : 'xxx',
  password        : 'xxx',
  database        : 'xxx'
});
var pool_lz  = mysql.createPool({
  connectionLimit : 10,
  host            : 'xxx',
  user            : 'xxx',
  password        : 'xxx',
  database        : 'xxx'
});

module.exports = {
    pool: pool,
    pool_lz: pool_lz
};