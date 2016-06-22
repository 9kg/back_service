$(function(){
    // 表单提交
    function sendData(afterfnSure){
        var $dockForm = $('form.add_adver');
        if (!base.formValidate($dockForm)) {
            return false;
        } else {
            var data = $dockForm.serializeArray();
            $.ajax({
                url: "test.php",
                type: "POST",
                dataType: "json",
                data: data
            }).done(function(){
                afterfnSure && afterfnSure("das");
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
            html: "http://192.168.1.114:9211/html/temp/add_adver.html .add_adver_form",
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
        window.oper_adver = {
            box: box
        };
    }
    // 非弹框时才作日期控件初始化（弹框运行时该段js先于添加任务页面dom渲染前执行）
    if($('[name="ad_company"]').length){
        $('form.add_adver [name="ad_company"]').attr('data-validate-dir','');
    }else{
        beforeDialog();
    };

    // 非弹框时提交
    $("body").on("click",'.btn_adver_submit',function(){
        sendData(function(tip){

        });
    });
});
