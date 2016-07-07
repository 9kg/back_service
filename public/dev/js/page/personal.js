$(function(){
    var $dockForm;
    var box = new Box({
        title: "修改个人信息",
        css: {
            "min-width": "320px",
            "max-width": "420px",
        },
        fnSure: function(that,fn) {
            if (!base.formValidate($dockForm)) {
                return false;
            } else {
                var data = $dockForm.serializeArray();
                $.ajax({
                    url: "http://192.168.1.211:5211/personal/modify",
                    type: "POST",
                    dataType: "json",
                    data: data
                }).done(function(data){
                    console.log(data);
                    if(data.status == 1){
                        $('.btn_edit').parent().operTip(data.msg || "操作成功！",{theme: "success", css:{"white-space": "nowrap"}});
                        setTimeout(function(){
                            window.location.href = window.location.href;
                        },500);
                    }else if(data.status == 2){
                        $('[data-show=".set_password"]').parent().operTip(data.msg || "操作失败！",{theme: "danger", dir: 'top', css:{"white-space": "nowrap"}});
                        box.show();
                    }
                }).fail(function(e){
                    console.dir(e);
                });
            }
        },
        fnCancel: function(t) {}
    });
    box.initContent('http://192.168.1.211:5211/page/personal_add .add_personal_form', function() {
        $dockForm = $('form.add_personal');
        $('[name="name"]').val(personalData.name).before($('<input type="hidden" name="id" value="'+personalData.id+'">'));
        $('[name="phone"]').val(personalData.phone);
        // $('[name="username"]').val(personalData.username).prop('disabled',true);
        // 将name换成resetname hack后台
        // $('[name="password"]').attr('name','resetpwd').attr('placeholder','如不修改请留空').removeAttr("data-validate");
    });
    $("body").on('click', '.btn_edit', function() {
        box.show();
    });
});