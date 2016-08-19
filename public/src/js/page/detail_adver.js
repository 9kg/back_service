$(function(){
    var $modifyForm;
    // 充值弹框
    var recharge_box = new Box({
        title: "广告主充值",
        html: '<form class="recharge_form">'
                    +'<input type="hidden" name="ad_id" value="'+adData.id+'">'
                    +'<div class="grid_nowrap">'
                        +'<div class="ct_4">'
                            +'<label class="whether">'
                                +'<input type="checkbox" checked class="isPos">'
                                +'<span class="opt_imitate">加</span>'
                                +'<span class="opt_imitate">减</span>'
                            +'</label>'
                        +'</div>'
                        +'<div class="ct_4-3">'
                            +'<label class="suffix">'
                                +'<input type="text" name="price_all" data-validate="require,+">'
                                +'<span class="opt_imitate">元</span>'
                            +'</label>'
                        +'</div>'
                    +'</div>'
                +'</form>',
        css: {
            "width": "300px"
        },
        fnSure: function(that,fn) {
            var $form = $('.recharge_form');
            if (!base.formValidate($form)) {
                return false;
            } else {
                var recharge_num = +$('[name="price_all"]',$form).val();
                var data = {
                    ad_id: $('[name="ad_id"]',$form).val(),
                    price_all: $('.isPos').prop('checked') ? recharge_num : -recharge_num
                };
                $.ajax({
                    url: "_HOST_/adver/recharge",
                    type: "POST",
                    dataType: "json",
                    data: data
                }).done(function(data){
                    console.log(data);
                    if(data.status == 1){
                        refreshPage();
                    }else{
                        $('.btn_recharge').parent().operTip((data && data.msg) || "操作失败！",{theme: "danger", css:{"white-space": "nowrap",left: 'auto',right: '-2em'}});
                    }
                }).fail(function(e){
                    console.dir(e);
                });
            }
        },
        fnCancel: function(t) {}
    });
    // 修改广告主弹框
    var modify_box = new Box({
        title: "修改广告主",
        css: {
            "min-width": "320px",
            "max-width": "420px",
        },
        fnSure: function(that,fn) {
            if (!base.formValidate($modifyForm)) {
                return false;
            } else {
                if(!$.trim($('[name="resetpwd"]').val())){
                    $('[name="resetpwd"]').prop('disabled',true);
                }
                var data = $modifyForm.serializeArray();
                $('[name="resetpwd"]').prop('disabled',false);
                $.ajax({
                    url: "_HOST_/adver/edit",
                    type: "POST",
                    dataType: "json",
                    data: data
                }).done(function(data){
                    if(data.status == 1){
                        refreshPage();
                    }else{
                        $('.btn_edit').parent().operTip((data && data.msg) || "操作失败！",{theme: "danger", css:{"white-space": "nowrap",left: 'auto',right: '-2em'}});
                    }
                }).fail(function(e){
                    console.dir(e);
                });
            }
        },
        fnCancel: function(t) {}
    });
    // 充值记录弹框
    var records_box = new Box({
        title:"充值记录",
        html:'<div class="records_list table_min"></div>',
        css:{
            "min-width": "320px"
        },
        footer: false
    });

    // 修改广告主弹框内容初始化
    modify_box.initContent('_HOST_/page/adver_add .add_adver_form', function() {
        $modifyForm = $('form.add_adver');
        $('[name="company"]').val(adData.company);
        $('[name="name"]').val(adData.name).before($('<input type="hidden" name="id" value="'+adData.id+'">'));
        $('[name="phone"]').val(adData.phone);
        $('[name="username"]').val(adData.username).prop('disabled',true);
        // 将name换成resetname hack后台
        $('[name="password"]').attr('name','resetpwd').attr('placeholder','如不修改请留空').removeAttr("data-validate");
    });

    // 事件
    $("body").on('click', '.btn_edit', function() {
        modify_box.show();
    }).on('click', '.btn_recharge', function() {
        recharge_box.show();
    }).on('click', '.recharge_records', function() {
        records_box.show();
        var opt = {
            $ct: $(".records_list"),
            col: [{
                key: "createdAt",
                title: "时间",
                sort: true,
                filter: true
            }, {
                key: "price_all",
                title: "金额",
                sort: true,
                filter: true
            }, {
                key: "descripe",
                title: "描述",
                sort: true,
                filter: true,
                cls: "hidden_xs"
            }],
            isLocal: true,
            theme: 'lightblue',
            url: "_HOST_/adver/recharge_records?id="+adData.id
        };
        !$(".records_list .table").length && new Table(opt);
    }).on('click', '.btn_add_task', function() {
        // 添加任务时 初始化弹窗标题及内容
        oper_task.box.initHeader('添加任务');
        oper_task.box.operType = "insert";
        oper_task.box.initContent('_HOST_/page/task_add .add_task_form', function() {
            oper_task.box.show();
            oper_task.initWidget();
            $('form.add_task').prepend($('<input type="hidden" name="ad_id" value="'+adData.id+'">'));
        });
        var $tip_ct = $(this).parent();
        oper_task.box.afterfnSure = function(success,tip){
            if(success){
                $tip_ct.operTip(tip || "操作成功！",{theme: "warning", css:{"white-space": "nowrap",left: 'auto',right: '3em'}});
            }else{
                $tip_ct.operTip(tip || "操作失败！",{theme: "danger", css:{"white-space": "nowrap",left: 'auto',right: '3em'}});
            }
        }
    });

    // 页面更新
    function refreshPage(){
        window.location.href = window.location.href;
        window.opener && window.opener.renderTable && window.opener.renderTable();
    }
});