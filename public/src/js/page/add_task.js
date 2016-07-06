$(function(){
    // 获取来源数据
    var source_data = {};
    $.ajax({
        url: '_HOST_/source/query',
        dataType: "json"
    }).done(function(data){
        if(data.status == 1){
            $.each(data.data,function(i,item){
                source_data[item.id] = item.name;
            });
        }
    });
    var date_start,date_end;
    function initWidget(){
        // 日期控件的初始化
        var start_date = base.calDate('i',-(new Date).getMinutes());
        var end_date = base.calDate('y',1,start_date);
        date_start = $(".date_start").val(base.date("y-m-d h:i",start_date)).datepicker({format: 'y-m-d h:i',min: "today",datetime: start_date});
        date_end = $(".date_end").val(base.date("y-m-d h:i",end_date)).datepicker({format: 'y-m-d h:i',min: "today",datetime: end_date});

        // 来源框置为suggest控件
        $('.source_id_ct').suggest({
            key: 'id',
            val: 'name',
            $key_ct: $('[name="source_id"]'),
            $val_ct: $('.source_name'),
            data: source_data
        });
        
    }


    // 任务弹出框的值回填
    function renderTaskForm(row_data){
        var $form = $('form.add_task');
        // 无控制文本框
        var $els1 = ['storeurl', 'stime', 'expire', 'countall', 'steptime', 'id', 'name'];
        // 有控制文本框
        // var $els2 = ['link', 'pay_num', 'keyword', 'keywordTop', 'source_id', 'iscomment'];  //pay_num  暂不启用
        var $els2 = ['link', 'keyword', 'keywordTop', 'source_id', 'iscomment'];
        // 多选按钮（带other）
        var $els3 = ['price', 'taskprice'];
        // 单选按钮
        var $els4 = ['isDeviceVer'];        
        // 单选按钮（是否）
        var $els5 = ['steptime_acc', 'isiPhone', 'isreg', 'isWifi', 'isSim', 'isJailbreak', 'isIp', 'isIpcn', 'isSided', 'isIdfa'];

        $.each($els1,function(i,item){
            $('[name="'+item+'"]',$form).val(row_data[item]);
        });

        $.each($els2,function(i,item){
            var exit = row_data[item] && row_data[item] !== '0';
            $('.ct_'+item,$form).prop('checked', exit).trigger('change');
            if(exit){
                $('[name="'+item+'"]',$form).val(row_data[item]);
                if(item === 'source_id'){
                    $('.source_name').val(source_data[row_data[item]]);
                }
            };
        });

        $.each($els3,function(i,item){
            var exitEle = $('[name="'+item+'"][value="'+row_data[item]+'"]',$form);
            if(exitEle.length){
                exitEle.prop('checked',true);
            }else{
                $('.ct_'+item,$form).prop('checked', true).trigger('change');
                $('[type="text"][name="'+item+'"]',$form).val(row_data[item]);
            };
        });

        $.each($els4,function(i,item){
            $('[name="'+item+'"][value="'+row_data[item]+'"]',$form).prop('checked', true);
        });

        $.each($els5,function(i,item){
            $('[name="'+item+'"]',$form).prop('checked', row_data[item] === '1');
        });
    }

    // 表单提交
    function sendData(afterfnSure){
        var $dockForm = $('form.add_task');
        if (!base.formValidate($dockForm)) {
            return false;
        } else {
            // 获取数据前 禁用选中的'其他'选择框, 避免选到这两个无关数据
            $('[name="price"][data-show]:checked,[name="taskprice"][data-show]:checked').prop('disabled',true);
            var sendData = $dockForm.serializeArray();
            var operType = oper_task.box.operType;
            $.ajax({
                url: "_HOST_/task/"+operType,
                type: "POST",
                dataType: "json",
                data: sendData
            }).done(function(data){
                if(data.status == 1){
                    afterfnSure && afterfnSure(true, data && data.msg);
                    operType === 'insert' && window.open('_HOST_/page/task_detail/'+data.data);
                }else if(data.status == 2){
                    //任务链接错误的情况
                    oper_task && oper_task.box && oper_task.box.show();
                    $dockForm.find('[name="storeurl"]').focus().parent().operTip((data && data.msg) || "任务链接错误!",{theme: "danger",dir:'bottom',css:{'white-space':'nowrap'}});
                }
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
            html: "_HOST_/page/task_add .add_task_form",
            css: {
                "min-width": "320px"
            },
            fnSure: function(that,fn) {
                if(!sendData(that && that.afterfnSure)){
                    return false;
                };
            },
            fnCancel: function(t) {}
        });
        // 暴露给弹窗主页面的方法
        window.oper_task = {
            box: box,
            initWidget: initWidget,
            source_data: source_data,
            renderTaskForm: renderTaskForm
        };
    }
    // 非弹框时才作日期控件初始化（弹框运行时该段js先于添加任务页面dom渲染前执行）
    if($(".date_start").length){
        initWidget();
        $('form.add_task [name="storeurl"]').attr('data-validate-dir','');
    }else{
        beforeDialog();
    };

    // 来源框置为suggest控件
    $('.source_id_ct').suggest({
        key: 'id',
        val: 'name',
        $key_ct: $('[name="source_id"]'),
        $val_ct: $('.source_name'),
        url: '_HOST_/source/query'
    });

    // 选择日期后调整对应日期控件的可选范围
    $("body").on("change",'.date_start,.date_end',function(){
        if($(this).is('.date_start')){
            date_end.cgOpt({min: $(this).val()});
        }else{
            date_start.cgOpt({max: $(this).val()});
        }
    }).on("click",'.btn_task_submit',function(){
        // 非弹框时提交
        sendData(function(tip){

        });
    });
});
