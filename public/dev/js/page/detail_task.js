$(function(){
    var $dockForm;
    var status = +taskData.power;

    // 改量弹框
    var change_num_box = new Box({
        title: "任务改量",
        html: '<form class="change_num_form">'
                    +'<input type="hidden" name="task_id" value="'+taskData.id+'">'
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
                                +'<input type="text" name="task_cg_num" data-validate="require,+">'
                                +'<span class="opt_imitate">个</span>'
                            +'</label>'
                        +'</div>'
                    +'</div>'
                +'</form>',
        css: {
            "width": "300px"
        },
        fnSure: function(that,fn) {
            var $form = $('.change_num_form');
            if (!base.formValidate($form)) {
                return false;
            } else {
                var change_num_num = +$('[name="task_cg_num"]',$form).val();
                var data = {
                    id: $('[name="task_id"]',$form).val(),
                    num: $('.isPos').prop('checked') ? change_num_num : -change_num_num
                };
                $.ajax({
                    url: "http://192.168.1.211:5211/back/task/change_num",
                    type: "POST",
                    dataType: "json",
                    data: data
                }).done(function(data){
                    console.log(data);
                    if(data.status == 1){
                        refreshPage();
                    }else{
                        $('.btn_modify_num').parent().operTip((data && data.msg) || "操作失败！",{theme: "danger", css:{"white-space": "nowrap",left: 'auto',right: '-2em'}});
                    }
                }).fail(function(e){
                    console.dir(e);
                });
            }
        },
        fnCancel: function(t) {}
    });
    
    status === -1 && $('.btn_modify').removeClass("hidden");
    status === 1 && $('.btn_modify_num').removeClass("hidden");

    $("body").on('click', '.btn_modify_num', function() {
        // 改量
        change_num_box.show();
    })
    $("body").on('click', '.btn_modify', function() {
        // 任务修改
        oper_task.box.initHeader('修改任务');
        oper_task.box.operType = 'modify';
        oper_task.box.initContent('http://192.168.1.211:5211/back/page/task_add .add_task_form', function() {
            oper_task.box.show();
            oper_task.initWidget();
            $('form.add_task .show_by_edit').removeClass('hidden').find('input').prop('disabled',false);
            window.oper_task.renderTaskForm(taskData);
        });
        var $tip_ct = $(this).parent();
        oper_task.box.afterfnSure = function(success,tip){
            if(success){
                $tip_ct.operTip(tip || "操作成功！",{theme: "warning", css:{"white-space": "nowrap"}});
            }else{
                $tip_ct.operTip(tip || "操作失败！",{theme: "danger", css:{"white-space": "nowrap"}});
            }
        }
    }).on('click', '.btn_copy', function() {
        //任务续单
        oper_task.box.initHeader('任务续单');
        oper_task.box.operType = 'insert';
        oper_task.box.initContent('http://192.168.1.211:5211/back/page/task_add .add_task_form', function() {
            oper_task.box.show();
            oper_task.initWidget();
            window.oper_task.renderTaskForm(taskData);
        });
        var $tip_ct = $(this).parent();
        oper_task.box.afterfnSure = function(success,tip){
            if(success){
                $tip_ct.operTip(tip || "操作成功！",{theme: "warning", css:{"white-space": "nowrap"}});
                window.close();
            }else{
                $tip_ct.operTip(tip || "操作失败！",{theme: "danger", css:{"white-space": "nowrap"}});
            }
        }
    });
});