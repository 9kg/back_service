$(function(){

    // 删除confirm
    var confirm_tip = new Tip({
        $ct: $(".btn_remove").parent(),
        confirm: true,
        isShow: false,
        theme: "warning",
        content: '您确认要删除'+sourceData.name+'('+sourceData.id+')',
        css: {
            'word-break': 'break-word'
        },
        alertfn: function(flag){
            flag && removeCur();
        }
    });

    $("body").on('click', '.btn_edit', function() {
        oper_source.box.initHeader('修改来源');
        oper_source.box.operType = 'modify';
        oper_source.box.initContent('http://192.168.1.211:5211/back/page/source_add .add_source_form', function() {
            oper_source.box.show();
            // 赋值当前来源id
            $('form.add_source [name="name"]').val(sourceData.name).before($('<input type="hidden" name="id" value="'+sourceData.id+'">'));
        });
        var $tip_ct = $(this).parent();
        oper_source.box.afterfnSure = function(success,tip){
            if(success){
                window.location.href = window.location.href;
                window.opener && window.opener.renderTable && window.opener.renderTable();
            }else{
                $tip_ct.operTip(tip || "操作失败！",{theme: "danger", css:{"white-space": "nowrap"}});
            }
        }
    }).on('click', '.btn_remove', function() {
        confirm_tip.show();
    });

    // 删除当前来源
    function removeCur(){
        var tip_ct = $(".title");
        $.ajax({
                url: "http://192.168.1.211:5211/back/source/remove",
                type: "POST",
                dataType: "json",
                data: {
                    id : sourceData.id
                }
        }).done(function(data){
            if(data.status == 1){
                tip_ct.operTip("操作成功，本窗口3秒后自动关闭。",{theme: "success"});
                window.opener && window.opener.renderTable && window.opener.renderTable();
                setTimeout(function(){
                    window.close();
                },3000);
            }else if(data.status == 2){
                tip_ct.operTip(data.msg || "操作失败！",{theme: "danger", css:{"white-space": "nowrap"}});
            }
        }).fail(function(e){
            tip_ct.operTip("操作失败！",{theme: "danger", css:{"white-space": "nowrap"}});
            console.dir(e);
        });
    }
});