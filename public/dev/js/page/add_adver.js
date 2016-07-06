$(function(){
    // 表单提交
    function sendData(afterfnSure){
        var $dockForm = $('form.add_adver');
        if (!base.formValidate($dockForm)) {
            return false;
        } else {
            var data = $dockForm.serializeArray();
            $.ajax({
                url: "http://192.168.1.211:9211/adver/insert",
                type: "POST",
                dataType: "json",
                data: data
            }).done(function(data){
                if(data.status == 1){
                    afterfnSure && afterfnSure(true, data && data.msg);
                }else if(data.status == 2){
                    //用户名已存在的情况
                    oper_adver && oper_adver.box && oper_adver.box.show();
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
            title: "添加广告主",
            html: "http://192.168.1.211:9211/page/adver_add .add_adver_form",
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
    //（弹框运行时该段js先于添加任务页面dom渲染前执行）
    if($('[name="ad_company"]').length){
        $('form.add_adver [name="ad_company"]').attr('data-validate-dir','');
    }else{
        beforeDialog();
    };

    // 非弹框时提交
    $("body").on("click",'.btn_adver_submit',function(){
        sendData(function(success, tip){

        });
    });
});
