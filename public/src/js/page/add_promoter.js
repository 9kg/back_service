$(function(){
    // 提示内容容器
    var $tip_ct = $(".btn_promoter_add").parent();
    
    // 表单提交
    function sendData(afterfnSure){
        var $dockForm = $('form.add_promoter');
        if (!base.formValidate($dockForm)) {
            return false;
        } else {
            var data = $dockForm.serializeArray();
            $.ajax({
                url: "_HOST_/promoter/insert",
                type: "POST",
                dataType: "json",
                data: data
            }).done(function(data){
                if(data.status === 1){
                    $tip_ct.operTip(data.msg || "操作成功！",{theme: "success",css:{dir: 'left',"white-space": "nowrap"}});
                    window.renderTable && window.renderTable();
                }else if(data.status === 6){
                    $('[name="username"]').addClass("invalid").parent().prev().operTip(data.msg || "当前用户名已存在！",{theme: "danger",css:{dir: 'right',"white-space": "nowrap"}});
                    window.oper_promoter.box.show();
                }else{
                    $tip_ct.operTip(data.msg || "操作失败！",{theme: "danger",css:{dir: 'left',"white-space": "nowrap"}});
                }
            }).fail(function(e){
                $tip_ct.operTip(data.msg || "操作失败！",{theme: "danger",css:{dir: 'left',"white-space": "nowrap"}});
            });
        }
        return true;
    }
    // 弹框前需要执行的js
    function beforeDialog(){
        // 初始化添加任务弹框
        var box = new Box({
            title: "添加推广人员",
            html: "_HOST_/page/promoter_add .add_promoter_form",
            css: {
                "min-width": "320px",
                "max-width": "420px"
            },
            fnSure: function(that,fn) {
                if(!sendData(that && that.afterfnSure)){
                    return false;
                };
            },
            fnCancel: function(t) {}
        });
        // 暴露给弹窗主页面的方法
        window.oper_promoter = {
            box: box
        };
    }
    //（弹框运行时该段js先于添加任务页面dom渲染前执行）
    if($('[name="name"]').length){
        $('form.add_promoter [name="name"]').attr('data-validate-dir','');
    }else{
        beforeDialog();
    };

    // 非弹框时提交
    $("body").on("click",'.btn_promoter_submit',function(){
        sendData(function(tip){

        });
    });
});
