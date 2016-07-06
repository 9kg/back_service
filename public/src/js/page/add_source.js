$(function(){
    // 表单提交
    function sendData(afterfnSure){
        var $dockForm = $('form.add_source');
        if (!base.formValidate($dockForm)) {
            return false;
        } else {
            var data = $dockForm.serializeArray();
            var operType = oper_source.box.operType;
            $.ajax({
                url: "_HOST_/source/"+operType,
                type: "POST",
                dataType: "json",
                data: data
            }).done(function(data){
                console.log(data);
                if(data.status == 1){
                    afterfnSure && afterfnSure(true, data && data.msg);
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
        // 初始化添加来源弹框
        var box = new Box({
            title: "添加来源",
            html: "_HOST_/page/source_add .add_source_form",
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
        window.oper_source = {
            box: box
        };
    }
    //（弹框运行时该段js先于添加任务页面dom渲染前执行）
    if($('[name="name"]').length){
        $('form.add_source [name="name"]').attr('data-validate-dir','');
    }else{
        beforeDialog();
    };

    // 非弹框时提交
    $("body").on("click",'.btn_source_submit',function(){
        sendData(function(success, tip){

        });
    });
});
