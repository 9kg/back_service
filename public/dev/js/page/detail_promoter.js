$(function(){
    var $tip_ct = $(".btn_edit").parent();
    
    var $modifyForm;
    // 修改推广人员弹框
    var modify_box = new Box({
        title: "修改推广人员",
        css: {
            "min-width": "320px",
            "max-width": "420px",
        },
        fnSure: function(that,fn) {
            if (!base.formValidate($modifyForm)) {
                return false;
            } else {
                if(!$.trim($('[name="password"]').val())){
                    $('[name="password"]').prop('disabled',true);
                }
                var data = $modifyForm.serializeArray();
                $('[name="password"]').prop('disabled',false);
                $.ajax({
                    url: "http://192.168.1.211:5211/back/promoter/modify",
                    type: "POST",
                    dataType: "json",
                    data: data
                }).done(function(data){
                    if(data.status == 1){
                        $tip_ct.operTip(data.msg || "操作成功！",{theme: "success",css:{left:'auto',right:'20px',"white-space": "nowrap"}});
                        window.opener && window.opener.renderTable && window.opener.renderTable();
                        setTimeout(function(){
                            window.location.href = window.location.href;
                        },500);
                    }else{
                        $tip_ct.operTip(data.msg || "操作失败！",{theme: "danger",css:{left:'auto',right:'20px',"white-space": "nowrap"}});
                    }
                }).fail(function(e){
                    $tip_ct.operTip(data.msg || "操作失败！",{theme: "danger",css:{left:'auto',right:'20px',"white-space": "nowrap"}});
                });
            }
        },
        fnCancel: function(t) {}
    });

    // 修改推广人员弹框内容初始化
    modify_box.initContent('http://192.168.1.211:5211/back/page/promoter_add .add_promoter_form', function() {
        $('[name="name"]').val(promoter_data.name).before($('<input type="hidden" name="id" value="'+promoter_data.id+'">'));
        $('[name="phone"]').val(promoter_data.phone);
        $('[name="username"]').val(promoter_data.username).prop('disabled',true);
        $('[name="password"]').attr('placeholder','如不修改请留空').removeAttr("data-validate");
        $modifyForm = $('form.add_promoter');
    });


    // 推广人员删除 confirm
    var remove_confirm = new Tip({
        $ct: $(".details").eq(0),
        confirm: true,
        content: "您确定要删除当前推广人员？",
        isShow: false,
        theme: "warning",
        dir: 'bottom',
        css: {
            'width': '9em'
        },
        alertfn: function(flag){
            if(flag){
                // 向后台发送数据
                $.ajax({
                    url: "http://192.168.1.211:5211/back/promoter/remove",
                    type: "POST",
                    dataType: "json",
                    data: {id: promoter_data.id}
                }).done(function(data){
                    if(data.status === 1){
                        $tip_ct.operTip(data.msg || "操作成功！",{theme: "success",css:{left:'auto',right:'20px',"white-space": "nowrap"}});
                        window.opener && window.opener.renderTable && window.opener.renderTable();
                        setTimeout(function(){
                            window.close();
                        },500);
                    }else{
                        $tip_ct.operTip(data.msg || "操作失败！",{theme: "danger",css:{left:'auto',right:'20px',"white-space": "nowrap"}});
                    }
                }).fail(function(e){
                    $tip_ct.operTip(data.msg || "操作失败！",{theme: "danger",css:{left:'auto',right:'20px',"white-space": "nowrap"}});
                });
            }
        }
    });
    $("body").on("click",'.btn_edit',function(){
        modify_box.show();
    }).on("click",'.btn_remove',function(){
        remove_confirm.init();
        remove_confirm.show();
    });
});