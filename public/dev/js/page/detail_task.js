$(function(){
    var $dockForm;
    var status = +taskData.power;
    
    status === -1 && $('.btn_modify').removeClass("hidden");
    status === 1 && $('.btn_modify_num').removeClass("hidden");

    $("body").on('click', '.btn_modify_num', function() {
        // 改量
        alert('抱歉，忘做了，有空回来加这个功能~');
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