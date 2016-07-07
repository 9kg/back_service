$(function(){
    // 定义升级特邀用户窗口
    var box = new Box({
        title: "添加特邀用户",
        html: "http://192.168.1.211:5211/back/page/guest_user_add .add_guest_user_form",
        css: {
            "min-width": "200px"
        },
        fnSure: function(that,fn) {
            var $dockForm = $('.add_guest_user');
            if (!base.formValidate($dockForm)) {
                return false;
            } else {
                var date_val = $('[name="input_by_date"]').val();
                if(!date_val || date_val === "0"){
                    $('[name="charge_by_date"],[name="input_by_date"]').prop("disabled",true);
                }
                var sendData = $(".add_guest_user").serializeArray();
                $.ajax({
                    url: "test.php",
                    type: "POST",
                    dataType: "json",
                    data: sendData
                }).done(function(){
                    that.afterfnSure && that.afterfnSure("das");
                }).fail(function(e){
                    that.afterfnSure && that.afterfnSure();
                });
            }
        },
        fnCancel: function(t) {}
    });



    $("body").on("change",'.add_guest_user_form select[name="guest_type"]',function(){
        $(this).validate(function(){
            return $(this).val();
        },'该字段必填！',{dir:'bottom'});
    }).on('change', 'select[name="guest_type"]', function() {
        var val = $(this).val();
        $(".fans_num_ct").toggleClass("hidden", (val !== "anchor" && val !== "weibo"));

        $('.fans_num_ct').find(":input").prop("disabled", true);
        $('.fans_num_ct').find(":input").not(".hidden :input,:input.hidden").prop("disabled", false);
    });
    window.oper_guest = {
        box: box
    };
});
