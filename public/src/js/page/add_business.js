$(function(){
    // 表单提交
    function sendData(afterfnSure){
        var $dockForm = $('form.add_business');
        if (!base.formValidate($dockForm)) {
            return false;
        } else {
            var data = $dockForm.serializeArray();
            $.ajax({
                url: "_HOST_/business/insert",
                type: "POST",
                dataType: "json",
                data: data
            }).done(function(data){
                console.log(data);
                if(data.status == 1){
                    afterfnSure && afterfnSure(true, data && data.msg);
                }else if(data.status == 2){
                    //用户名已存在的情况
                    oper_business && oper_business.box && oper_business.box.show();
                    $dockForm.find('[name="username"]').val('').focus().parent().operTip((data && data.msg) || "用户名已存在！",{theme: "danger",dir:'top',css:{'white-space':'nowrap'}});
                }
            }).fail(function(e){
                afterfnSure && afterfnSure(false);
                console.dir(e);
            });
        }
        return true;
    }
    // 弹框前需要执行的js
    function beforeDialog(){
        // 初始化添加任务弹框
        var box = new Box({
            title: "添加商务",
            // html: "_HOST_/page/business_add .add_business_form",
            css: {
                "min-width": "320px",
                "max-width": "420px",
            },
            fnSure: function(that,fn) {
                if(!sendData(that && that.afterfnSure)){
                    return false;
                };
            },
            fnCancel: function(t) {}
        });
        // 暴露给弹窗主页面的方法
        window.oper_business = {
            box: box
        };
    }
    //（弹框运行时该段js先于添加商务页面dom渲染前执行）
    if($('[name="bd_name"]').length){
        $('form.add_business [name="bd_name"]').attr('data-validate-dir','');
    }else{
        beforeDialog();
    };

    // 非弹框时提交
    $("body").on("click",'.btn_business_submit',function(){
        sendData(function(success, tip){

        });
    });
});
