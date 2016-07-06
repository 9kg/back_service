$(function(){
    var $dockForm;
    var box = new Box({
        title: "修改商务",
        css: {
            "min-width": "320px",
            "max-width": "420px",
        },
        fnSure: function(that,fn) {
            if (!base.formValidate($dockForm)) {
                return false;
            } else {
                if(!$.trim($('[name="resetpwd"]').val())){
                    $('[name="resetpwd"]').prop('disabled',true);
                }
                var data = $dockForm.serializeArray();
                $('[name="resetpwd"]').prop('disabled',false);
                $.ajax({
                    url: "http://192.168.1.211:9211/business/edit",
                    type: "POST",
                    dataType: "json",
                    data: data
                }).done(function(data){
                    console.log(data);
                    if(data.status == 1){
                        window.location.href = window.location.href;
                        window.opener && window.opener.renderTable && window.opener.renderTable();
                    }
                }).fail(function(e){
                    console.dir(e);
                });
            }
        },
        fnCancel: function(t) {}
    });
    box.initContent('http://192.168.1.211:9211/page/business_add .add_business_form', function() {
        $dockForm = $('form.add_business');
        $('[name="name"]').val(bdData.name).before($('<input type="hidden" name="id" value="'+bdData.id+'">'));
        $('[name="phone"]').val(bdData.phone);
        $('[name="username"]').val(bdData.username).prop('disabled',true);
        // 将name换成resetname hack后台
        $('[name="password"]').attr('name','resetpwd').attr('placeholder','如不修改请留空').removeAttr("data-validate");
    });
    $("body").on('click', '.btn_edit', function() {
        box.show();
    });
});