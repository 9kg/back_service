var crypto = require('crypto');

function get(data){
    return crypto.createHash('md5').update(data).digest('hex');
}
 module.exports = {
    get: get
 };