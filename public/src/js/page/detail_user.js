$(function(){
    $("body").on("click", ".btn_level", function() {
        oper_guest.box.initHeader('添加特邀用户');
        oper_guest.box.initContent('_HOST_/page/guest_user_add .add_guest_user_form', function() {
            $('[name="uid"]').val(userData.objectId);
            oper_guest.box.show();
        });
        var $tip_ct = $(this).parent();
        oper_guest.box.afterfnSure = function(data){
            if(data.status === 1){
                $tip_ct.operTip(data.msg || "操作成功！",{theme: "success",css:{left:'auto',right:'20px',"white-space": "nowrap"}});
            }else{
                $tip_ct.operTip(data.msg || "操作失败！",{theme: "danger",css:{left:'auto',right:'20px',"white-space": "nowrap"}});
            }
        }
    });
});