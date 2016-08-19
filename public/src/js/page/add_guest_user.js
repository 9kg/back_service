$(function(){
    // 定义升级特邀用户窗口
    var box = new Box({
        title: "添加特邀用户",
        html: "_HOST_/page/guest_user_add .add_guest_user_form",
        css: {
            "min-width": "200px"
        },
        fnSure: function(that,fn) {
            var $dockForm = $('.add_guest_user');
            var $fee_date = $('[name="fee_date"]');
            var $fee_date_val = +$fee_date.val();
            if (!base.formValidate($dockForm)) {
                return false;
            }
            if(!$(".charge_type:checked").length && !$fee_date_val){
                $(".btn_radios").parent().operTip("请至少选填一项推广费用！",{theme: "danger", dir: 'top', css:{"white-space": "nowrap"}});
                return false;
            }else{
                $fee_date.val($('[name="charge_by_date"]:checked').val()+'_'+$fee_date_val);
                $('[name="charge_by_date"]').prop("disabled",true);

                var sendData = $(".add_guest_user").serializeArray();
                
                $fee_date.val($fee_date_val);
                $('[name="charge_by_date"]').prop("disabled",false);
                // 向后台发送数据
                $.ajax({
                    url: "_HOST_/guest_user/insert",
                    type: "POST",
                    dataType: "json",
                    data: sendData
                }).done(function(data){
                    that.afterfnSure && that.afterfnSure(data);
                }).fail(function(e){
                    that.afterfnSure && that.afterfnSure({status: -1,msg: "请求发送失败"});
                });
            }
        },
        fnCancel: function(t) {}
    });



    $("body").on("change",'.add_guest_user_form select[name="type"]',function(){
        $(this).validate(function(){
            return $(this).val();
        },'该字段必填！',{dir:'bottom'});
    }).on('change', 'select[name="type"]', function() {
        var val = $(this).val();
        $(".fans_num_ct").toggleClass("hidden", (val !== "anchor" && val !== "microblog"));

        $('.fans_num_ct').find(":input").prop("disabled", true);
        $('.fans_num_ct').find(":input").not(".hidden :input,:input.hidden").prop("disabled", false);
    });
    window.oper_guest = {
        box: box
    };
});
