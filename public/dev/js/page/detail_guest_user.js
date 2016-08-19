$(function(){
    var $tip_ct = $(".btn_edit").parent();
    // 定义升级特邀用户窗口
    var box = new Box({
        title: "修改特邀用户",
        html: "http://192.168.1.211:5211/back/page/guest_user_add .add_guest_user_form",
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
                if($('[name="fans_num"]').prop('disabled')){
                    sendData.push({name: 'fans_num', value: null});
                }
                if($('[name="fee_date"]').prop('disabled')){
                    sendData.push({name: 'fee_date', value: null});
                }
                if($('[name="fee_per"]').prop('disabled')){
                    sendData.push({name: 'fee_per', value: null});
                }
                if($('[name="fee_other"]').prop('disabled')){
                    sendData.push({name: 'fee_other', value: null});
                }
                
                if(!$('[name="can_withdraw"]').prop('checked')){
                    sendData.push({name: 'can_withdraw', value: 0});
                }

                
                $fee_date.val($fee_date_val);
                $('[name="charge_by_date"]').prop("disabled",false);
                // 向后台发送数据
                $.ajax({
                    url: "http://192.168.1.211:5211/back/guest_user/modify",
                    type: "POST",
                    dataType: "json",
                    data: sendData
                }).done(function(data){
                    if(data.status === 1){
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


    // 特邀用户删除 confirm
    var remove_confirm = new Tip({
        $ct: $(".details").eq(0),
        confirm: true,
        content: "您确定要删除当前特邀用户？",
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
                    url: "http://192.168.1.211:5211/back/guest_user/remove",
                    type: "POST",
                    dataType: "json",
                    data: {id: guest_user_data.id}
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
    console.dir(guest_user_data);
    $("body").on("click",'.btn_edit',function(){
        box.initContent('http://192.168.1.211:5211/back/page/guest_user_add .add_guest_user_form', function() {
            $('[name="uid"]').val(guest_user_data.id).attr("name","id");
            $('[name="type"]').val(guest_user_data._type).trigger("change");
            $('[name="fans_num"]').val(guest_user_data._fans_num);
            $('[name="name"]').val(guest_user_data.name);
            $('[name="alipay"]').val(guest_user_data.alipay);
            $('[name="fee_date"]').val(guest_user_data._fee_date);
            $('[name="charge_by_date"][value="'+guest_user_data.charge_by_date+'"]').trigger("click");
            $('[name="can_withdraw"]').prop("checked",!!guest_user_data.can_withdraw);

            if(guest_user_data.fee_per){
                $(".charge_type").eq(0).trigger("click");
                $('[name="fee_per"]').val(guest_user_data.fee_per);
            }
            if(guest_user_data.fee_other){
                $(".charge_type").eq(1).trigger("click");
                $('[name="fee_other"]').val(guest_user_data.fee_other);
            } 
            box.show();
        });
    }).on("click",'.btn_remove',function(){
        remove_confirm.init();
        remove_confirm.show();
    }).on("change",'.add_guest_user_form select[name="type"]',function(){
        $(this).validate(function(){
            return $(this).val();
        },'该字段必填！',{dir:'bottom'});
    }).on('change', 'select[name="type"]', function() {
        var val = $(this).val();
        $(".fans_num_ct").toggleClass("hidden", (val !== "anchor" && val !== "microblog"));

        $('.fans_num_ct').find(":input").prop("disabled", true);
        $('.fans_num_ct').find(":input").not(".hidden :input,:input.hidden").prop("disabled", false);
    });
});