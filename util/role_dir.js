var role_dirs = ['admin', 'finance', 'service', 'spd_m', 'bd_m', 'spd', 'bd', 'ad'];
function get(role){
    return role_dirs[role-1];
}
 module.exports = {
    get: get
 };