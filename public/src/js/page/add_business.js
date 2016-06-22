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
                afterfnSure && afterfnSure(data && data.msg);
            }).fail(function(e){
                afterfnSure && afterfnSure();
                console.dir(e);
            });
        }
        return true;
    }
    // 弹框前需要执行的js
    function beforeDialog(){
        // 初始化添加任务弹框
        var box = new Box({
            title: "添加特邀用户",
            html: "_HOST_/html/temp/add_business.html .add_business_form",
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
    //（弹框运行时该段js先于添加任务页面dom渲染前执行）
    if($('[name="bd_name"]').length){
        $('form.add_business [name="bd_name"]').attr('data-validate-dir','');
    }else{
        beforeDialog();
    };

    // 非弹框时提交
    $("body").on("click",'.btn_business_submit',function(){
        sendData(function(tip){

        });
    });
});
